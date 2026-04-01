const express = require("express");
const app = express();

app.use(express.json());

// Fake database
let users = [
  { id: 1, name: "An", email: "an@gmail.com" },
  { id: 2, name: "Binh", email: "binh@gmail.com" }
];

// Simple rate limit theo IP
const rateLimitMap = new Map();
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, time: now });
    return next();
  }

  const data = rateLimitMap.get(ip);

  if (now - data.time > 60000) {
    rateLimitMap.set(ip, { count: 1, time: now });
    return next();
  }

  data.count++;

  if (data.count > 20) {
    return res.status(429).json({
      error: "Too many requests"
    });
  }

  next();
});


// GET danh sách user
app.get("/users", (req, res) => {
  res.status(200).json(users);
});


// GET user theo id
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid user id"
    });
  }

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  res.status(200).json(user);
});


// POST tạo user mới
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Missing name or email"
    });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({
      error: "Email already exists"
    });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json(newUser);
});


// PUT cập nhật email
app.put("/users/:id/email", (req, res) => {
  const id = parseInt(req.params.id);
  const { email } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid user id"
    });
  }

  if (!email) {
    return res.status(400).json({
      error: "Email is required"
    });
  }

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  user.email = email;

  res.status(200).json(user);
});


// DELETE user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid user id"
    });
  }

  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  users.splice(index, 1);

  res.status(200).json({
    message: "User deleted"
  });
});


// Lỗi 500 giả lập
app.get("/error", (req, res, next) => {
  next(new Error("Server crashed"));
});


// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "Internal Server Error"
  });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});


app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});