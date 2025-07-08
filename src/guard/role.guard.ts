import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(public readonly allowedRoles: string[]) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Authorization token missing');
        }

        const token = authHeader.split(' ')[1];
        try {
            const decodedToken: any = decode(token);

            const userRoles = decodedToken?.realm_access?.roles ?? [];

            const d = this.allowedRoles.some((role) => userRoles.includes(role));
            return d;
        } catch (err) {
            console.log(err.message);
            throw new UnauthorizedException('Invalid token');
        }
    }
}

