import Redis from 'ioredis';
import Redlock from 'redlock';

export const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
});

export const redlock = new Redlock([redis as any], {
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 200, //tempo entre tentativas em ms
    retryJitter: 200,
});
