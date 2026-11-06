import test from "node:test"
import assert from "node:assert"
import app from "./server.js"
import http from "http"

const PORT = 5001
let server
let token

function makeRequest(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }

    const req = http.request(options, (res) => {
      let data = ""
      res.on("data", (chunk) => data += chunk)
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) })
        } catch {
          resolve({ status: res.statusCode, body: data })
        }
      })
    })

    req.on("error", reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

test("setup", async () => {
  server = app.listen(PORT)
  const loginRes = await makeRequest("POST", "/api/auth/login", {
    email: "admin@mrkhanwasteremovallondon.co.uk",
    password: "admin123",
  })
  token = loginRes.body.token
})

test("POST /api/public/quote - should create a quote", async () => {
  const res = await makeRequest("POST", "/api/public/quote", {
    name: "Test User",
    phone: "07700 123456",
    email: "test@example.com",
    service: "Furniture Removal",
    postcode: "SW1A 1AA",
  })
  assert.strictEqual(res.status, 201)
  assert.strictEqual(res.body.success, true)
  assert.ok(res.body.quote_id)
})

test("POST /api/auth/login - should login successfully", async () => {
  const res = await makeRequest("POST", "/api/auth/login", {
    email: "admin@mrkhanwasteremovallondon.co.uk",
    password: "admin123",
  })
  assert.strictEqual(res.status, 200)
  assert.ok(res.body.token)
  assert.strictEqual(res.body.user.email, "admin@mrkhanwasteremovallondon.co.uk")
})

test("GET /api/health - should return health status", async () => {
  const res = await makeRequest("GET", "/api/health")
  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.status, "ok")
})

test("GET /api/quotes - should list quotes with auth", async () => {
  const res = await makeRequest("GET", "/api/quotes", null, {
    Authorization: `Bearer ${token}`,
  })
  assert.strictEqual(res.status, 200)
  assert.ok(res.body.data)
  assert.ok(res.body.pagination)
})

test("GET /api/quotes - should require auth", async () => {
  const res = await makeRequest("GET", "/api/quotes")
  assert.strictEqual(res.status, 401)
})

test("POST /api/auth/change-password - should change password", async () => {
  const res = await makeRequest("POST", "/api/auth/change-password", {
    currentPassword: "admin123",
    newPassword: "newpassword123",
  }, {
    Authorization: `Bearer ${token}`,
  })
  assert.strictEqual(res.status, 200)
  assert.strictEqual(res.body.message, "Password changed successfully")
})

test("teardown", async () => {
  server.close()
})