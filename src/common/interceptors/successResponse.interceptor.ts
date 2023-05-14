import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

// 컨트롤러 실행 전, 후
@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 컨트롤러 실행 전
    //

    return next
      .handle() // 컨트롤러 실행 후
      .pipe(
        map(async (data) => {
          const responseData = {
            success: true,
            status: 200,
            data: data ? data : null,
            newAccessToken: '',
          };

          if (context.getArgs()[0]?.user?.needNewAccessToken) {
            const { newAccessToken } = await this.authService.getTokens(context.getArgs()[0]?.user);
            responseData.newAccessToken = newAccessToken;
          }

          return responseData;
        })
      );
  }
}
