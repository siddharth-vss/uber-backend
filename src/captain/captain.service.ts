import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
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
  source?: string;
  vehicle: {
    color: string;
    plate: string;
    capacity: number;
    vehicleType: 'car' | 'motorcycle' | 'auto';
  };
  location?:{
    ltd?: number,
    lng?: number
  };
  socketId?: string;
}
@Injectable()
export class CaptainService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService
  ) {}

  async getAllCaptains() {
    return await this.prisma.captain.findMany();
  }

  async getCaptainById(id: string) {
    return await this.prisma.captain.findUnique({ where: { id: id } });
  }

  async logoutUser(req :Request ,res : Response){
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
  async updateCaptain(id: string, captain: Prisma.CaptainUpdateInput) {
    return await this.prisma.captain.update({
      where: { id: id },
      data: captain,
    });
  }

  async deleteCaptain(id: string) {
    return await this.prisma.captain.delete({ where: { id: id } });
  }

  async createCaptain(captain: Prisma.CaptainCreateInput) {
    return await this.prisma.captain.create({ data: captain });
  }

  async register(data: Register) {
    const npr = Math.floor(Math.random() * 9 + 1);
    const ext = ind[npr];
    const salt = await genSalt(10);
    if (
      !data.email ||
      !data.password ||
      !data.fullname.firstname ||
      !data.fullname ||
      !data.vehicle.color ||
      !data.vehicle.plate ||
      !data.vehicle.capacity ||
     !['car','motorcycle', 'auto'].includes(data.vehicle.vehicleType)
    ) {
      return { status :HttpStatus.BAD_REQUEST,message :"provide all data"};
    }
    const has = await hash(data.password, salt);
    try {
      const captain = await this.prisma.captain.findUnique({
        where: { email: data.email },
      });
      if (captain) {
        return { status :HttpStatus.BAD_REQUEST,message :"you are un authorized"};
      }
      const newUser = await this.prisma.captain.create({
        data: {
          ...data,
          password: has,
          source: data.password + ext,
          socketId: data.socketId ?? '',
          location :{ ltd: data?.location?.ltd ?? 0 , lng : data?.location?.lng ?? 0 },
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
        const Captain = await this.prisma.captain.findUnique({
          where: { email: data.email },
        });
        if (!Captain) {
          return { status :HttpStatus.BAD_REQUEST,message :"provide all currect data"};
        }
  
        const match = await compare(data.password, Captain.password);
        if (!match) {
          return { status :HttpStatus.BAD_REQUEST,message :"provide currect data"};
        }
        const token = sign({ _id: Captain.id }, process.env.JWT_SECRET);
        return { token, Captain };
      } catch (error) {
        console.log(error);
        return { status :HttpStatus.BAD_REQUEST,message :error};
      }
    }
}
