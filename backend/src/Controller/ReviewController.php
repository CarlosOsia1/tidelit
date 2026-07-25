<?php

namespace App\Controller;

use App\Dto\CreateReviewRequest;
use App\Dto\ReviewResponse;
use App\Entity\Review;
use App\Repository\BookRepository;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/reviews', name: 'api_reviews_')]
class ReviewController extends AbstractController
{
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        BookRepository $books,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        try {
            $payload = $serializer->deserialize($request->getContent(), CreateReviewRequest::class, 'json');
        } catch (ExceptionInterface) {
            return $this->json(
                ['errors' => [['field' => null, 'message' => 'Invalid request body']]],
                Response::HTTP_BAD_REQUEST,
            );
        }

        $violations = $validator->validate($payload);
        if (count($violations) > 0) {
            return $this->json(['errors' => $this->formatViolations($violations)], Response::HTTP_BAD_REQUEST);
        }

        $book = $books->find($payload->bookId);
        if ($book === null) {
            return $this->json(
                ['errors' => [['field' => 'book_id', 'message' => 'Book not found']]],
                Response::HTTP_BAD_REQUEST,
            );
        }

        $review = new Review();
        $review->setBook($book);
        $review->setRating($payload->rating);
        $review->setComment($payload->comment);

        $entityManager->persist($review);
        $entityManager->flush();

        return $this->json(ReviewResponse::fromEntity($review), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id, ReviewRepository $reviews, EntityManagerInterface $entityManager): Response
    {
        $review = $reviews->find($id);
        if ($review === null) {
            return $this->json(
                ['errors' => [['field' => null, 'message' => 'Review not found']]],
                Response::HTTP_NOT_FOUND,
            );
        }

        $entityManager->remove($review);
        $entityManager->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    private function formatViolations(ConstraintViolationListInterface $violations): array
    {
        $errors = [];
        foreach ($violations as $violation) {
            $errors[] = [
                'field' => $this->toSnakeCase($violation->getPropertyPath()),
                'message' => $violation->getMessage(),
            ];
        }

        return $errors;
    }

    private function toSnakeCase(string $value): string
    {
        return strtolower(preg_replace('/[A-Z]/', '_$0', $value));
    }
}
