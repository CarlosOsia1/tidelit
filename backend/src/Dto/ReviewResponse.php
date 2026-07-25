<?php

namespace App\Dto;

use App\Entity\Review;

class ReviewResponse
{
    public function __construct(
        public readonly int $id,
        public readonly int $bookId,
        public readonly int $rating,
        public readonly string $comment,
        public readonly string $createdAt,
    ) {
    }

    public static function fromEntity(Review $review): self
    {
        return new self(
            $review->getId(),
            $review->getBook()->getId(),
            $review->getRating(),
            $review->getComment(),
            $review->getCreatedAt()->format(\DateTimeInterface::ATOM),
        );
    }
}
