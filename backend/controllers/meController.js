import { getDBConnection } from "../db/getBDConnection.js";

export async function getCurrentUser(req, res) {
  if (!req.session.userId) {
    return res.status(400).json({ isLoggedIn: false });
  }
  const db = await getDBConnection();
  try {
    const userResult = await db.query("SELECT * FROM users WHERE id = $1", [
      req.session.userId,
    ]);

    const user = userResult.rows[0];

    const data = {
      fullName: user.name,
      email: user.email,
      username: user.username,
      currency: user.currency,
      created_at: user.created_at,
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error("error getting userData : ", error.message);
    return res.status(500).json({ error: "internal server error" });
  }
}
