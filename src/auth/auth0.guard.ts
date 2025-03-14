import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class Auth0Guard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const canActivate = await super.canActivate(context);
        if (!canActivate) {
            return false;
        }

        const request = context.switchToHttp().getRequest();
        if (!request.oidc || !request.oidc.isAuthenticated) {
            return false;
        }

        return request.oidc.isAuthenticated();
    }
}