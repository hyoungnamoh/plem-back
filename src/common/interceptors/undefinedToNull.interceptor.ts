import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

// 컨트롤러 실행 전, 후
@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 컨트롤러 실행 전
    //

    return next
      .handle() // 컨트롤러 실행 후
      .pipe(map((data) => (data === undefined ? null : data)));
  }
}
