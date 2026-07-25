<?php

namespace App\Tests\Api;

use App\Entity\Book;

class BookApiTest extends ApiTestCase
{
    public function testListReturnsBooksWithAverageRating(): void
    {
        $data = $this->jsonRequest('GET', '/api/books');

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('Content-Type', 'application/json');
        self::assertCount(3, $data);

        $byTitle = [];
        foreach ($data as $item) {
            self::assertArrayHasKey('id', $item);
            self::assertArrayHasKey('title', $item);
            self::assertArrayHasKey('author', $item);
            self::assertArrayHasKey('published_year', $item);
            self::assertArrayHasKey('average_rating', $item);
            $byTitle[$item['title']] = $item;
        }

        self::assertSame('Donald Knuth', $byTitle['El Arte de Programar']['author']);
        self::assertSame(1968, $byTitle['El Arte de Programar']['published_year']);
        self::assertSame(4.0, (float) $byTitle['El Arte de Programar']['average_rating']);
        self::assertSame(3.5, (float) $byTitle['Clean Code']['average_rating']);
        self::assertSame(2.5, (float) $byTitle['Refactoring']['average_rating']);
    }

    public function testBookWithoutReviewsHasNullAverageRating(): void
    {
        $book = new Book();
        $book->setTitle('Libro Sin Calificaciones');
        $book->setAuthor('Autor Anonimo');
        $book->setPublishedYear(2020);
        $this->entityManager->persist($book);
        $this->entityManager->flush();

        $data = $this->jsonRequest('GET', '/api/books');
        self::assertResponseIsSuccessful();

        $found = null;
        foreach ($data as $item) {
            if ($item['title'] === 'Libro Sin Calificaciones') {
                $found = $item;
            }
        }

        self::assertNotNull($found);
        self::assertNull($found['average_rating']);
    }
}
