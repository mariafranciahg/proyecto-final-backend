const request = require("supertest");
const app = require("../index"); 

describe("API Servicasa", () => {
  let token = "";

  test("Registro de usuario", async () => {
    const res = await request(app).post("/register").send({
      nombre: "Test User",
      foto: "",
      email: "test@test.com",
      password: "1234",
      rol: "usuario"
    });

    expect(res.statusCode).toBe(201);
  });

  test("Login de usuario", async () => {
    const res = await request(app).post("/login").send({
      email: "test@test.com",
      password: "1234"
    });

    token = res.body.token;
    expect(res.statusCode).toBe(200);
    expect(token).toBeDefined();
  });

  test("Perfil protegido con token", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test("Crear servicio protegido", async () => {
    const res = await request(app)
      .post("/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Servicio test",
        foto: "",
        descripcion: "Servicio de prueba",
        precio: 10000,
        usuario_id: 1,
        categoria_id: 1
      });

    expect(res.statusCode).toBe(201);
  });
});
