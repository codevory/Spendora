import { getDBConnection } from "../db/getBDConnection.js";

export async function getCategories(req, res) {
  const db = await getDBConnection();

  try {
    const categories = await db.all("SELECT * FROM expenseCategories");
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ error: `server error ${err.message}` });
  }
}
export async function addNewCategory(req, res) {
  const db = await getDBConnection();
  let { newCategory } = req.body;
  console.log(newCategory);
  newCategory.name = newCategory.name.trim().toLowerCase();
  try {
    const existing = await db.get(
      "SELECT * FROM expenseCategories WHERE name = ?",
      [newCategory.name],
    );
    if (existing) {
      return res.status(401).json({ error: "category already exists!" });
    }
    await db.run(
      "INSERT INTO expenseCategories (id,user_id,name) VALUES(?,?,?)",
      [newCategory.id, req.session.userId, newCategory.name],
    );
    res.status(201).json({ response: "category added successfully🎉" });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to add new 😩Category ${err.message}` });
  }
}
export async function renameCategory(req, res) {
  const db = await getDBConnection();
  const {} = req.body;
  try {
    await db.run(
      "UPDATE expenseCategories SET name = ? WHERE user_id = ? AND id = ?",
      [],
    );
  } catch (err) {
    console.error(err.message);
    res.status(502).json({
      error: `Failed to update category, server error ${err.message}`,
    });
  }
}
