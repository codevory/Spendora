export async function requireAuth(req, res, next) {
  try {
    if (req.session && req.session.userId) {
      next();
      return;
    }
    console.warn("Access blocked to protected route");
    return res.status(401).json({ error: "unauthorized access" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Internal server Error" });
  }
}
