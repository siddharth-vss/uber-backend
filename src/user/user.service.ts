import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcryptjs';
import { Request, Response } from 'express';
import { AuthService } from 'src/services/auth.service';

const ind = [
  '.fgrt.wer',
  '.cat/ewe',
  '.srt_rey',
  '.tere.wer',
  '.eryew+reye.wer',
  '.ererg-wertgr',
  '.ferergerg',
  '.jewbfkobpj',
  '.kqjdgqheweekhoikjn',
  '.qerihgq[ebpmi];jkqerfb',
];

export interface Login {
  email: string;
  password: string;
}
export interface Register extends Login {
  fullname: {
    firstname: string;
    lastname?: string;
  };
  socketId?: string;
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async register(data: Register) {
    const npr = Math.floor(Math.random() * 9 + 1);
    const ext = ind[npr];
    const salt = await genSalt(10);
    if (
      !data.email ||
      !data.password ||
      !data.fullname.firstname ||
      !data.fullname
    ) {
      return{ status :HttpStatus.BAD_REQUEST,message :"provide all data"};
    }
    const has = await hash(data.password, salt);
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (user) {
        return { status :HttpStatus.BAD_REQUEST,message :"user found alredy "};
      }
      const newUser = await this.prisma.user.create({
        data: {
          ...data,
          password: has,
          source: data.password + ext,
          socketId: data.socketId ?? '',
        },
      });
      const token = sign({ _id: newUser.id }, process.env.JWT_SECRET);
      return { token, newUser };
    } catch (error) {
      console.log(error);
      return { status :HttpStatus.BAD_REQUEST,message :error};
    }
  }

  async login(data: Login) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (!user) {
        return { status :HttpStatus.BAD_REQUEST,message :"user not exits"};
      }

      const match = await compare(data.password, user.password);
      if (!match) {
        return { status :HttpStatus.BAD_REQUEST,message :"check credentials "};
      }
      const token = sign({ _id: user.id }, process.env.JWT_SECRET);
      return { token, user };
    } catch (error) {
      console.log(error);
      return { status :HttpStatus.BAD_REQUEST,message :error};
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async updateUser(id: string, user: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id: id }, data: user });
  }
  async logoutUser(req: Request, res: Response) {
    try {
      res.clearCookie('token');
      const token =
        req.cookies.token || req.headers.authorization.split(' ')[1];

      await this.authService.blacklistToken(token);
      return  res.json({ message: 'Logged out and cookies cleared' });
    } catch (error) {
      console.log(error);
    }
  }
}
