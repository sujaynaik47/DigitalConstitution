const request = require('supertest');
const createApp = require('../app');

describe('GET /api/health', () => {
  let app;
  beforeAll(() => {
    app = createApp();
  });

  it('returns 200 with { status: "ok" }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
