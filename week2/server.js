const express = require("express");
const app = express();

app.use(express.json());

// Fake database
let users = [
  { id: 1, name: "An", email: "an@gmail.com" },
  { id: 2, name: "Binh", email: "binh@gmail.com" }
];

// Middleware giới hạn request (simulate 429)
let requestCount = 0;
app.use((req, res, next) => {
  requestCount++;
  if (requestCount > 20) {
    return res.status(429).json({
      error: "Too many requests"
    });
  }
  next();
});



// 1. GET danh sách người dùng

app.get("/users", (req, res) => {
  res.status(200).json(users);
});



// 2. GET user theo id
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  res.status(200).json(user);
});

// 3. POST tạo user mới
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Missing name or email"
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json(newUser);
});



// 4. PUT cập nhật email
app.put("/users/:id/email", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  if (!email) {
    return res.status(400).json({
      error: "Email is required"
    });
  }

  user.email = email;

  res.status(200).json(user);
});



// 5. DELETE user
app.delete("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);

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

app.get("/error", (req, res) => {
  throw new Error("Server crashed!");
});



// Middleware xử lý lỗi 500

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