import { getDBConnection, is_Production } from "../db/getBDConnection.js";
import validator from "validator";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
  
  let { fullName, email, username, password, currency } = req.body;
  
  if (
    !fullName.trim() ||
    !password ||
    !email.trim() ||
    !username.trim() ||
    !currency
  ) {
    return res.status(400).json({ error: "All fields are required" });
  } else if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  } else if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
    return res.status(400).json({
      error:
      "Username must be 1–20 characters, using letters, numbers, _ or -.",
    });
  }
  
  fullName = fullName.trim();
  email = email.trim().toLowerCase();
  username = username.trim().toLowerCase();
  currency = currency.trim();
  password = await bcrypt.hash(password, 10);
  
  const db = await getDBConnection();
  const client = await db.connect()

  
  try {
    await client.query("BEGIN")
    const userResult = await client.query(
      "SELECT username,email FROM users WHERE LOWER(username) = $1 OR LOWER(email) = $2",
      [username, email],
    );
  
    if (userResult.rows.length > 0) {
      let isUserNameTaken = false;
      let isEmailTaken = false;
  
      for (const row of userResult.rows) {
        if (row.username.toLowerCase() === username) isUserNameTaken = true;
        
        if (row.email.toLowerCase() === email) isEmailTaken = true;
      }
  
      if (isEmailTaken && isUserNameTaken) {
        await client.query("ROLLBACK").catch(() => undefined)
        return res
        .status(400)
        .json({ error: "Username and Email are both already taken!" });
      }
      
      if (isEmailTaken) {
        await client.query("ROLLBACK").catch(() => undefined)
        return res.status(400).json({ error: "Email already in use!" });
      }
      
      if (isUserNameTaken) {
        await client.query("ROLLBACK").catch(() => undefined)
        return res.status(400).json({ error: "Username already taken!" });
      }
    }
    const result = await client.query(
      'INSERT INTO users (fullname,email,username,password,currency) VALUES($1,$2,$3,$4,$5) RETURNING id,fullname as "fullName", email, username,currency',
      [fullName, email, username, password, currency],
    );

    if(result.rows.length === 0){
      await client.query("ROLLBACK").catch(() => undefined)
      return res.status(400).json({ error: "Failed to create user" });
    }
    
    await client.query("COMMIT")
    req.session.userId = result.rows[0].id;
    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined)
    console.error("Error while creating user : ", err.message);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release()
  }
}

export async function loginUser(req, res) {
  let { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const db = await getDBConnection();
  const client = await db.connect();

  try {
    const userResult = await client.query(
      "SELECT id,fullname,email,username,uid,currency,password,inserted_at FROM users WHERE email = $1",
      [email],
    );

    if(userResult.rows.length === 0){
      return res.status(400).json({ error: "This account doesn't exists" });
    }

    const user = userResult.rows[0];

    if (!user?.email) {
      return res.status(400).json({ error: "This account doesn't exists" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    req.session.userId = user.id;
    const userDetails = {
      id: user.id,
      uid: user.uid,
      fullName: user.fullname,
      username: user.username,
      email: user.email,
      currency: user.currency,
    };
    return res.status(200).json(userDetails);
  } catch (err) {
    console.error("Error logging in user : ", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally{
    client.release()
  }
}

export function logoutUser(req, res) {
  console.log("trying to logout user");

  const cookieName = "connect.sid";

  res.clearCookie(cookieName, {
    path: "/",
    secure: is_Production,
    sameSite: is_Production ? "none" : "lax",
  });

  req.session.destroy((err) => {
    if (err) {
      console.error("session destruction error ", err);
      return res
        .status(500)
        .json({ error: "Failed to destroy session on server" });
    }
    return res.status(200).json({ message: "User logged out successfully🎉" });
  });
}
