const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Path to users file
const usersFile = path.join(__dirname, "users.json");

// Load users
function loadUsers() {
    if (!fs.existsSync(usersFile)) return [];
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
}

// Save users
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// **User Registration API**
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    let users = loadUsers();
    
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: "User already exists" });
    }

    users.push({ username, password });
    saveUsers(users);

    res.json({ message: "✅ Registration successful! You can now log in." });
});

// **User Login API**
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    let users = loadUsers();

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({ message: "✅ Login successful!", token: "authenticated", username });
});

// **Admin Fetch Users API**
app.get("/admin/users", (req, res) => {
    let users = loadUsers();
    res.json(users);
});

// **Start Server**
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
