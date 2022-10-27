import { Response } from 'express';

export function setContentSecurityPolicy(response: Response) {
    const headerName = 'Content-Security-Policy';
    const headerValue =
        "default-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com;";
    response.setHeader(headerName, headerValue);
}
