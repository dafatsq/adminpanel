import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import * as express from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<express.Response>();
        const request = ctx.getRequest<express.Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Terjadi kesalahan pada server';

        // If not authenticated and trying to access protected page, redirect to login
        if (status === HttpStatus.FORBIDDEN || status === HttpStatus.UNAUTHORIZED) {
            return response.redirect('/login?error=Silakan login terlebih dahulu');
        }

        console.error('Exception:', exception);

        response.status(status).render('error', {
            layout: 'main',
            title: `Error ${status}`,
            statusCode: status,
            message,
            user: request.user || null,
        });
    }
}
