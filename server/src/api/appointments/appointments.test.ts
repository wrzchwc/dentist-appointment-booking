import { Appointment, AppointmentQuestion, AppointmentsServices, Service, User } from '../../models';
import { checkConnection, createCookie, createCookieHeader, createSignature, disconnect } from '../../services';
import { Response } from 'superagent';
import { app } from '../../config';
import supertest from 'supertest';

describe('/api/appointments', () => {
    let id: string;
    let cookie: string;
    let signature: string;
    let cookieHeader: [string];
    let response: Response;

    function itShouldReturn500AndErrorMessageInBody() {
        it('should return 500', () => {
            expect(response.status).toBe(500);
        });

        it('should return error message in body', () => {
            expect(response.body).toMatchObject({ error: 'Operation failed' });
        });
    }

    beforeEach(async () => {
        await checkConnection();
        id = (await User.create({ googleId: '381902381093' })).toJSON().id;
        cookie = createCookie(id);
        signature = createSignature(cookie, 'session');
        cookieHeader = createCookieHeader('session', cookie, signature);
    });

    afterEach(async () => {
        await User.destroy({ where: { id } });
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('/services GET', () => {
        it('should return 200', async () => {
            response = await supertest(app).get('/api/appointments/services').set('Cookie', cookieHeader).expect(200);
        });

        it('should return array of objects', () => {
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });

    describe('/questions GET', () => {
        test('Should return 200', async () => {
            response = await supertest(app).get('/api/appointments/questions').set('Cookie', cookieHeader).expect(200);
        });

        test('should return array of objects', () => {
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('should return questions including facts associated with them', () => {
            expect(
                response.body.every(
                    ({ AppointmentFact }: AppointmentQuestion) => AppointmentFact?.id && AppointmentFact.value
                )
            ).toBe(true);
        });
    });

    describe('/ POST', () => {
        beforeEach(async () => {
            response = await supertest(app).post('/api/appointments').set('Cookie', cookieHeader);
        });

        afterEach(async () => {
            await Appointment.destroy({ where: { id: response.body.id } });
        });

        it('should return 201 on successful creation', () => {
            expect(response.status).toBe(201);
        });

        it('should return correct body response', () => {
            const expected: Partial<Appointment> = {
                id: response.body.id,
                confirmed: false,
                estimatedPrice: null,
                startsAt: null,
                services: [],
                factors: [],
            };

            expect(response.body).toMatchObject(expected);
        });
    });

    describe('/:appointmentId/services POST', () => {
        const url = '/api/appointments/40e307b7-b4b0-4d7c-916b-1ab94812bd05/services';

        describe('if there is unexpected error during', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            describe('appointment lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(Appointment, 'findByPk').mockRejectedValue(null);
                    response = await supertest(app).post(url).set('Cookie', cookieHeader);
                });

                itShouldReturn500AndErrorMessageInBody();
            });

            describe('service lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(Service, 'findByPk').mockRejectedValue(null);
                    response = await supertest(app).post(url).set('Cookie', cookieHeader);
                });

                itShouldReturn500AndErrorMessageInBody();

                it('should call Service.findByPk', () => {
                    expect(Service.findByPk).rejects.toBe(null);
                });
            });

            describe('association evaluation', () => {
                beforeEach(async () => {
                    jest.spyOn(Appointment, 'findByPk').mockRejectedValue({});
                    jest.spyOn(Appointment.prototype, 'hasService').mockRejectedValue(null);
                    response = await supertest(app).post(url).set('Cookie', cookieHeader);
                });

                itShouldReturn500AndErrorMessageInBody();

                it('should call Appointment.prototype.hasService', () => {
                    expect(Appointment.prototype.hasService).rejects.toBe(null);
                });
            });

            describe('adding service to appointment', () => {
                beforeEach(async () => {
                    jest.spyOn(Appointment, 'findByPk').mockResolvedValue({ services: [] } as unknown as Appointment);
                    jest.spyOn(Appointment.prototype, 'addService').mockRejectedValue(null);
                    response = await supertest(app).post(url).set('Cookie', cookieHeader);
                });

                itShouldReturn500AndErrorMessageInBody();
            });

            describe('service quantity incrementation', () => {
                beforeEach(async () => {
                    jest.spyOn(Appointment, 'findByPk').mockResolvedValue({
                        services: [{ id: 's', appointment: { increment: jest.fn().mockRejectedValue(null) } }],
                    } as unknown as Appointment);

                    response = await supertest(app).post(url).set('Cookie', cookieHeader).send({ serviceId: 's' });
                });

                itShouldReturn500AndErrorMessageInBody();
            });
        });

        describe('if requested appointment does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(Appointment, 'findByPk').mockResolvedValue(null);
                response = await supertest(app).post(url).set('Cookie', cookieHeader);
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should return 404', () => {
                expect(response.status).toBe(404);
            });

            it('should return appropriate error message', () => {
                expect(response.body).toMatchObject({ error: 'Appointment not found' });
            });
        });

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        describe.skip('if requested service does not exist', () => {});

        describe('if service is not associated with appointment', () => {
            let appointmentId: string;
            let serviceId: string;

            beforeEach(async () => {
                const [appointment, service] = await Promise.all([
                    Appointment.create(),
                    Service.create({ name: '', count: 0 }),
                ]);
                appointmentId = appointment.toJSON().id;
                serviceId = service.toJSON().id;

                jest.spyOn(Appointment.prototype, 'addService');

                response = await supertest(app)
                    .post(`/api/appointments/${appointmentId}/services`)
                    .set('Cookie', cookieHeader)
                    .send({ serviceId });
            });

            afterEach(async () => {
                await Promise.all([
                    Appointment.destroy({ where: { id: appointmentId } }),
                    Service.destroy({ where: { id: serviceId } }),
                ]);
                jest.clearAllMocks();
            });

            it('should return 200', () => {
                expect(response.status).toBe(200);
            });

            it('should call Appointment.prototype.addService with correct service id', () => {
                expect(Appointment.prototype.addService).toHaveBeenCalledWith(serviceId);
            });

            it('should call Appointment.prototype.addService once', () => {
                expect(Appointment.prototype.addService).toBeCalledTimes(1);
            });
        });

        describe('if service is associated with appointment', () => {
            let appointment: Appointment;
            let service: Service;

            beforeEach(async () => {
                [appointment, service] = await Promise.all([
                    Appointment.create(),
                    Service.create({ name: '', count: 0 }),
                ]);
                await appointment.addService(service);

                jest.spyOn(AppointmentsServices, 'increment');

                response = await supertest(app)
                    .post(`/api/appointments/${appointment.toJSON().id}/services`)
                    .set('Cookie', cookieHeader)
                    .send({ serviceId: service.toJSON().id });
            });

            afterEach(async () => {
                await appointment.removeService(service);
                await Promise.all([appointment.destroy(), service.destroy()]);
                jest.clearAllMocks();
            });

            it('should return 200', () => {
                expect(response.status).toBe(200);
            });

            it('should call AppointmentsServices.increment with correct arguments', () => {
                expect(AppointmentsServices.increment).toHaveBeenCalledWith(
                    { quantity: 1 },
                    { where: { appointmentId: appointment.id, serviceId: service.id } }
                );
            });

            it('should call AppointmentsServices.increment once', () => {
                expect(AppointmentsServices.increment).toBeCalledTimes(1);
            });
        });
    });

    describe('/:appointmentId/services/:serviceId DELETE', () => {
        const appointmentId = '40e307b7-b4b0-4d7c-916b-1ab94812bd05';
        const serviceId = 'e4fbd86d-d196-4bc1-8bcc-7a0c24b93d5d';
        const url = `/api/appointments/${appointmentId}/services/${serviceId}`;

        describe('if there is unexpected error during', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            describe('appointment lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(Appointment, 'findByPk').mockRejectedValue(null);
                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturn500AndErrorMessageInBody();
            });

            describe('service removal', () => {
                beforeEach(async () => {
                    jest.spyOn(Appointment, 'findByPk').mockResolvedValue({
                        services: [{ id: serviceId, appointment: { quantity: 1 } }],
                    } as unknown as Appointment);
                    jest.spyOn(Appointment.prototype, 'removeService').mockRejectedValue(null);
                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturn500AndErrorMessageInBody();

                it('should call Appointment.prototype.removeService with correct service id', () => {
                    expect.assertions(1);
                    expect(Appointment.prototype.removeService).rejects.toBe(null);
                });
            });

            describe('service quantity decremental', () => {
                beforeEach(async () => {
                    jest.spyOn(Appointment, 'findByPk').mockResolvedValue({
                        services: [
                            {
                                id: serviceId,
                                appointment: { quantity: 2, decrement: jest.fn().mockRejectedValue(null) },
                            },
                        ],
                    } as unknown as Appointment);
                    jest.spyOn(AppointmentsServices.prototype, 'increment').mockRejectedValue(null);
                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturn500AndErrorMessageInBody();

                it('should call AppointmentsServices.prototype.increment', () => {
                    expect(AppointmentsServices.prototype.increment).rejects.toBe(null);
                });
            });
        });

        describe('if requested appointment does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(Appointment, 'findByPk').mockResolvedValue(null);
                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should return 404', () => {
                expect(response.status).toBe(404);
            });

            it('should return correct error message in body', () => {
                expect(response.body).toMatchObject({ error: 'Appointment not found' });
            });
        });

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        describe.skip('if requested service does not exist', () => {});

        describe('if service is not associated with appointment', () => {
            let appointmentId: string;

            beforeEach(async () => {
                const { id } = await Appointment.create();
                appointmentId = id;

                const url = `/api/appointments/${appointmentId}/services/${serviceId}`;
                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            afterEach(async () => {
                await Appointment.destroy({ where: { id: appointmentId } });
            });

            it('should return 400', () => {
                expect(response.status).toBe(400);
            });

            it('should return error message in body', () => {
                expect(response.body).toMatchObject({ error: 'Service not associated with appointment' });
            });
        });

        describe('if service has been associated with appointment only once', () => {
            let appointment: Appointment;
            let service: Service;

            beforeEach(async () => {
                [appointment, service] = await Promise.all([
                    Appointment.create(),
                    Service.create({ name: '', count: 0 }),
                ]);
                await appointment.addService(service);

                jest.spyOn(Appointment.prototype, 'removeService');

                const url = `/api/appointments/${appointment.toJSON().id}/services/${service.toJSON().id}`;
                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            afterEach(async () => {
                await appointment.removeService(service);
                await Promise.all([appointment.destroy(), service.destroy()]);
                jest.clearAllMocks();
            });

            it('should return 200', () => {
                expect(response.status).toBe(200);
            });

            it('should call Appointment.prototype.removeService correct service id', () => {
                expect(Appointment.prototype.removeService).toHaveBeenCalledWith(service.toJSON().id);
            });

            it('should call Appointment.prototype.removeService once', () => {
                expect(Appointment.prototype.removeService).toBeCalledTimes(1);
            });
        });

        describe('if service has been associated with appointment more than once', () => {
            let appointment: Appointment;
            let service: Service;
            let url: string;

            beforeEach(async () => {
                [appointment, service] = await Promise.all([
                    Appointment.create(),
                    Service.create({ name: '', count: 0 }),
                ]);
                await appointment.addService(service);
                await AppointmentsServices.increment(
                    { quantity: 1 },
                    { where: { appointmentId: appointment.id, serviceId: service.id } }
                );

                jest.spyOn(AppointmentsServices, 'increment');

                url = `/api/appointments/${appointment.id}/services/${service.id}`;
            });

            afterEach(async () => {
                await appointment.removeService(service);
                await Promise.all([appointment.destroy(), service.destroy()]);
                jest.clearAllMocks();
            });

            it('should return 200', async () => {
                const expected = 200;

                const { status } = await supertest(app).delete(url).set('Cookie', cookieHeader);

                expect(status).toBe(expected);
            });

            it('should call AppointmentsServices.increment once', async () => {
                jest.spyOn(AppointmentsServices, 'increment').mockClear();
                const expected = 1;

                await supertest(app).delete(url).set('Cookie', cookieHeader);

                expect(AppointmentsServices.increment).toHaveBeenCalledTimes(expected);
            });

            it('should call AppointmentsServices.increment with correct argument', async () => {
                const expected = [
                    { quantity: -1 },
                    { where: { appointmentId: appointment.id, serviceId: service.id } },
                ];

                await supertest(app).delete(url).set('Cookie', cookieHeader);

                expect(AppointmentsServices.increment).toHaveBeenCalledWith(...expected);
            });
        });
    });
});
