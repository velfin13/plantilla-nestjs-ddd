import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { setupTestApp } from '../helpers/setup-test-app';
import { JwtAuthGuard } from '../../src/auth/infrastructure/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let taskId: string;
  const testUser = {
    name: 'Task',
    lastname: 'Tester',
    email: `task${Date.now()}@example.com`,
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

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser);

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    
    authToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', () => {
      return request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Task' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Task');
          expect(res.body.completed).toBe(false);
          taskId = res.body.id;
        });
    });

    it('should fail with invalid title', () => {
      return request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'AB' })
        .expect(400);
    });

    it('should fail with missing title', () => {
      return request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('/tasks (GET)', () => {
    it('should get all tasks', () => {
      return request(app.getHttpServer())
        .get('/api/tasks')
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

  describe('/tasks/:id (GET)', () => {
    it('should get task by id', () => {
      return request(app.getHttpServer())
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(taskId);
          expect(res.body.title).toBe('Test Task');
        });
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .get('/api/tasks/123e4567-e89b-12d3-a456-426614174999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    it('should update task title', () => {
      return request(app.getHttpServer())
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Task' })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Task');
        });
    });
  });

  describe('/tasks/:id/toggle (PATCH)', () => {
    it('should toggle task completion', () => {
      return request(app.getHttpServer())
        .patch(`/api/tasks/${taskId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.completed).toBe(true);
        });
    });

    it('should toggle back to incomplete', () => {
      return request(app.getHttpServer())
        .patch(`/api/tasks/${taskId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.completed).toBe(false);
        });
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete task', () => {
      return request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 404 when deleting again', () => {
      return request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
