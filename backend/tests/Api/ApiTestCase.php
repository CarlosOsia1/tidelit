<?php

namespace App\Tests\Api;

use App\DataFixtures\AppFixtures;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class ApiTestCase extends WebTestCase
{
    protected KernelBrowser $client;
    protected EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get('doctrine')->getManager();

        $executor = new ORMExecutor($this->entityManager, new ORMPurger($this->entityManager));
        $executor->execute([new AppFixtures()]);
    }

    protected function jsonRequest(string $method, string $uri, ?array $payload = null): array
    {
        $this->client->request(
            $method,
            $uri,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            $payload === null ? null : json_encode($payload),
        );

        return json_decode($this->client->getResponse()->getContent(), true);
    }
}
