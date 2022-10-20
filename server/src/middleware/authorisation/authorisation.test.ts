import { NextFunction, Request, Response } from 'express';
import { authorisation } from './authorisation';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
const mockNext: NextFunction = jest.fn();

describe('authorisation middleware', () => {
    beforeEach(() => {
        mockResponse = { json: jest.fn() };
    });

    test('Should return 403 if user not authenticated', () => {
        mockRequest = { session: {} };

        authorisation(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.statusCode).toBe(403);
        expect(mockResponse.json).toBeCalledWith({ error: 'User unauthorized!' });
        expect(mockNext).not.toBeCalled();
    });

    test('Should return 403 if user unauthorised', () => {
        mockRequest = { session: { passport: { user: { isAdmin: false } } } };

        authorisation(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.statusCode).toBe(403);
        expect(mockResponse.json).toBeCalledWith({ error: 'User unauthorized!' });
        expect(mockNext).not.toBeCalled();
    });

    test('Should forward request if user authorised', () => {
        mockRequest = { session: { passport: { user: { isAdmin: true } } } };

        authorisation(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toBeCalled();
        expect(mockResponse.json).not.toBeCalled();
    });
});
