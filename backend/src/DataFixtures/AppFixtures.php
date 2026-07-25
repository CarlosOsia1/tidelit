<?php

namespace App\DataFixtures;

use App\Entity\Book;
use App\Entity\Review;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $books = [
            ['El Arte de Programar', 'Donald Knuth', 1968],
            ['Clean Code', 'Robert C. Martin', 2008],
            ['Refactoring', 'Martin Fowler', 1999],
        ];

        $reviews = [
            [0, 5, 'Una obra de referencia, densa pero imprescindible.'],
            [0, 4, 'Exigente pero muy completo en fundamentos.'],
            [0, 3, 'Valioso, aunque cuesta seguir el ritmo.'],
            [1, 5, 'Cambio mi forma de escribir codigo.'],
            [1, 2, 'Buenas ideas, algo repetitivo en los ejemplos.'],
            [2, 1, 'Esperaba mas profundidad en los casos practicos.'],
            [2, 4, 'Los ejemplos de refactor son claros y aplicables.'],
        ];

        $entities = [];
        foreach ($books as [$title, $author, $year]) {
            $book = new Book();
            $book->setTitle($title);
            $book->setAuthor($author);
            $book->setPublishedYear($year);
            $manager->persist($book);
            $entities[] = $book;
        }

        foreach ($reviews as [$bookIndex, $rating, $comment]) {
            $review = new Review();
            $review->setBook($entities[$bookIndex]);
            $review->setRating($rating);
            $review->setComment($comment);
            $manager->persist($review);
        }

        $manager->flush();
    }
}
