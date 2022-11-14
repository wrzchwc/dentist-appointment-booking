import { NextFunction, Request, Response } from 'express';
import { User } from '../../models';
import { findUser } from './find-user';

describe('findUser middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = { user: { id: '' } };
        mockResponse = { json: jest.fn() };
        mockNext = jest.fn();
    });

    function itShouldNotForwardTheRequest() {
        it('should not forward the request', async () => {
            await findUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).not.toBeCalled();
        });
    }

    describe('if user does not exist in database', () => {
        beforeEach(() => {
            User.findByPk = jest.fn().mockReturnValue(Promise.resolve(null));
        });

        it('should return 404', async () => {
            const expected = 404;

            await findUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.statusCode).toBe(expected);
        });

        it('should return body containing error message', async () => {
            const expected = { error: 'User not found' };

            await findUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.json).toBeCalledWith(expected);
            expect(mockResponse.json).toBeCalledTimes(1);
        });

        itShouldNotForwardTheRequest();
    });

    describe('if there is some unidentified error during user lookup', () => {
        beforeEach(() => {
            User.findByPk = jest.fn().mockReturnValue(Promise.reject());
        });
        it('should return 500', async () => {
            const expected = 500;

            await findUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.statusCode).toBe(expected);
        });

        it('should return body containing error message', async () => {
            const expected = { error: 'Operation failed' };

            await findUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.json).toBeCalledWith(expected);
            expect(mockResponse.json).toBeCalledTimes(1);
        });

        itShouldNotForwardTheRequest();
    });

    describe('if user exists in database', () => {
        beforeEach(() => {
            User.findByPk = jest.fn().mockReturnValue(Promise.resolve({}));
        });

        it('should not send any response', async () => {
            await findUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockResponse.json).not.toBeCalled();
        });

        it('should forward the request', async () => {
            await findUser(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
        });
    });
});
