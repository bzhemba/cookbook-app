import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crc32 from 'crc-32';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const clientEtag = request.headers['if-none-match'];

        return next.handle().pipe(
            tap((data) => {
                if (response.headersSent) return;

                const serverEtag = `W/"${crc32.str(JSON.stringify(data)).toString(16)}"`;

                if (clientEtag && clientEtag === serverEtag) {
                    response.status(304);
                    return;
                }
                else {
                    response.setHeader('ETag', serverEtag);
                    response.setHeader('Cache-Control', 'public, max-age=50');
                }
            }),
        );
    }
}