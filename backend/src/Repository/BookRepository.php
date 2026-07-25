<?php

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Book>
 */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    /**
     * @return array<int, array{id: int, title: string, author: string, publishedYear: int, averageRating: ?string}>
     */
    public function findAllWithAverageRating(): array
    {
        return $this->createQueryBuilder('b')
            ->select(
                'b.id AS id',
                'b.title AS title',
                'b.author AS author',
                'b.publishedYear AS publishedYear',
                'AVG(r.rating) AS averageRating'
            )
            ->leftJoin('b.reviews', 'r')
            ->groupBy('b.id')
            ->orderBy('b.id', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
