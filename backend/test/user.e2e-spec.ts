import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request, { Response } from "supertest";
import type { Server } from "http";
import { AppModule } from "../src/app.module";

describe("Users API (e2e)", () => {
  let app: INestApplication;
  let server: Server; // ✅ declare server variable

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer() as Server; // ✅ type casting to avoid eslint any warning
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /users → should create a user", async () => {
    const res: Response = await request(server)
      .post("/users")
      .send({
        email: "test@test.com",
        password: "123456",
        display_name: "Test User",
      })
      .expect(201);

    expect(res.body).toMatchObject({
      email: "test@test.com",
      display_name: "Test User",
    });
  });
});
