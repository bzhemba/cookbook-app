import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const startTime = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const endTime = Date.now();
                    const elapsedTime = endTime - startTime;

                    console.log(`Request to ${request.url} took ${elapsedTime}ms`);

                    response.locals.serverLoadTime = elapsedTime;
                    response.setHeader('X-Elapsed-Time', elapsedTime.toString());
                }),
            );
    }

}