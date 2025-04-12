import {fromEvent, map, Observable} from 'rxjs';

import {Sse, Controller, Res, Param, UseFilters} from '@nestjs/common';
import {EventEmitter2} from "@nestjs/event-emitter";
import {HttpExceptionFilter} from "../shared/ExceptionFilter";

@Controller('sse')
@UseFilters(new HttpExceptionFilter())
export class SSEController {
    constructor(private eventEmitter: EventEmitter2) {}

    @Sse(':channel')
    sse(@Param('channel') channel: string): Observable<{ data: string }> {
        return fromEvent(this.eventEmitter, channel).pipe(
            map((data: any) => ({
                data: JSON.stringify(data),
            })),
        );
    }
}