import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] }; // class validator error

    // class validator error
    if (typeof err !== 'string' && err.statusCode === 400) {
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }
    // 내가 발생시킨 에러 ex) 이메일 중복체크
    response.status(status).json({ success: false, code: status, data: err });
  }
}
