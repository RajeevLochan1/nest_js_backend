import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDto) {
    //generate password
    const hash = await argon.hash(dto.password);

    //save the new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          hash,
        },
      });
      delete user.hash;

      //return the saved user
      return {
        message: 'Signup successful',
        token: await this.signToken(user.id, user.email),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential taken');
        } //duplicate field P2002
      }
      throw error;
    }
  }


  async signin(dto: AuthDto) {
    //find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if user does not exist throw error
    if (!user) {
      // throw new ForbiddenException('Credential incorrect');
      throw new ForbiddenException('Incorrect email');
    }

    //compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    //if password incorrect throw exception
    if (!pwMatches) {
      // throw new ForbiddenException('Credential incorrect');
      throw new ForbiddenException('Incorrect password');
    }

    //send back the user
    return {
      message: 'Signin successful',
      token: await this.signToken(user.id, user.email),
    };
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
