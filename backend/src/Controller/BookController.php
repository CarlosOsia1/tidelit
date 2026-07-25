<?php

namespace App\Controller;

use App\Dto\BookDetail;
use App\Dto\BookListItem;
use App\Dto\ReviewItem;
use App\Repository\BookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/books', name: 'api_books_')]
class BookController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(BookRepository $books): JsonResponse
    {
        $items = array_map(
            static fn (array $row): BookListItem => new BookListItem(
                $row['id'],
                $row['title'],
                $row['author'],
                $row['publishedYear'],
                $row['averageRating'] !== null ? round((float) $row['averageRating'], 1) : null,
            ),
            $books->findAllWithAverageRating(),
        );

        return $this->json($items);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id, BookRepository $books): JsonResponse
    {
        $book = $books->find($id);
        if ($book === null) {
            return $this->json(
                ['errors' => [['field' => null, 'message' => 'Book not found']]],
                Response::HTTP_NOT_FOUND,
            );
        }

        $reviews = [];
        $sum = 0;
        foreach ($book->getReviews() as $review) {
            $reviews[] = ReviewItem::fromEntity($review);
            $sum += $review->getRating();
        }

        $count = count($reviews);

        $detail = new BookDetail(
            $book->getId(),
            $book->getTitle(),
            $book->getAuthor(),
            $book->getPublishedYear(),
            $count > 0 ? round($sum / $count, 1) : null,
            $count,
            $reviews,
        );

        return $this->json($detail);
    }
}
