import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = exception.message || 'Something went wrong';

    if (status === HttpStatus.FORBIDDEN) {
      return res.status(403).send("Forbidden resource");
    }

    if (
      status === HttpStatus.UNAUTHORIZED ||
      message.toLowerCase().includes('invalid')
    ) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send('Unauthorized Resource');
    }

    if (status === HttpStatus.NOT_FOUND) {
      return res.status(status).send(`Not-found', ${message}}` );
    }

    // Optional: handle 404, 500 etc.
    return res.status(status).send(message);
  }
}
