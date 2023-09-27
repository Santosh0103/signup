const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const app = express();
app.use(cors());
const port = 3000;

app.use(bodyParser.json());

dotenv.config({
  path: './.env'
})
const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: 3308
})

db.connect((error) => {
  if (error) {
    console.log(error)
  }
  else {
    console.log("mysql connected")
  }
})

const secretKey = process.env.JWT_SECRET_KEY;



//user registration end point
app.post("/register", async (req, res) => {
  console.log(req.body)
  const { username, password, email } = req.body;
  // Check if a user with the same email or name already exists in the database
  db.query('SELECT email from users WHERE email=?||name=?', [email, username], async (error, results) => {
    try {
      // If a user with the same email or name exists, return an error response   
      if (results.length > 0) {
        return res.status(500).json({ message: "User already exists" });
      }
      // Hash the user's password using bcrypt for security
      let hashedpassword = await bcrypt.hash(password, 8)
      console.log(hashedpassword)
      // Insert the new user's information into the database
      db.query('INSERT INTO users SET ?', { name: username, email: email, password: hashedpassword })
      return res.status(200).json({ message: "User Registered" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  })



});

//login with valid credentials, jwt token generation
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `
  SELECT * FROM users
  WHERE name = ? 
`;

  try {
    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error('Database query error: ' + err.message);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 1) {
        // Compare the provided password with the hashed password from the database
        const user = results[0];
        try {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            // Login successful
            const token = jwt.sign({ userId: user.id, name: user.name }, secretKey, {
              expiresIn: "1h",
            });
            console.log(user);
            res.status(200).json({ message: 'Login successful', token });
          } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid password' });
          }
        } catch (bcryptErr) {
          console.error('Password comparison error: ' + bcryptErr.message);
          res.status(500).json({ message: 'Internal server error' });
        }
      } else {
        // User not found
        res.status(401).json({ message: 'User not found' });
      }
    });
  } catch (error) {
    console.error('Database query error: ' + error.message);
    res.status(500).json({ message: 'Internal server error' });
  }




});

//route for jwt token verification
app.get("/verifytoken", verifyToken, (req, res) => {
  return res.json({ message: "Login Successful" });
});

// Middleware function for verifying the token
function verifyToken(req, res, next) {
  try {
    const token = req.headers["authorization"].replace("Bearer ", "");
    console.log(token);

    if (!token) {
      throw new Error("Token not provided");
    }
    // Verify the token using a secret key (JWT verification)
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        throw new Error("Authentication failed");
      }
      console.log("Verified token");
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Token verification error: " + error.message);
    if (error.message === "Token not provided") {
      return res.status(403).json({ message: "Token not provided" });
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }
  }
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
