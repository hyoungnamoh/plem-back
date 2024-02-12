import { ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('RefreshJwtAuthGuard');

  constructor(private jwtService: JwtService) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (authorization === undefined) {
      throw new HttpException('token 없음', HttpStatus.UNAUTHORIZED);
    }
    const token = authorization.replace('Bearer ', '');
    request.user = this.validateToken(token);
    return true;
  }

  validateToken(token: string) {
    try {
      const verify = this.jwtService.verify(token, { secret: process.env.REFRESH_SECRET });

      return verify;
    } catch (e: any) {
      this.logger.log(`RefreshJwtAuthGuard validateToken ${token}: ${e.message}`);
      switch (e.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid token':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
        case 'invalid signature':
          throw new HttpException('유효하지 않은 토큰입니다.', 411);
        case 'EXPIRED_TOKEN':
        case 'jwt expired':
          throw new HttpException('토큰이 만료되었습니다.', 420);
        default:
          throw new HttpException('토큰 인증 오류입니다.', 411);
      }
    }
  }
}
