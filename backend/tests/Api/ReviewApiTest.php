<?php

namespace App\Tests\Api;

use App\Entity\Book;

class ReviewApiTest extends ApiTestCase
{
    private function existingBookId(): int
    {
        return $this->entityManager->getRepository(Book::class)
            ->findOneBy(['title' => 'Clean Code'])
            ->getId();
    }

    public function testCreateReviewReturns201(): void
    {
        $bookId = $this->existingBookId();

        $data = $this->jsonRequest('POST', '/api/reviews', [
            'book_id' => $bookId,
            'rating' => 5,
            'comment' => 'Excelente libro',
        ]);

        self::assertResponseStatusCodeSame(201);
        self::assertArrayHasKey('id', $data);
        self::assertSame($bookId, $data['book_id']);
        self::assertSame(5, $data['rating']);
        self::assertSame('Excelente libro', $data['comment']);
        self::assertArrayHasKey('created_at', $data);
    }

    public function testRatingOutOfRangeReturns400(): void
    {
        $data = $this->jsonRequest('POST', '/api/reviews', [
            'book_id' => $this->existingBookId(),
            'rating' => 9,
            'comment' => 'Comentario valido',
        ]);

        self::assertResponseStatusCodeSame(400);
        self::assertSame('rating', $data['errors'][0]['field']);
    }

    public function testUnknownBookReturns400(): void
    {
        $data = $this->jsonRequest('POST', '/api/reviews', [
            'book_id' => 999999,
            'rating' => 3,
            'comment' => 'Comentario valido',
        ]);

        self::assertResponseStatusCodeSame(400);
        self::assertSame('book_id', $data['errors'][0]['field']);
    }

    public function testEmptyCommentReturns400(): void
    {
        $this->jsonRequest('POST', '/api/reviews', [
            'book_id' => $this->existingBookId(),
            'rating' => 3,
            'comment' => '',
        ]);

        self::assertResponseStatusCodeSame(400);
    }

    public function testWhitespaceCommentReturns400(): void
    {
        $this->jsonRequest('POST', '/api/reviews', [
            'book_id' => $this->existingBookId(),
            'rating' => 3,
            'comment' => '   ',
        ]);

        self::assertResponseStatusCodeSame(400);
    }

    public function testMissingRatingReturns400(): void
    {
        $this->jsonRequest('POST', '/api/reviews', [
            'book_id' => $this->existingBookId(),
            'comment' => 'Comentario valido',
        ]);

        self::assertResponseStatusCodeSame(400);
    }

    public function testInvalidJsonReturns400(): void
    {
        $this->client->request(
            'POST',
            '/api/reviews',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            '{ invalid json',
        );

        self::assertResponseStatusCodeSame(400);
    }
}
