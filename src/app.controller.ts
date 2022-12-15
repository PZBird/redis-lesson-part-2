import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { LeaderBoardService } from './leader-board.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly leaderBoardService: LeaderBoardService,
  ) {}

  @Get('generate')
  async generateList() {
    return this.appService.generateList();
  }

  @Get('len')
  async readStrings() {
    return this.appService.getLength();
  }

  @Get('uniq')
  async generateHashes() {
    return this.appService.getUniq();
  }

  @Get('top-ten')
  async readHashes() {
    return this.appService.getTopTenUniq();
  }

  @Get('gen-lb')
  async generateLeaderBoard() {
    return this.leaderBoardService.generateLeaderBoard();
  }

  @Get('add-score')
  async addRndScore() {
    return this.leaderBoardService.addRndScore();
  }

  @Get('recalc-score')
  async recalcScore() {
    return this.leaderBoardService.recalcScore();
  }

  @Get('top-ten')
  async top() {
    return this.leaderBoardService.top();
  }

  @Get('my/:id')
  async mypos(@Param('id') id: string) {
    return this.leaderBoardService.mypos(id);
  }
}
