<?php

namespace App\Dto;

class BookListItem
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly string $author,
        public readonly int $publishedYear,
        public readonly ?float $averageRating,
    ) {
    }
}
