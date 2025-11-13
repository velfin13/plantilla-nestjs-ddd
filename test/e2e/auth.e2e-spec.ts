import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupTestApp } from '../helpers/setup-test-app';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const testUser = {
    name: 'Test',
    lastname: 'User',
    email: `test${Date.now()}@example.com`,
    phone: '+1234567890',
    password: 'Test1234',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(ThrottlerGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    setupTestApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.name).toBe(testUser.name);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('Email already registered');
        });
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...testUser, email: 'invalid-email' })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          authToken = res.body.access_token;
        });
    });

    it('should fail with wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid credentials');
        });
    });

    it('should fail with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        })
        .expect(401);
    });

    it('should fail with missing fields', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email })
        .expect(400);
    });
  });
});
