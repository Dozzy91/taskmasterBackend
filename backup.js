process.env.PORT=4000; // Set a custom port for Jest tests to avoid conflict with the app server port
                          // this si strategically placed here to override the app's port before the the process hits it

const request = require('supertest');
const app = require('../app');
const loginUser  = require('../controllers/userLogin');


jest.mock('../controllers/userLogin'); // Mocking for isolation


// loginUser.findOne.mockResolvedValue(null);


describe('User Authentication (login a user)', () => {
  beforeEach(() => {
    loginUser.findOne = jest.fn();
  });

  it('should return a token if credentials are valid', async () => {
    // Mock valid user
    loginUser.findOne.mockResolvedValue({
        "email": "testuser@mail.com",
        "password": jest.fn(() => Promise.resolve(true)),
    });

    const response = await request(app).post('/auth/login').send({
      email: 'testuser@mail.com',
      password: 'password',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return a 401 error if credentials are invalid', async () => {
    loginUser.findOne.mockResolvedValue(null); // Mock no user found

    const response = await request(app).post('/auth/login').send({
      email: 'testuser@mail.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should return a 400 error if email or password is missing', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email and password are required');
  });
});