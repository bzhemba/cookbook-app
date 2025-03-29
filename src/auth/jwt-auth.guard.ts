import {Injectable, ExecutionContext, Logger, ForbiddenException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    canActivate(context: ExecutionContext) {
        this.logger.log('Checking JWT authentication');
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        if (err || !user) {
            this.logger.error('JWT authentication failed', err || 'User not found');
            throw err || new ForbiddenException('Access denied');
        }

        return user;
    }
}