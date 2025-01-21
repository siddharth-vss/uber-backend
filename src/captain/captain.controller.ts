import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CaptainService, Login, Register } from './captain.service';
import { PrismaService } from 'src/prisma.service';
import { Request, Response } from 'express';

@Controller('captains')
export class CaptainController {
  constructor(
    private prisma: PrismaService,
    private captainService: CaptainService,
  ) {}

  @Get()
  async getAllCaptains() {
    return "captains"
    // return await this.prisma.captain.findMany();
  }
  @Get('profile')
    getUser(@Req() req: Request) {
      return (req.captain);
    }
  
    @Get('logout')
    async logoutUser(@Req() req: Request , @Res() res :Response) {
      return await this.captainService.logoutUser(req,res);
    }
  @Post('register')
  async registerCaptain(@Body() captain: Register) {
    return await this.captainService.register(captain);
  }
  @Post('login')
  async loginCaptain(@Body() captain: Login) {
    return await this.captainService.login(captain);
  }
}
