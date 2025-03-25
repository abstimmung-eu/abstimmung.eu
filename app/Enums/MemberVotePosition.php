<?php

namespace App\Enums;

enum MemberVotePosition: string
{
    case FOR = 'for';
    case AGAINST = 'against';
    case ABSTENTION = 'abstention';

    public function getShortTitle(): string
    {
        return match ($this) {
            self::FOR => 'Ja',
            self::AGAINST => 'Nein',
            self::ABSTENTION => 'Enthalten',
        };
    }

    public function getTitle(): string
    {
        return match ($this) {
            self::FOR => 'Dafür',
            self::AGAINST => 'Dagegen',
            self::ABSTENTION => 'Nicht abgestimmt',
        };
    }

    public function getEmoji(): string
    {
        return match ($this) {
            self::FOR => '✅',
            self::AGAINST => '❌',
            self::ABSTENTION => '◽',
        };
    }

    public function getBoxEmoji(): string
    {
        return match ($this) {
            self::FOR => '🟩',
            self::AGAINST => '🟥',
            self::ABSTENTION => '⬜',
        };
    }
}
