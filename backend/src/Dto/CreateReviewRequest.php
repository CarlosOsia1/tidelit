<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreateReviewRequest
{
    #[Assert\NotNull(message: 'book_id is required')]
    public ?int $bookId = null;

    #[Assert\NotNull(message: 'rating is required')]
    #[Assert\Range(min: 1, max: 5, notInRangeMessage: 'rating must be between {{ min }} and {{ max }}')]
    public ?int $rating = null;

    #[Assert\NotBlank(message: 'comment must not be empty', normalizer: 'trim')]
    public ?string $comment = null;
}
