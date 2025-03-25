{{ $vote->description }}

<br><br>

<code>
    {{ implode(
        '',
        array_map(
            fn(\App\Enums\MemberVotePosition $position) => str_repeat($position->getBoxEmoji(), $bars[$position->value]),
            $positions
        )
    ) }}
</code>

<br><br>

<table>
    <thead>
        <tr>
            <th></th>
            @foreach(\App\Enums\MemberVotePosition::cases() as $position)
                <th>
                    {{ $position->getEmoji() }} {{ $position->getShortTitle() }}
                </th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach($votesByParty as $party => $voteData)
            <tr>
                <td>
                    <b>{{ $party }}</b>
                </td>
                @foreach(\App\Enums\MemberVotePosition::cases() as $position)
                    <td>
                        {{ $voteData[$position->value]  }}
                        <small>({{ $voteData[$position->value . '_percentage'] }} %)</small>
                    </td>
                @endforeach
            </tr>
        @endforeach
    </tbody>
</table>

@if($vote->documents->isNotEmpty())

    <h3>Quellen</h3>

    @foreach($vote->documents as $document)
        <a href="{{ $document->url }}" target="_blank">{{ $document->title }}</a>
    @endforeach
@endif
