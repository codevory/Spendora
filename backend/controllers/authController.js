import { getDBConnection } from "../db/getBDConnection.js";
import validator from "validator";
import { getOriginKey } from "../helpers/getOriginKey.js";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
  const db = await getDBConnection();

  let { fullName, email, username, password, currency } = req.body;

  if (!fullName || !password || !email || !username || !currency) {
    return res.status(400).json({ error: "All fields are required" });
  } else if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  } else if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
    return res.status(400).json({
      error:
        "Username must be 1–20 characters, using letters, numbers, _ or -.",
    });
  }
  const usernameResult = await db.query(
    "SELECT username FROM users WHERE username = $1",
    [username.trim()],
  );
  const existingUserName = usernameResult.rows[0];
  if (existingUserName) {
    return res.status(400).json({ error: "username already taken!" });
  }

  let emailResult = await db.query(`SELECT email FROM users WHERE email = $1`, [
    email.trim(),
  ]);
  const existingEmail = emailResult.rows[0];
  if (existingEmail) {
    return res.status(400).json({ error: "Email already in use!" });
  }
  fullName = fullName.trim();
  email = email.trim();
  username = username.trim();
  currency = currency.trim();
  password = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      "INSERT INTO users (name,email,username,password,currency) VALUES($1,$2,$3,$4,$5) RETURNING id",
      [fullName, email, username, password, currency],
    );

    req.session.userId = result.rows[0].id;
    console.log("user registered successfully🎉");

    return res.status(201).json({ message: "Registration Successfull" });
  } catch (err) {
    console.error("Error : ", err.message);
  }
}

export async function loginUser(req, res) {
  let { email, password } = req.body;
  const db = await getDBConnection();

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  email = email.trim();

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    req.session.userId = user.id;
    console.log("login successfull");

    return res.status(200).json({ Authenticated: true });
  } catch (err) {
    console.error("Error during login : ", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export function logoutUser(req, res) {
  console.log("trying to logout user");
  req.session.destroy(() => {
    res.status(200).json({ message: "User logged out successfully🎉" });
  });
}
