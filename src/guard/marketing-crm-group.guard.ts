import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';

@Injectable()
export class MarketingCrmGroupGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = decode(token);

        if (!decoded?.group || !Array.isArray(decoded.group)) {
            throw new ForbiddenException('Token does not contain group information');
        }

        const hasAccess = decoded.group.includes('/Marketing & CRM');
        if (!hasAccess) {
            throw new ForbiddenException('User does not belong to Marketing & CRM group');
        }

        request['user'] = decoded;

        return true;
    }
}
