import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationService {
    notificationEvent: Subject<any> = new Subject();
    async handleConnection() {
        setInterval(() => {
            this.notificationEvent.next({ data: { message: 'Hello World' } });
        }, 1000);
        return this.notificationEvent.asObservable();
    }
}