// const config = {
//     user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     password: process.env.PG_PASSWORD,
//     port: process.env.PG_PORT,
// };
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
});

afterAll(() => {
    console.log.mockRestore(); // Restore console.log
});

jest.setTimeout(30000);
require('dotenv').config();
