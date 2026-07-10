const request = require('supertest');
const { app } = require('../app');

describe('Reservations API', () => {
  let token;
  
  beforeEach(async () => {
    // Register and login to get token
    const testUser = {
      username: 'teststaff_res',
      name: 'Test Staff',
      email: 'staff2_res@test.com',
      phone: '1234567890',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'Admin'
    };
    await request(app).post('/api/auth/register').send(testUser);
    
    // Manually activate user to pass the new Approval system
    const User = require('../models/User');
    await User.updateOne({ username: testUser.username }, { status: 'Active', role: 'Staff' });

    const loginRes = await request(app).post('/api/auth/login').send({
      username: testUser.username,
      password: testUser.password
    });
    token = loginRes.body.token;
  });

  describe('POST /api/reservations', () => {
    it('should create a new reservation', async () => {
      const reservationData = {
        name: 'John Doe',
        table: 'Table 2',
        guests: 4,
        date: '2026-06-23',
        time: '7:00 PM',
        phone: '1234567890',
        status: 'Pending',
        notes: 'Window seat'
      };

      const res = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${token}`)
        .send(reservationData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', reservationData.name);
      expect(res.body).toHaveProperty('table', reservationData.table);
    });
  });

  describe('GET /api/reservations', () => {
    it('should fetch all reservations', async () => {
      const res = await request(app)
        .get('/api/reservations')
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});
