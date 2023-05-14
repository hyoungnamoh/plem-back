import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
      const decodedToken: any = this.jwtService.decode(token);
      if (!decodedToken) {
        throw new HttpException('유효하지 않은 토큰입니다.', 410);
      }

      // accessToken 기간 체크
      const tokenExp = new Date(decodedToken['exp'] * 1000);
      const now = new Date();

      // 남은시간 (분)
      const betweenTime = Math.floor((tokenExp.getTime() - now.getTime()) / 1000 / 60);
      const needNewAccessToken = betweenTime < 3;
      const secretKey = needNewAccessToken ? process.env.REFRESH_SECRET : process.env.SECRET;
      const targetToken = needNewAccessToken ? decodedToken.refreshToken : token;
      const verify = this.jwtService.verify(targetToken, { secret: secretKey });

      return { ...verify, refreshToken: decodedToken.refreshToken, needNewAccessToken };
    } catch (e: any) {
      console.info('validateToken', e.message);
      switch (e.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid token':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
        case 'invalid signature':
          throw new HttpException('유효하지 않은 토큰입니다.', 410);
        case 'EXPIRED_TOKEN':
        case 'jwt expired':
          throw new HttpException('토큰이 만료되었습니다.', 410);
        default:
          throw new HttpException('토큰 인증 오류입니다.', 500);
      }
    }
  }
}
