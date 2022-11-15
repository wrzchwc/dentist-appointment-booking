import * as m from '../../models';
import { checkConnection, createCookie, createCookieHeader, createSignature, disconnect } from '../../services';
import { Op } from 'sequelize';
import { Response } from 'superagent';
import { app } from '../../config';
import supertest from 'supertest';

describe('/api/appointments', () => {
    let id: string;
    let cookie: string;
    let signature: string;
    let cookieHeader: [string];
    let response: Response;

    function itShouldReturnErrorCodeAndErrorMessageInBody(code: number, message: string) {
        it(`should return ${code}`, () => {
            expect(response.status).toBe(code);
        });

        it(`should return ${message} in body`, () => {
            expect(response.body).toMatchObject({ error: message });
        });
    }

    function itShouldReturn(code: number) {
        it(`should return ${code}`, () => {
            expect(response.status).toBe(code);
        });
    }

    function itShouldReturnArrayOfObjects() {
        it('should return array of objects', () => {
            expect(Array.isArray(response.body)).toBe(true);
        });
    }

    beforeEach(async () => {
        await checkConnection();
        id = (await m.User.create({ googleId: '381902381093' })).toJSON().id;
        cookie = createCookie(id);
        signature = createSignature(cookie, 'session');
        cookieHeader = createCookieHeader('session', cookie, signature);
    });

    afterEach(async () => {
        await m.User.destroy({ where: { id } });
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('/questions GET', () => {
        beforeEach(async () => {
            response = await supertest(app).get('/api/appointments/questions').set('Cookie', cookieHeader);
        });

        test('Should return 200', async () => {
            expect(response.status).toBe(200);
        });

        test('should return array of objects', () => {
            expect(Array.isArray(response.body)).toBe(true);
        });

        test('should return questions including facts associated with them', () => {
            expect(response.body.every(({ fact }: m.AppointmentQuestion) => fact?.id && fact.value)).toBe(true);
        });
    });

    describe('/ POST', () => {
        beforeEach(async () => {
            response = await supertest(app).post('/api/appointments').set('Cookie', cookieHeader);
        });

        afterEach(async () => {
            await m.Appointment.destroy({ where: { id: response.body.id } });
        });

        it('should return 201 on successful creation', () => {
            expect(response.status).toBe(201);
        });

        it('should return correct body response', () => {
            const { id } = response.body;
            const expected: Partial<m.Appointment> = { id, confirmed: false, startsAt: null, services: [], facts: [] };

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
                    jest.spyOn(m.Appointment, 'find').mockRejectedValue(null);
                    jest.spyOn(m.Service, 'find').mockResolvedValue({} as m.Service);
                    response = await supertest(app).post(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');
            });

            describe('service lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Service, 'findByPk').mockRejectedValue(null);
                    response = await supertest(app).post(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call Service.findByPk', () => {
                    expect(m.Service.findByPk).rejects.toBe(null);
                });
            });

            describe('association evaluation', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'find').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.Service, 'find').mockResolvedValue({} as m.Service);
                    jest.spyOn(m.AppointmentsServices, 'findOne').mockRejectedValue(null);
                    response = await supertest(app).post(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call AppointmentsServices.findOne', () => {
                    expect(m.AppointmentsServices.findOne).rejects.toBe(null);
                });
            });

            describe('adding service to appointment', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.Service, 'findByPk').mockResolvedValue({} as m.Service);
                    jest.spyOn(m.Appointment.prototype, 'hasService').mockResolvedValue(false);
                    jest.spyOn(m.Appointment.prototype, 'addService').mockRejectedValue(null);
                    response = await supertest(app).post(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');
            });

            describe('service quantity incrementation', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({
                        services: [{ id: 's', appointment: { increment: jest.fn().mockRejectedValue(null) } }],
                    } as unknown as m.Appointment);

                    response = await supertest(app).post(url).set('Cookie', cookieHeader).send({ serviceId: 's' });
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');
            });
        });

        describe('if requested appointment does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue(null);
                jest.spyOn(m.Service, 'findByPk').mockResolvedValue({} as m.Service);
                jest.spyOn(m.AppointmentsServices, 'findOne').mockResolvedValue({} as m.AppointmentsServices);
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

        describe('if requested service does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                jest.spyOn(m.Service, 'findByPk').mockResolvedValue(null);
                response = await supertest(app).post(url).set('Cookie', cookieHeader);
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should return 404', () => {
                expect(response.status).toBe(404);
            });

            it('should return appropriate error message', () => {
                expect(response.body).toMatchObject({ error: 'Service not found' });
            });
        });

        describe('if service is not associated with appointment', () => {
            let appointmentId: string;
            let serviceId: string;

            beforeEach(async () => {
                const [appointment, service] = await Promise.all([
                    m.Appointment.create(),
                    m.Service.create({ name: '', count: 0 }),
                ]);
                appointmentId = appointment.toJSON().id;
                serviceId = service.toJSON().id;

                jest.spyOn(m.Appointment.prototype, 'addService');

                response = await supertest(app)
                    .post(`/api/appointments/${appointmentId}/services`)
                    .set('Cookie', cookieHeader)
                    .send({ serviceId });
            });

            afterEach(async () => {
                await Promise.all([
                    m.Appointment.destroy({ where: { id: appointmentId } }),
                    m.Service.destroy({ where: { id: serviceId } }),
                ]);
                jest.clearAllMocks();
            });

            it('should return 200', () => {
                expect(response.status).toBe(200);
            });

            it('should call Appointment.prototype.addService with correct service id', () => {
                expect(m.Appointment.prototype.addService).toHaveBeenCalledWith(serviceId);
            });

            it('should call Appointment.prototype.addService once', () => {
                expect(m.Appointment.prototype.addService).toBeCalledTimes(1);
            });
        });

        describe('if service is associated with appointment', () => {
            let appointment: m.Appointment;
            let service: m.Service;

            beforeEach(async () => {
                [appointment, service] = await Promise.all([
                    m.Appointment.create(),
                    m.Service.create({ name: '', count: 0 }),
                ]);
                await appointment.addService(service);

                jest.spyOn(m.AppointmentsServices, 'increment');

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
                expect(m.AppointmentsServices.increment).toHaveBeenCalledWith(
                    { quantity: 1 },
                    { where: { appointmentId: appointment.id, serviceId: service.id } }
                );
            });

            it('should call AppointmentsServices.increment once', () => {
                expect(m.AppointmentsServices.increment).toBeCalledTimes(1);
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
                    jest.spyOn(m.Appointment, 'findByPk').mockRejectedValue(null);
                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call Appointment.findByPk', () => {
                    expect(m.Appointment.findByPk).rejects.toBe(null);
                });
            });

            describe('service lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.Service, 'findByPk').mockRejectedValue(null);

                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call Service.findByPk', () => {
                    expect(m.Service.findByPk).rejects.toBe(null);
                });
            });

            describe('association evaluation', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.Service, 'findByPk').mockRejectedValue({} as m.Service);
                    jest.spyOn(m.Appointment.prototype, 'hasService').mockRejectedValue(null);

                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call Appointment.prototype.hasService', () => {
                    expect(m.Appointment.prototype.hasService).rejects.toBe(null);
                });
            });

            describe('service removal', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.Service, 'findByPk').mockResolvedValue({} as m.Service);
                    jest.spyOn(m.AppointmentsServices, 'findOne').mockResolvedValue({
                        quantity: 1,
                    } as m.AppointmentsServices);
                    jest.spyOn(m.Appointment.prototype, 'removeService').mockRejectedValue(null);

                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call Appointment.prototype.removeService', () => {
                    expect(m.Appointment.prototype.removeService).rejects.toBe(null);
                });
            });

            describe('service quantity decremental', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.Service, 'findByPk').mockResolvedValue({} as m.Service);
                    jest.spyOn(m.AppointmentsServices, 'findOne').mockResolvedValue({
                        quantity: 2,
                    } as m.AppointmentsServices);
                    jest.spyOn(m.AppointmentsServices.prototype, 'increment').mockRejectedValue(null);

                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call AppointmentsServices.prototype.increment', () => {
                    expect(m.AppointmentsServices.prototype.increment).rejects.toBe(null);
                });
            });
        });

        describe('if requested appointment does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue(null);
                jest.spyOn(m.Service, 'findByPk').mockResolvedValue({} as m.Service);
                jest.spyOn(m.AppointmentsServices, 'findOne').mockResolvedValue({} as m.AppointmentsServices);
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

        describe('if requested service does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                jest.spyOn(m.Service, 'findByPk').mockResolvedValue(null);
                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should return 404', () => {
                expect(response.status).toBe(404);
            });

            it('should return appropriate error message', () => {
                expect(response.body).toMatchObject({ error: 'Service not found' });
            });
        });

        describe('if service is not associated with appointment', () => {
            let appointment: m.Appointment;
            let service: m.Service;

            beforeEach(async () => {
                [appointment, service] = await Promise.all([
                    await m.Appointment.create(),
                    m.Service.create({ name: '', count: 0 }),
                ]);

                const url = `/api/appointments/${appointment.id}/services/${service.id}`;
                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            afterEach(async () => {
                await Promise.all([appointment.destroy(), service.destroy()]);
            });

            it('should return 400', () => {
                expect(response.status).toBe(400);
            });

            it('should return error message in body', () => {
                expect(response.body).toMatchObject({ error: 'Appointment and service not associated' });
            });
        });

        describe('if service has been associated with appointment only once', () => {
            let appointment: m.Appointment;
            let service: m.Service;

            beforeEach(async () => {
                [appointment, service] = await Promise.all([
                    m.Appointment.create(),
                    m.Service.create({ name: '', count: 0 }),
                ]);
                await appointment.addService(service);

                jest.spyOn(m.Appointment.prototype, 'removeService');

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
                expect(m.Appointment.prototype.removeService).toHaveBeenCalledWith(service.toJSON().id);
            });

            it('should call Appointment.prototype.removeService once', () => {
                expect(m.Appointment.prototype.removeService).toBeCalledTimes(1);
            });
        });

        describe('if service has been associated with appointment more than once', () => {
            let appointment: m.Appointment;
            let service: m.Service;
            let url: string;

            beforeEach(async () => {
                [appointment, service] = await Promise.all([
                    m.Appointment.create(),
                    m.Service.create({ name: '', count: 0 }),
                ]);
                await appointment.addService(service);
                await m.AppointmentsServices.increment(
                    { quantity: 1 },
                    { where: { appointmentId: appointment.id, serviceId: service.id } }
                );

                jest.spyOn(m.AppointmentsServices, 'increment');

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
                jest.spyOn(m.AppointmentsServices, 'increment').mockClear();
                const expected = 1;

                await supertest(app).delete(url).set('Cookie', cookieHeader);

                expect(m.AppointmentsServices.increment).toHaveBeenCalledTimes(expected);
            });

            it('should call AppointmentsServices.increment with correct argument', async () => {
                const expected = [
                    { quantity: -1 },
                    { where: { appointmentId: appointment.id, serviceId: service.id } },
                ];

                await supertest(app).delete(url).set('Cookie', cookieHeader);

                expect(m.AppointmentsServices.increment).toHaveBeenCalledWith(...expected);
            });
        });
    });

    describe('/:appointmentId/facts POST', () => {
        const appointmentId = '9a3726b3-23cd-4db0-b6ae-bbebdcade682';
        const factId = 'a76ea8e7-e534-4452-9664-68d9d9f75386';
        const url = `/api/appointments/${appointmentId}/facts`;
        const additionalInfo = '';

        describe('if there is unexpected during', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            describe('appointment lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockRejectedValue(null);
                    jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue({} as m.AppointmentFact);

                    response = await supertest(app)
                        .post(url)
                        .set('Cookie', cookieHeader)
                        .send({ factId, additionalInfo });
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call Appointment.findByPk once', () => {
                    expect(m.Appointment.findByPk).toHaveBeenCalledTimes(1);
                });

                it(`should call Appointment.findByPk with ${appointmentId}`, () => {
                    expect(m.Appointment.findByPk).toHaveBeenCalledWith(appointmentId);
                });
            });

            describe('fact lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.AppointmentFact, 'findByPk').mockRejectedValue(null);

                    response = await supertest(app)
                        .post(url)
                        .set('Cookie', cookieHeader)
                        .send({ factId, additionalInfo });
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it(`should call AppointmentFact.findByPk with ${factId}`, () => {
                    expect(m.AppointmentFact.findByPk).toHaveBeenCalledWith(factId);
                });

                it('should call AppointmentFact.findByPk once', () => {
                    expect(m.AppointmentFact.findByPk).toHaveBeenCalledTimes(1);
                });
            });

            describe('adding fact to appointment', () => {
                const addFact = jest.fn(() => Promise.reject());

                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({
                        addFact,
                    } as unknown as m.Appointment);
                    jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue({ id: factId } as m.AppointmentFact);

                    response = await supertest(app)
                        .post(url)
                        .set('Cookie', cookieHeader)
                        .send({ factId, additionalInfo });
                });

                afterEach(() => {
                    addFact.mockClear();
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call Appointment.prototype.addFact once', () => {
                    expect(addFact).toHaveBeenCalledTimes(1);
                });

                it(`should call Appointment.prototype.addFact with ${factId}`, () => {
                    expect(addFact).toHaveBeenCalledWith(factId, { through: { additionalInfo } });
                });
            });
        });

        describe('if requested appointment does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue(null);
                jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue({} as m.AppointmentFact);

                response = await supertest(app).post(url).set('Cookie', cookieHeader).send({ factId, additionalInfo });
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should call Appointment.findByPk once', () => {
                expect(m.Appointment.findByPk).toHaveBeenCalledTimes(1);
            });

            it(`should call Appointment.findByPk with ${appointmentId}`, () => {
                expect(m.Appointment.findByPk).toHaveBeenCalledWith(appointmentId);
            });

            it('should return 404', function () {
                expect(response.status).toBe(404);
            });

            it('should return appropriate error message in body', () => {
                expect(response.body).toMatchObject({ error: 'Appointment not found' });
            });
        });

        describe('if requested fact does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue(null);

                response = await supertest(app).post(url).set('Cookie', cookieHeader).send({ factId, additionalInfo });
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            it('should call AppointmentFact.findByPk once', () => {
                expect(m.AppointmentFact.findByPk).toHaveBeenCalledTimes(1);
            });

            it(`should call AppointmentFact.findByPk with ${factId}`, () => {
                expect(m.AppointmentFact.findByPk).toHaveBeenCalledWith(factId);
            });

            it('should return 404', function () {
                expect(response.status).toBe(404);
            });

            it('should return appropriate error message in body', () => {
                expect(response.body).toMatchObject({ error: 'Fact not found' });
            });
        });

        describe('if fact can be added to appointment', () => {
            let appointment: m.Appointment;
            let fact: m.AppointmentFact;

            beforeEach(async () => {
                [appointment, fact] = await Promise.all([
                    m.Appointment.create(),
                    m.AppointmentFact.create({ value: '' }),
                ]);

                jest.spyOn(m.Appointment.prototype, 'addFact');

                response = await supertest(app)
                    .post(`/api/appointments/${appointment.id}/facts`)
                    .set('Cookie', cookieHeader)
                    .send({ additionalInfo, factId: fact.id });
            });

            afterEach(async () => {
                await appointment.removeFact(fact);
                await Promise.all([appointment.destroy(), fact.destroy()]);
                jest.clearAllMocks();
            });

            it('should return 200', function () {
                expect(response.status).toBe(200);
            });

            it('should call Appointment.prototype.addFact once', () => {
                expect(m.Appointment.prototype.addFact).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.prototype.addFact with correct arguments', () => {
                expect(m.Appointment.prototype.addFact).toHaveBeenCalledWith(fact.id, { through: { additionalInfo } });
            });
        });
    });

    describe('/:appointmentId/facts/:factId DELETE', () => {
        const appointmentId = '9a3726b3-23cd-4db0-b6ae-bbebdcade682';
        const factId = 'a76ea8e7-e534-4452-9664-68d9d9f75386';
        const url = `/api/appointments/${appointmentId}/facts/${factId}`;

        function itShouldCallAppointmentFindByPkOnceWith(appointmentId: string) {
            afterEach(() => {
                jest.clearAllMocks();
            });

            it('should call Appointment.findByPk once', () => {
                expect(m.Appointment.findByPk).toHaveBeenCalledTimes(1);
            });

            it(`should call Appointment.findByPk with ${appointmentId}`, () => {
                expect(m.Appointment.findByPk).toHaveBeenCalledWith(appointmentId);
            });
        }

        function itShouldCallAppointmentFactFindByPkOnceWith(factId: string) {
            afterEach(() => {
                jest.clearAllMocks();
            });

            it('should call AppointmentFact.findByPk once', () => {
                expect(m.AppointmentFact.findByPk).toHaveBeenCalledTimes(1);
            });

            it(`should call AppointmentFact.findByPk with ${factId}`, () => {
                expect(m.AppointmentFact.findByPk).toHaveBeenCalledWith(factId);
            });
        }

        describe('if there is unexpected error during', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            describe('appointment lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockImplementation(() => Promise.reject());
                    jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue({} as m.AppointmentFact);
                    jest.spyOn(m.HealthSurvey, 'findOne').mockResolvedValue({} as m.HealthSurvey);

                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                itShouldCallAppointmentFindByPkOnceWith(appointmentId);
            });

            describe('fact lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.AppointmentFact, 'findByPk').mockImplementation(() => Promise.reject());
                    jest.spyOn(m.HealthSurvey, 'findOne').mockResolvedValue({} as m.HealthSurvey);

                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                itShouldCallAppointmentFactFindByPkOnceWith(factId);
            });

            describe('association evaluation', () => {
                beforeEach(async () => {
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                    jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue({} as m.AppointmentFact);
                    jest.spyOn(m.HealthSurvey, 'findOne').mockImplementation(() => Promise.reject());

                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call HealthSurvey.findOne once', () => {
                    expect(m.HealthSurvey.findOne).toHaveBeenCalledTimes(1);
                });

                it(`should call HealthSurvey.findOne with ${appointmentId} and ${factId}`, () => {
                    expect(m.HealthSurvey.findOne).toHaveBeenCalledWith({ where: { appointmentId, factId } });
                });
            });

            describe('fact removal', () => {
                const removeFact = jest.fn();

                beforeEach(async () => {
                    removeFact.mockImplementation(() => Promise.reject());
                    jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({ removeFact } as unknown as m.Appointment);
                    jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue({ id: factId } as m.AppointmentFact);
                    jest.spyOn(m.HealthSurvey, 'findOne').mockResolvedValue({} as m.HealthSurvey);

                    response = await supertest(app).delete(url).set('Cookie', cookieHeader);
                });

                afterEach(() => {
                    removeFact.mockClear();
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

                it('should call Appointment.prototype.removeFact once', () => {
                    expect(removeFact).toHaveBeenCalledTimes(1);
                });

                it(`should call Appointment.prototype.removeFact with ${factId}`, () => {
                    expect(removeFact).toHaveBeenCalledWith(factId);
                });
            });
        });

        describe('if requested appointment does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue(null);
                jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue({} as m.AppointmentFact);
                jest.spyOn(m.HealthSurvey, 'findOne').mockResolvedValue({} as m.HealthSurvey);

                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            itShouldReturnErrorCodeAndErrorMessageInBody(404, 'Appointment not found');

            itShouldCallAppointmentFindByPkOnceWith(appointmentId);
        });

        describe('if requested fact does not exist', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue(null);
                jest.spyOn(m.HealthSurvey, 'findOne').mockResolvedValue({} as m.HealthSurvey);

                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            itShouldReturnErrorCodeAndErrorMessageInBody(404, 'Fact not found');

            itShouldCallAppointmentFactFindByPkOnceWith(factId);
        });

        describe('if appointment and fact are not associated', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findByPk').mockResolvedValue({} as m.Appointment);
                jest.spyOn(m.AppointmentFact, 'findByPk').mockResolvedValue({} as m.AppointmentFact);
                jest.spyOn(m.HealthSurvey, 'findOne').mockResolvedValue(null);

                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            afterEach(() => {
                jest.restoreAllMocks();
                jest.clearAllMocks();
            });

            itShouldReturnErrorCodeAndErrorMessageInBody(400, 'Appointment and fact not associated');

            it('should call HealthSurvey.findOne once', () => {
                expect(m.HealthSurvey.findOne).toHaveBeenCalledTimes(1);
            });

            it('should call HealthSurvey.findOne with correct argument', () => {
                expect(m.HealthSurvey.findOne).toHaveBeenCalledWith({ where: { appointmentId, factId } });
            });
        });

        describe('if fact can be removed from appointment', () => {
            let appointment: m.Appointment;
            let fact: m.AppointmentFact;

            beforeEach(async () => {
                [appointment, fact] = await Promise.all([
                    m.Appointment.create(),
                    m.AppointmentFact.create({ value: '' }),
                ]);
                await appointment.addFact(fact);

                jest.spyOn(m.Appointment.prototype, 'removeFact');

                const url = `/api/appointments/${appointment.id}/facts/${fact.id}`;
                response = await supertest(app).delete(url).set('Cookie', cookieHeader);
            });

            afterEach(async () => {
                await Promise.all([appointment.destroy(), fact.destroy()]);
                jest.clearAllMocks();
            });

            it('should return 200', () => {
                expect(response.status).toBe(200);
            });

            it('should call Appointment.prototype.removeFact once', () => {
                expect(m.Appointment.prototype.removeFact).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.prototype.removeFact with correct fact id', () => {
                expect(m.Appointment.prototype.removeFact).toHaveBeenCalledWith(fact.id);
            });
        });
    });

    describe('/:appointmentId/starts-at PATCH', () => {
        const appointmentId = 'be62cd19-0962-43ee-9a43-64d560b3d123';
        const url = `/api/appointments/${appointmentId}/starts-at`;
        const startsAt = '2022-11-13T17:30:37.828Z';

        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('if there is unexpected error during updating', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'update').mockImplementation(() => Promise.reject());

                response = await supertest(app).patch(url).set('Cookie', cookieHeader).send({ startsAt });
            });
            itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

            it('should call Appointment.update once', () => {
                expect(m.Appointment.update).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.update with correct arguments', () => {
                expect(m.Appointment.update).toHaveBeenCalledWith(
                    { startsAt },
                    { where: { id: appointmentId }, returning: true }
                );
            });
        });

        describe('if requested appointment has not been found', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'update');
                response = await supertest(app).patch(url).set('Cookie', cookieHeader).send({ startsAt });
            });

            itShouldReturnErrorCodeAndErrorMessageInBody(404, 'Appointment not found');

            it('should call Appointment.update once', () => {
                expect(m.Appointment.update).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.update with correct arguments', () => {
                expect(m.Appointment.update).toHaveBeenCalledWith(
                    { startsAt },
                    { where: { id: appointmentId }, returning: true }
                );
            });
        });

        describe('if requested appointment exists', () => {
            let appointment: m.Appointment;

            beforeEach(async () => {
                const user = await m.User.findOne({ where: { googleId: '381902381093' } });
                appointment = await user!.createAppointment();
                jest.spyOn(m.Appointment, 'update');

                response = await supertest(app)
                    .patch(`/api/appointments/${appointment.id}/starts-at`)
                    .set('Cookie', cookieHeader)
                    .send({ startsAt });
            });

            afterEach(async () => {
                await appointment.destroy();
            });

            it('should call Appointment.update once', () => {
                expect(m.Appointment.update).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.update with correct arguments', () => {
                expect(m.Appointment.update).toHaveBeenCalledWith(
                    { startsAt },
                    { where: { id: appointment.id }, returning: true }
                );
            });

            it('should return 200', () => {
                expect(response.status).toBe(200);
            });

            it('should return updated appointment in body', () => {
                expect(response.body).toMatchObject({ ...appointment.toJSON(), startsAt });
            });
        });
    });

    describe('/:appointmentId/confirmed', () => {
        const appointmentId = 'b143dc13-1f50-4d56-93aa-18f9d8833b77';
        const confirmed = true;

        async function makeRequest(appointmentId: string) {
            const url = `/api/appointments/${appointmentId}/confirm`;
            return supertest(app).patch(url).set('Cookie', cookieHeader).send({ confirmed });
        }

        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('if there is unexpected error during update', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'update').mockImplementation(() => Promise.reject());
                response = await makeRequest(appointmentId);
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

            it('should call Appointment.update once', () => {
                expect(m.Appointment.update).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.update with correct arguments', () => {
                expect(m.Appointment.update).toHaveBeenCalledWith(
                    { confirmed },
                    { where: { id: appointmentId }, returning: true }
                );
            });
        });

        describe('if requested appointment has not been found', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'update');
                response = await makeRequest(appointmentId);
            });

            afterEach(() => {
                jest.clearAllMocks();
            });

            itShouldReturnErrorCodeAndErrorMessageInBody(404, 'Appointment not found');

            it('should call Appointment.update once', () => {
                expect(m.Appointment.update).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.update with correct arguments', () => {
                expect(m.Appointment.update).toHaveBeenCalledWith(
                    { confirmed },
                    { where: { id: appointmentId }, returning: true }
                );
            });
        });

        describe('if requested appointment exists', () => {
            let appointment: m.Appointment;

            beforeEach(async () => {
                appointment = await (await m.User.findOne({
                    where: { googleId: '381902381093' },
                }))!.createAppointment();
                jest.spyOn(m.Appointment, 'update');
                response = await makeRequest(appointment.id);
            });

            afterEach(async () => {
                await appointment.destroy();
                jest.clearAllMocks();
            });

            it('should return 200', () => {
                expect(response.status).toBe(200);
            });

            it('should return updated appointment', () => {
                expect(response.body).toMatchObject({ ...appointment.toJSON(), confirmed });
            });

            it('should call Appointment.update once', () => {
                expect(m.Appointment.update).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.update with correct arguments', () => {
                expect(m.Appointment.update).toHaveBeenCalledWith(
                    { confirmed },
                    { where: { id: appointment.id }, returning: true }
                );
            });
        });
    });

    describe('/ GET', () => {
        let appointments: m.Appointment[];

        const records: Partial<m.Appointment>[] = [
            { startsAt: new Date('2022-11-12'), confirmed: true },
            { startsAt: null, confirmed: false },
            { startsAt: new Date('2022-11-14'), confirmed: true },
            { startsAt: new Date('2022-11-15'), confirmed: false },
        ];

        const expectedArgument = {
            include: [{ model: m.Service, through: { attributes: ['quantity'] } }],
            order: [['startsAt', 'ASC']],
            attributes: ['id', 'startsAt'],
        };

        // eslint-disable-next-line no-unused-vars
        function itShouldReturnAllMatchingTestAppointments(filterFn: (appointment: m.Appointment) => boolean) {
            it('should return matching all test appointments', () => {
                const expectedIds = appointments.filter(filterFn).map(mapAppointmentToId);

                const actualIds = (response.body as m.Appointment[]).map(mapAppointmentToId);

                expect(expectedIds.every((id) => actualIds.includes(id))).toBe(true);
            });
        }

        function mapAppointmentToId(appointment: m.Appointment): string {
            return appointment.id;
        }

        function itShouldReturnObjectsWithNonNullishStartsAt() {
            it('should return objects with non-nullish `startsAt`', () => {
                expect((response.body as m.Appointment[]).every(({ startsAt }) => startsAt)).toBe(true);
            });
        }

        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('if there is unexpected error during appointments querying', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findAll').mockImplementation(() => Promise.reject());

                response = await supertest(app).get('/api/appointments').set('Cookie', cookieHeader);
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { confirmed: true, startsAt: { [Op.ne]: null } },
                });
            });
        });

        describe('if there are no query parameters', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findAll');
                appointments = await m.Appointment.bulkCreate(records);
                response = await supertest(app).get('/api/appointments').set('Cookie', cookieHeader);
            });

            afterEach(async () => {
                for (const a of appointments) {
                    await a.destroy();
                }
            });

            itShouldReturn(200);

            itShouldReturnArrayOfObjects();

            itShouldReturnAllMatchingTestAppointments(({ startsAt, confirmed }) => startsAt !== null && confirmed);

            itShouldReturnObjectsWithNonNullishStartsAt();

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { confirmed: true, startsAt: { [Op.ne]: null } },
                });
            });
        });

        describe('if only `before` query parameter is present', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findAll');
                appointments = await m.Appointment.bulkCreate(records);
                response = await supertest(app).get('/api/appointments?before=2022-11-13').set('Cookie', cookieHeader);
            });

            afterEach(async () => {
                for (const a of appointments) {
                    await a.destroy();
                }
            });

            itShouldReturn(200);

            itShouldReturnArrayOfObjects();

            itShouldReturnAllMatchingTestAppointments(
                ({ startsAt, confirmed }) => confirmed && startsAt !== null && startsAt < new Date('2022-11-13')
            );

            itShouldReturnObjectsWithNonNullishStartsAt();

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { confirmed: true, startsAt: { [Op.lt]: '2022-11-13' } },
                });
            });

            it('should return objects with `startsAt` set to value earlier than given query parameter', () => {
                expect((response.body as m.Appointment[]).every(({ startsAt }) => startsAt! < new Date('2022-11-13')));
            });
        });

        describe('if only `after` query parameter is present', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findAll');
                appointments = await m.Appointment.bulkCreate(records);
                response = await supertest(app).get('/api/appointments?after=2022-11-12').set('Cookie', cookieHeader);
            });

            afterEach(async () => {
                for (const a of appointments) {
                    await a.destroy();
                }
            });

            itShouldReturn(200);

            itShouldReturnArrayOfObjects();

            itShouldReturnObjectsWithNonNullishStartsAt();

            itShouldReturnAllMatchingTestAppointments(
                ({ startsAt, confirmed }) => confirmed && startsAt !== null && startsAt > new Date('2022-11-12')
            );

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { confirmed: true, startsAt: { [Op.gt]: '2022-11-12' } },
                });
            });
        });

        describe('if `after` and `before` query parameter are present', () => {
            beforeEach(async () => {
                jest.spyOn(m.Appointment, 'findAll');
                appointments = await m.Appointment.bulkCreate(records);
                response = await supertest(app)
                    .get('/api/appointments?after=2022-11-12&before=2022-11-13')
                    .set('Cookie', cookieHeader);
            });

            afterEach(async () => {
                for (const a of appointments) {
                    await a.destroy();
                }
            });

            itShouldReturn(200);

            itShouldReturnArrayOfObjects();

            itShouldReturnObjectsWithNonNullishStartsAt();

            itShouldReturnAllMatchingTestAppointments(
                ({ confirmed, startsAt }) =>
                    confirmed &&
                    startsAt !== null &&
                    startsAt > new Date('2022-11-12') &&
                    startsAt < new Date('2022-11-13')
            );

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { confirmed: true, startsAt: { [Op.between]: ['2022-11-12', '2022-11-13'] } },
                });
            });
        });
    });
});
