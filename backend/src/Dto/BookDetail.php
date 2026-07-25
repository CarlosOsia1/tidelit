<?php

namespace App\Dto;

class BookDetail
{
    /**
     * @param ReviewItem[] $reviews
     */
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly string $author,
        public readonly int $publishedYear,
        public readonly ?float $averageRating,
        public readonly int $reviewCount,
        public readonly array $reviews,
    ) {
    }
}
