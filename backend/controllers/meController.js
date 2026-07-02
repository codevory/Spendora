import { getDBConnection } from "../db/getBDConnection.js";

export async function getCurrentUser(req, res) {
  const db = await getDBConnection();

  try {
    const userResult = await db.query(
      'SELECT name AS "fullName",email,username,currency,created_at FROM users WHERE id = $1',
      [req.session.userId],
    );

    const user = userResult.rows[0];

    return res.status(200).json(user);
  } catch (error) {
    console.error("error getting userData : ", error.message);
    return res.status(500).json({ error: "internal server error" });
  }
}
