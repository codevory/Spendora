import { getDBConnection } from "../db/getBDConnection.js";

export async function getCurrentUser(req, res) {
  if (!req.session.userId) {
    return res.status(400).json({ isLoggedIn: false });
  }
  const db = await getDBConnection();
  try {
    const user = await db.get("SELECT * FROM users WHERE id = ?", [
      req.session.userId,
    ]);
    const data = {
      fullName: user.name,
      email: user.email,
      username: user.username,
      currency: user.currency,
      created_at: user.created_at,
    };
    return res.status(200).json(data);
  } catch (error) {
    console.error("error : ", error.message);
  }
}
