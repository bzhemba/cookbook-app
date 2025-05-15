import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;

        console.log(`Request to ${request.url} took ${elapsedTime}ms`);

        if (response.locals) {
          response.locals.serverLoadTime = elapsedTime;
        } else {
          response.locals = { serverLoadTime: elapsedTime };
        }
      }),
    );
  }
}
