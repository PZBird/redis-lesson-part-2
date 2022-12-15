import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class LeaderBoardService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async generateLeaderBoard() {
    const size = 50;

    for (let i = 0; i < size; i += 1) {
      const score = this.randomIntFromInterval(0, 100);
      const id = this.randomIntFromInterval(1, 1_000_00);

      await this.redis.zadd(`lb`, score, id);
    }
  }
  async addRndScore() {
    const [player] = await this.redis.zrandmember(`lb`, 1);
    const score = this.randomIntFromInterval(0, 100);

    await this.redis.zincrby(`lb`, score, player);
  }

  async recalcScore() {
    const size = 50;

    for (let i = 0; i < size; i += 1) {
      const score = this.randomIntFromInterval(0, 100);
      const [id] = await this.redis.zrandmember(`lb`, 1);

      await this.redis.zincrby(`lb`, score, id);
    }
  }

  async top(number = 10) {
    return this.redis.zrange(`lb`, -number, -1, 'WITHSCORES');
  }

  async mypos(id: string) {
    return this.redis.zrevrank(`lb`, id);
  }

  private randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
