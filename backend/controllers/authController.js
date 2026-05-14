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
  const existingUserName = await db.get(
    "SELECT username FROM users WHERE username = ?",
    [username.trim()],
  );
  if (existingUserName) {
    return res.status(400).json({ error: "username already taken!" });
  }
  const existingEmail = await db.get(
    `SELECT email FROM users WHERE email = ?`,
    [email.trim()],
  );
  if (existingEmail) {
    return res.status(400).json({ error: "Email already in use!" });
  }
  fullName = fullName.trim();
  email = email.trim();
  username = username.trim();
  currency = currency.trim();
  password = await bcrypt.hash(password, 10);

  try {
    const result = await db.run(
      "INSERT INTO users (name,email,username,password,currency) VALUES(?,?,?,?,?)",
      [fullName, email, username, password, currency],
    );
    req.session.userId = result.lastID;
    console.log("user registered successfully🎉");
    res.status(201).json({ message: "Registration Successfull" });
  } catch (err) {
    console.error("Error : ", err.message);
  } finally {
    await db.close();
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
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid password or email" });
    }

    req.session.userId = user.id;
    console.log("login successfull");
    res.status(201).json({ Authenticated: true });
  } catch (err) {
    console.error("Error : ", err.message);
  } finally {
    await db.close();
  }
}

export function logoutUser(req, res) {
  console.log("trying to logout user");
  req.session.destroy(() => {
    res.status(201).json({ message: "User logged out successfully🎉" });
  });
}
