import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export class ResponseHelper {
    static success(res: Response, data: any, status: number = HttpStatus.OK) {
        return res.status(status).json({
            success: true,
            status,
            data,
            error: null,
        });
    }

    static error(res: Response, error: any) {
        const code = error?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error?.response?.data?.error ?? error.message ?? 'Internal Server Error';
        return res.status(code).json({
            success: false,
            status: code,
            data: null,
            error: message,
        });
    }
}