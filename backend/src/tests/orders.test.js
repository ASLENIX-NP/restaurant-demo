const request = require('supertest');
const { app } = require('../app');

describe('Orders API', () => {
  let token;
  
  beforeEach(async () => {
    // Register and login to get token
    const testUser = {
      username: 'teststaff_orders',
      name: 'Test Staff',
      email: 'staff_orders@test.com',
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

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        table: 'Walk-in',
        items: [
          { name: 'Burger', price: 10, qty: 2 }
        ],
        subtotal: 20,
        tax: 2,
        total: 22,
        paymentStatus: 'Unpaid'
      };

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('table', orderData.table);
      expect(res.body).toHaveProperty('status', 'Pending');
    });
  });

  describe('GET /api/orders', () => {
    it('should fetch all orders', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});
