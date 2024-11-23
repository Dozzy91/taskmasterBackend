const request = require('supertest');
const app = require('../app'); // Adjust path as needed

async function getAuthToken() {
  const response = await request(app)
    .post('/auth/login')
    .send({ email: 'testuser@mail.com', password: 'password' });
  return response.body.token;
}

module.exports = { getAuthToken };
