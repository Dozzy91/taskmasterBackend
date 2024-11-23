// // process.env.PORT = 4000; // Set a custom port for Jest tests to avoid conflict with the app server port

const request = require('supertest');
const  app  = require('../app'); // Main app file
const { getAuthToken } = require('./getToken')

describe('Task Creation', () => {
  let token 
  beforeAll(async () => {
    token = await getAuthToken();
  });
  // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJlbWljb2xlQGdtYWlsLmNvbSIsImlhdCI6MTczMjMyOTU5MiwiZXhwIjoxNzMyMzMzMTkyfQ.F4uohhmTDsbhRGmwNzl0wjdttaELVWaVHnZvg2JO7Tk'
  it('creates a new task when valid data is provided', async () => {
    const response = await request(app)
    .post('/task/')
    .set('Authorization', `Bearer ${token}`) // adding authorization token
    .send({
        "task": "Clean the bathroom",
        "description": "Wash the restroom and restock the toiletries",
        "priority": "medium",
        "completed": "false",
        "due_date": "2024-12-31T02:59:00Z",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.task).toBe('Clean the bathroom');
    expect(response.body.description).toBe('Wash the restroom and restock the toiletries');
  });

  it('should return a 400 error if task is missing', async () => {
    const response = await request(app)
    .post('/task/')
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: 'Missing title',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Task is required');
  });
});