import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AquaLabGroupGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = decode(token);
        
        if (!decoded?.group) {
            throw new ForbiddenException('Invalid token payload or no groups found');
        }

        const userGroups: string[] = decoded.group;
        if (!userGroups.includes('/Aqua Lab')) {
            throw new ForbiddenException('User does not belong to Aqua Lab group');
        }

        request['user'] = decoded;

        return true;
    }
}
