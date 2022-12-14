import * as m from '../../models';
import { CreateAppointmentBody, ServiceAssociationCreationAttribute } from './appointments.requests';
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

    function itShouldReturnErrorCodeAndErrorMessageInBody(code = 500, message = 'Operation failed') {
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
            expect(response.body.every(({ fact }: m.AppointmentQuestion) => fact?.value)).toBe(true);
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

    describe('/ GET', () => {
        let appointments: m.Appointment[];

        const records = [
            { startsAt: new Date('2022-11-12') },
            { startsAt: new Date('2022-11-12') },
            { startsAt: new Date('2022-11-14') },
            { startsAt: new Date('2022-11-15') },
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
                    where: { startsAt: { [Op.ne]: null } },
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

            itShouldReturnAllMatchingTestAppointments(({ startsAt }) => startsAt !== null);

            itShouldReturnObjectsWithNonNullishStartsAt();

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { startsAt: { [Op.ne]: null } },
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

            itShouldReturnAllMatchingTestAppointments(({ startsAt }) => startsAt < new Date('2022-11-13'));

            itShouldReturnObjectsWithNonNullishStartsAt();

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { startsAt: { [Op.lt]: '2022-11-13' } },
                });
            });

            it('should return objects with `startsAt` set to value earlier than given query parameter', () => {
                expect((response.body as m.Appointment[]).every(({ startsAt }) => startsAt < new Date('2022-11-13')));
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

            itShouldReturnAllMatchingTestAppointments(({ startsAt }) => startsAt > new Date('2022-11-12'));

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { startsAt: { [Op.gt]: '2022-11-12' } },
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
                ({ startsAt }) => startsAt > new Date('2022-11-12') && startsAt < new Date('2022-11-13')
            );

            it('should call Appointment.findAll once', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledTimes(1);
            });

            it('should call Appointment.findAll with correct argument', () => {
                expect(m.Appointment.findAll).toHaveBeenCalledWith({
                    ...expectedArgument,
                    where: { startsAt: { [Op.between]: ['2022-11-12', '2022-11-13'] } },
                });
            });
        });
    });

    describe('/ POST', () => {
        const startsAt = new Date();
        const serviceRecords = [
            { name: 'a', count: 1 },
            { name: 'b', count: 2 },
        ];

        async function makeRequest(body?: CreateAppointmentBody) {
            return supertest(app).post('/api/appointments').set('Cookie', cookieHeader).send(body);
        }

        describe('if there is error during', () => {
            afterEach(() => {
                jest.restoreAllMocks();
            });

            describe('user lookup', () => {
                beforeEach(async () => {
                    jest.spyOn(m.User, 'findByPk').mockImplementation(() => Promise.reject());
                    response = await makeRequest();
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');
            });

            describe('appointment creation', () => {
                beforeEach(async () => {
                    const createAppointments = jest.fn(() => Promise.reject());
                    jest.spyOn(m.User, 'findByPk').mockResolvedValue({ createAppointments } as unknown as m.User);
                    jest.spyOn(m.User.prototype, 'createAppointment').mockImplementation(() => Promise.reject());
                    response = await makeRequest();
                });

                itShouldReturnErrorCodeAndErrorMessageInBody(500, 'Operation failed');
            });

            describe('adding', () => {
                beforeEach(() => {
                    const createAppointment = { addService: jest.fn(), addFact: jest.fn() };
                    jest.spyOn(m.User, 'findByPk').mockResolvedValue({ createAppointment } as unknown as m.User);
                });

                describe('services to appointment', () => {
                    beforeEach(async () => {
                        jest.spyOn(m.Appointment.prototype, 'addFact').mockReturnValue(Promise.resolve());
                        jest.spyOn(m.Appointment.prototype, 'addService').mockImplementation(() => Promise.reject());
                        response = await makeRequest({ startsAt: new Date(), services: [{ id: '', quantity: 0 }] });
                    });

                    itShouldReturnErrorCodeAndErrorMessageInBody();
                });

                describe('facts to appointment', () => {
                    beforeEach(async () => {
                        jest.spyOn(m.Appointment.prototype, 'addFact').mockImplementation(() => Promise.reject());
                        jest.spyOn(m.Appointment.prototype, 'addService').mockReturnValue(Promise.resolve());
                        const body = { startsAt: new Date(), services: [{ id: '', quantity: 0 }], facts: [{ id: '' }] };
                        response = await makeRequest(body);
                    });

                    itShouldReturnErrorCodeAndErrorMessageInBody();
                });
            });

            describe('fetching appointment meant to be returned', () => {
                beforeEach(async () => {
                    const addService = jest.fn(() => Promise.resolve());
                    const addFact = jest.fn(() => Promise.resolve());
                    const createAppointment = { addFact, addService };
                    jest.spyOn(m.User, 'findByPk').mockResolvedValue({ createAppointment } as unknown as m.User);
                    jest.spyOn(m.Appointment, 'findByPk').mockImplementation(() => Promise.reject());
                    response = await makeRequest();
                });

                itShouldReturnErrorCodeAndErrorMessageInBody();
            });
        });

        describe('if user does not exist in database', () => {
            beforeEach(async () => {
                jest.spyOn(m.User, 'findByPk').mockResolvedValue(null);
                response = await makeRequest();
            });

            afterEach(() => {
                jest.restoreAllMocks();
            });

            itShouldReturnErrorCodeAndErrorMessageInBody(404, 'User not found');
        });

        describe('if facts were', () => {
            let services: m.Service[];

            function mapToIds(models: m.AppointmentFact[] | m.Service[]) {
                return models.map(mapToId);
            }

            function mapToId({ id }: m.AppointmentFact | m.Service) {
                return id;
            }

            function mapToCreationAttributes(models: m.Service[]): ServiceAssociationCreationAttribute[] {
                return models.map(mapToCreationAttribute);
            }

            function mapToCreationAttribute({ id }: m.Service): ServiceAssociationCreationAttribute {
                return { id, quantity: 1 };
            }

            beforeEach(async () => {
                jest.spyOn(m.User, 'findByPk');
                jest.spyOn(m.User.prototype, 'createAppointment');
                jest.spyOn(m.Appointment.prototype, 'addService');
                jest.spyOn(m.Appointment.prototype, 'addFact');
                jest.spyOn(m.Appointment, 'findByPk');

                services = await m.Service.bulkCreate(serviceRecords);
            });

            afterEach(async () => {
                await m.Service.destroy({ where: { id: mapToIds(services) } });

                jest.clearAllMocks();
            });

            describe('not sent in body', () => {
                beforeEach(async () => {
                    response = await makeRequest({ startsAt, services: mapToCreationAttributes(services) });
                });

                it('should call User.findByPk once', () => {
                    expect(m.User.findByPk).toHaveBeenCalledTimes(1);
                });

                it(`should call User.findByPk with ${id}`, () => {
                    expect(m.User.findByPk).toHaveBeenCalledWith(id);
                });

                it('should call User.prototype.createAppointment once', () => {
                    expect(m.User.prototype.createAppointment).toHaveBeenCalledTimes(1);
                });

                it(`should call Appointment.prototype.addService ${serviceRecords.length} times`, () => {
                    expect(m.Appointment.prototype.addService).toHaveBeenCalledTimes(serviceRecords.length);
                });

                it('should not call Appointment.prototype.addFact', () => {
                    expect(m.Appointment.prototype.addFact).not.toHaveBeenCalled();
                });

                it('should call Appointment.findByPk once', () => {
                    expect(m.Appointment.findByPk).toHaveBeenCalledTimes(1);
                });
            });

            describe('sent in body', () => {
                const facts = [
                    { id: '51bb9bb6-1a19-48dd-8c2a-2f28153ffd85' },
                    { id: '863a4e7a-eac2-4acf-9439-74a85c1fcd48' },
                ];

                beforeEach(async () => {
                    response = await makeRequest({ startsAt, services: mapToCreationAttributes(services), facts });
                });

                it('should call User.findByPk once', () => {
                    expect(m.User.findByPk).toHaveBeenCalledTimes(1);
                });

                it(`should call User.findByPk with ${id}`, () => {
                    expect(m.User.findByPk).toHaveBeenCalledWith(id);
                });

                it('should call User.prototype.createAppointment once', () => {
                    expect(m.User.prototype.createAppointment).toHaveBeenCalledTimes(1);
                });

                it(`should call Appointment.prototype.addService ${serviceRecords.length} times`, () => {
                    expect(m.Appointment.prototype.addService).toHaveBeenCalledTimes(serviceRecords.length);
                });

                it(`should call Appointment.prototype.addFact ${facts.length} times`, () => {
                    expect(m.Appointment.prototype.addFact).toHaveBeenCalledTimes(facts.length);
                });

                it('should call Appointment.findByPk once', () => {
                    expect(m.Appointment.findByPk).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});
