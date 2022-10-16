import { NextFunction, Request, Response } from 'express';
import { authentication } from './authentication';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
const mockNext: NextFunction = jest.fn();

describe('authentication middleware', () => {
    beforeAll(() => {
        mockRequest = {
            isAuthenticated: jest.fn().mockReturnValue(true),
        };
    });

    beforeEach(() => {
        mockResponse = { json: jest.fn() };
    });

    test('Should return 401 if user not authenticated', () => {
        authentication(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.statusCode).toBe(401);
        expect(mockResponse.json).toBeCalledWith({ error: 'User not authenticated!' });
        expect(mockNext).not.toBeCalled();
    });

    test('Should forward request if user authenticated', () => {
        mockRequest = { ...mockRequest, user: { googleId: '213123123123', isAdmin: false } };

        authentication(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toBeCalled();
        expect(mockResponse.json).not.toBeCalled();
    });
});
