import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupTestApp } from '../helpers/setup-test-app';
import { JwtAuthGuard } from '../../src/auth/infrastructure/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  const testUser = {
    name: 'John',
    lastname: 'Doe',
    email: `john${Date.now()}@example.com`,
    phone: '+1234567890',
    password: 'Test1234',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(ThrottlerGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    setupTestApp(app);
    await app.init();

    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser);
    
    userId = registerRes.body.id;

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    
    authToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should get all users with authentication', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          // Response has pagination {data, meta}
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body).toHaveProperty('meta');
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should get user by id', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/api/users/123e4567-e89b-12d3-a456-426614174999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should update user', () => {
      return request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'UpdatedName' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('UpdatedName');
        });
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'invalid-email' })
        .expect(400);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete user', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 404 when deleting again', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
