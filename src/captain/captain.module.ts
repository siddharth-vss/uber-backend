import { Module } from '@nestjs/common';
import { CaptainController } from './captain.controller';
import { CaptainService } from './captain.service';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/services/auth.service';

@Module({
  controllers: [CaptainController],
  providers: [CaptainService,PrismaService,AuthService]
})
export class CaptainModule {}
