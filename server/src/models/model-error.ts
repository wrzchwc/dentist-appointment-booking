export type HttpClientErrorCode = 400 | 404;

export class ModelError extends Error {
    httpCode: HttpClientErrorCode;

    constructor(message: string, httpCode: HttpClientErrorCode) {
        super(message);
        this.httpCode = httpCode;
    }
}
