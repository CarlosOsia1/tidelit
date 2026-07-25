<?php

namespace App\Tests\Api;

use App\Entity\Book;

class BookDetailTest extends ApiTestCase
{
    public function testShowReturnsBookWithReviews(): void
    {
        $book = $this->entityManager->getRepository(Book::class)->findOneBy(['title' => 'Clean Code']);

        $data = $this->jsonRequest('GET', '/api/books/' . $book->getId());

        self::assertResponseIsSuccessful();
        self::assertSame($book->getId(), $data['id']);
        self::assertSame('Clean Code', $data['title']);
        self::assertSame('Robert C. Martin', $data['author']);
        self::assertSame(2008, $data['published_year']);
        self::assertSame(3.5, (float) $data['average_rating']);
        self::assertSame(2, $data['review_count']);
        self::assertCount(2, $data['reviews']);

        $review = $data['reviews'][0];
        self::assertArrayHasKey('id', $review);
        self::assertArrayHasKey('rating', $review);
        self::assertArrayHasKey('comment', $review);
        self::assertArrayHasKey('created_at', $review);
    }

    public function testShowUnknownBookReturns404(): void
    {
        $this->jsonRequest('GET', '/api/books/999999');

        self::assertResponseStatusCodeSame(404);
    }
}
