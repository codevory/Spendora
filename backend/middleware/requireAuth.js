export async function requireAuth(req, res, next) {
  try {
    if (req.session.userId) {
      next();
      return;
    }
    console.warn("Access blocked to protected route");
    res.status(401).json({ error: "unauthorized access" });
  } catch (err) {
    console.error(err.message);
  }
}
