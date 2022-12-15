import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  /**
   * Generate 1_000_000 random int to the list
   */
  async generateList() {
    const start = Date.now();
    const limit = 1_000_000;

    for (let i = 0; i < limit; i++) {
      const value = this.randomIntFromInterval(1, 10_000);

      await this.redis.lpush(`list`, value);
    }

    const end = Date.now();

    return `Strings. List for ${limit} generated in ${end - start}ms`;
  }

  /**
   * Get list len
   */
  async getLength() {
    const start = Date.now();

    const length = await this.redis.llen(`list`);

    const end = Date.now();

    return {
      length,
      time: end - start,
    };
  }

  /**
   * Get uniq values and count
   */
  async getUniq() {
    const start = Date.now();
    let elem = await this.redis.lpop(`list`);

    let uniqCount = 0;

    while (elem) {
      const redisResponse = await this.redis.sadd(`set`, elem);
      uniqCount += redisResponse;

      elem = await this.redis.lpop(`list`);
    }

    const end = Date.now();

    return `Sets. List has ${uniqCount} uniq keys. Found in ${end - start}ms`;
  }

  async getTopTenUniq() {
    const start = Date.now();
    let elem = await this.redis.lpop(`list`);

    while (elem) {
      await this.redis.zincrby(`zset`, 1, elem);

      elem = await this.redis.lpop(`list`);
    }

    const topTen = await this.redis.zrange(`zset`, 0, 10);

    const end = Date.now();

    return `Sets. List has ${topTen.join(',')}. Found in ${end - start}ms`;
  }

  private randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
