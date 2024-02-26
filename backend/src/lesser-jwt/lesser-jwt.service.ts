import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LesserJwtService {
  constructor(private readonly jwtService: JwtService) {}
  createTempIdToken(sub: object): Promise<string> {
    const payload = { sub };
    const options = { expiresIn: '30m' };
    return this.jwtService.signAsync(payload, options);
  }

  async getPayload(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new Error('Failed to verify token');
    }
  }
}
