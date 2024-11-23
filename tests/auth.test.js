process.env.PORT=4000; // Set a custom port for Jest tests to avoid conflict with the app server port
                          // this si strategically placed here to override the app's port before the the process hits it

const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// mock imports
jest.mock('jsonwebtoken');
jest.mock('bcrypt');


describe('User Authentication (login a user)', () => {
  const mockUser = {email: "testuser@mail.com", password: "password123" }; // creating a mock user

  beforeEach(() => {
    bcrypt.compare.mockResolvedValue(true); // Mock valid password
    jwt.sign.mockReturnValue('mockedToken'); // Mock token creation
  });

  it('should return a token if credentials are valid', async () => {
    const response = await request(app)
    .post('/auth/login')
    .send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toBe('mockedToken');
  });

  it('should return a 401 error if credentials are invalid', async () => {
    bcrypt.compare.mockResolvedValue(false); // Mock invalid password
    const response = await request(app)
      .post('/auth/login')
      .send({ 
        email: mockUser.email, 
        password: 'wrongPassword' 
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should return a 400 error if email or password is missing', async () => {
    const response = await request(app).post('/auth/login')
    .send({
      email: mockUser.email,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email and password are required');
  });
});