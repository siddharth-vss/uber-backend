import { NestMiddleware, Injectable } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/user/user.service';
import { verify } from 'jsonwebtoken';
import { CaptainService } from 'src/captain/captain.service';

@Injectable()
export class AuthUser implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    // console.log(`Middleware triggered: ${req.method} ${req.path}`);

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const isBlacklisted = await this.authService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decoded: any = verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded._id) {
        throw new Error('Invalid token');
      }
      const user = await this.userService.getUserById(decoded._id);
      if (!user) {
        throw new Error('User not found');
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}

@Injectable()
export class AuthCaptain implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private captainService: CaptainService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    // console.log(`Middleware triggered: ${req.method} ${req.path}`);

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const isBlacklisted = await this.authService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decoded: any = verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded._id) {
        throw new Error('Invalid token');
      }
      const Captain = await this.captainService.getCaptainById(decoded._id);
      if (!Captain) {
        throw new Error('Captain not found');
      }
      req.captain = Captain;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
