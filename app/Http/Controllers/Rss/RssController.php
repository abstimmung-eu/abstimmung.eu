<?php

namespace App\Http\Controllers\Rss;

use App\Enums\MemberVotePosition;
use App\Models\Vote;
use FeedWriter\ATOM;
use Illuminate\Contracts\Config\Repository as ConfigRepository;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Illuminate\Support\Collection;
use Inertia\ServiceProvider;

class RssController
{
    public function __construct(
        private ConfigRepository $config,
        private UrlGenerator     $url,
        private ResponseFactory  $responseFactory,
        private ViewFactory      $viewFactory
    )
    {
    }

    public function __invoke()
    {
        $feed = new ATOM();

        $feed->setTitle($this->config->get('app.name'));
        $feed->setLink($this->config->get('app.url'));
        $feed->setDescription($this->config->get('app.name'));

        $feed->setImage($this->url->asset('/favicon.svg'), $this->config->get('app.name'), $this->config->get('app.url'));

        $feed->setChannelElement('language', $this->config->get('app.locale'));
        $feed->setChannelElement('copyright', $this->config->get('app.name'));

        $feed->setDate(time());
        $feed->setChannelElement('pubDate', date(\DATE_RSS, strtotime('2025-03-25')));

        $feed->setSelfLink($this->url->route('rss.index'));

        $positions = MemberVotePosition::cases();

        Vote::query()
            ->with([
                'memberVotes',
                'documents',
            ])
            ->each(function (Vote $vote) use (&$feed, $positions) {
                if ($vote->status !== 'completed') {
                    return;
                }

                /** @var \Illuminate\Support\Collection<int, \App\Models\MemberVote> $memberVotes */
                $memberVotes = $vote->memberVotes;

                // Group votes by party with abs + percentages

                $votesByParty = $memberVotes
                    ->groupBy('group')
                    ->sortByDesc(fn(Collection $groupVotes) => $groupVotes->count())
                    ->map(function (Collection $groupVotes) {
                        $forCount = $groupVotes->where('vote_position', MemberVotePosition::FOR->value)->count();
                        $againstCount = $groupVotes->where('vote_position', MemberVotePosition::AGAINST->value)->count();
                        $abstentionCount = $groupVotes->where('vote_position', MemberVotePosition::ABSTENTION->value)->count();
                        $total = $forCount + $againstCount + $abstentionCount;

                        return [
                            'total' => $total,
                            MemberVotePosition::FOR->value => $forCount,
                            MemberVotePosition::AGAINST->value => $againstCount,
                            MemberVotePosition::ABSTENTION->value => $abstentionCount,
                            'for_percentage' => $total > 0 ? round(($forCount / $total) * 100, 1) : 0,
                            'against_percentage' => $total > 0 ? round(($againstCount / $total) * 100, 1) : 0,
                            'abstention_percentage' => $total > 0 ? round(($abstentionCount / $total) * 100, 1) : 0,
                        ];
                    });

                $totalVotes = $memberVotes->count();

                // Group votes by position (yes, no, none)

                $votesByPosition = array_combine(
                    array_map(fn(MemberVotePosition $position) => $position->value, $positions),
                    array_map(function (MemberVotePosition $position) use ($memberVotes, $totalVotes) {
                        return [
                            'count' => $count = $memberVotes->where('vote_position', $position->value)->count(),
                            'percentage' => $totalVotes > 0 ? round(($count / $totalVotes) * 100) : 0,
                        ];
                    }, $positions)
                );

                // Create a 10-bar progress segment for emoji progress bar

                $bars = self::makeBars($votesByPosition);

                $description = $this->viewFactory->make('rss.base', [
                    'vote' => $vote,
                    'votesByParty' => $votesByParty,
                    'votesByPosition' => $votesByPosition,
                    'positions' => $positions,
                    'bars' => $bars,
                ])->toHtml();

                $item = $feed->createNewItem();

                $item->setTitle($vote->title);
                $item->setLink($itemUrl = $this->url->route('vote.show', $vote->id));

                $item->setDescription($description);

                $item->setDate($vote->vote_date->format('Y-m-d H:i:s'));

                // $item->addEnclosure($image->url, $image->meta('size'), $image->meta('mime_type'));

                $item->setAuthor($this->config->get('app.name'));

                $item->setId($itemUrl, true);

                $feed->addItem($item);
            }, count: 200);

        $feedContent = $feed->generateFeed();

        return $this
            ->responseFactory
            ->make($feedContent)
            ->header('Content-Type', 'text/xml');
    }

    private function makeBars(array $votesByPosition): array
    {
        $positions = MemberVotePosition::cases();
        $bars = [];
        $remaining = 10;

        // First pass - calculate initial blocks

        foreach ($positions as $position) {
            $blocks = min(round($votesByPosition[$position->value]['percentage'] / 10), $remaining);
            $bars[$position->value] = $blocks;
            $remaining -= $blocks;
        }

        // If we have remaining blocks, assign them to the highest percentage

        if ($remaining > 0) {
            $highestPosition = array_reduce($positions, function ($carry, $position) use ($votesByPosition) {
                if ( ! $carry || $votesByPosition[$position->value]['percentage'] > $votesByPosition[$carry->value]['percentage']) {
                    return $position;
                }
                return $carry;
            });

            $bars[$highestPosition->value] += $remaining;
        }

        return $bars;
    }
}
