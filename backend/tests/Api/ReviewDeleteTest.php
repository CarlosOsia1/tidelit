<?php

namespace App\Tests\Api;

use App\Entity\Review;

class ReviewDeleteTest extends ApiTestCase
{
    public function testDeleteReturns204(): void
    {
        $review = $this->entityManager->getRepository(Review::class)->findOneBy([]);
        $reviewId = $review->getId();

        $this->client->request('DELETE', '/api/reviews/' . $reviewId);

        self::assertResponseStatusCodeSame(204);

        $this->entityManager->clear();
        self::assertNull($this->entityManager->getRepository(Review::class)->find($reviewId));
    }

    public function testDeleteUnknownReturns404(): void
    {
        $this->client->request('DELETE', '/api/reviews/999999');

        self::assertResponseStatusCodeSame(404);
    }
}
