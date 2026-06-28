const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');

describe('Auth API', () => {
  const testUser = {
    username: 'testadmin',
    name: 'Test Admin',
    email: 'admin@test.com',
    phone: '1234567890',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'Admin'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.user).toHaveProperty('username', testUser.username);
      expect(res.body.user).toHaveProperty('role', 'Staff');
    });

    it('should fail if email already exists', async () => {
      // First registration
      await request(app).post('/api/auth/register').send(testUser);
      
      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
        
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
      await User.updateOne({ username: testUser.username }, { status: 'Active', role: 'Staff' });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', testUser.username);
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });
        
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid username or password');
    });
  });
});
