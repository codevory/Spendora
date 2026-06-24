import { getDBConnection } from "../db/getBDConnection.js";
let getCategoryCount = 0;
export async function getCategories(req, res) {
  const db = await getDBConnection();
  getCategoryCount += 1;
  try {
    const categories = await db.all("SELECT name,id FROM expenseCategories");

    console.log("getCategoryCall : ", getCategoryCount);
    return res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ error: `server error ${err.message}` });
    console.log("getCategoryCall : ", getCategoryCount);
  }
}
export async function addNewCategory(req, res) {
  const db = await getDBConnection();
  let { name } = req.body;
  console.log(name);
  name = name.trim().toLowerCase();
  try {
    const existing = await db.get(
      "SELECT * FROM expenseCategories WHERE name = ?",
      [name],
    );
    if (existing) {
      return res.status(401).json({ error: "category already exists!" });
    }
    await db.run("INSERT INTO expenseCategories (user_id,name) VALUES(?,?)", [
      req.session.userId,
      name,
    ]);
    const category = await db.get(
      "SELECT name,id FROM expenseCategories WHERE name = ? AND user_id = ?",
      [name, req.session.userId],
    );
    res.status(201).json({ category });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to add new 😩Category ${err.message}` });
  }
}
export async function renameCategory(req, res) {
  const db = await getDBConnection();
  let { category } = req.body;
  category.name = category.name.trim();
  console.log(category);
  try {
    const isValid = await db.get(
      "SELECT * FROM expenseCategories WHERE id = ? AND user_id = ?",
      [category.id, req.session.userId],
    );
    if (!isValid) {
      return res.status(400).json({ error: "Category doesn't exist!" });
    }

    const existing = await db.get(
      "SELECT name,id FROM expenseCategories WHERE name = ? AND user_id = ?",
      [category.name, req.session.userId],
    );

    if (existing) {
      return res.status(400).json({
        error: `Category already exists with id : ${existing.id} name ${existing.name}`,
      });
    }
    await db.run(
      "UPDATE expenseCategories SET name = ? WHERE user_id = ? AND id = ?",
      [category.name, req.session.userId, category.id],
    );

    const categories = await db.all(
      "SELECT id,name FROM expenseCategories WHERE user_id = ?",
      [req.session.userId],
    );
    res.status(201).json({ categories });
  } catch (err) {
    console.error(err.message);
    res.status(502).json({
      error: `Failed to update category, server error ${err.message}`,
    });
  }
}

export async function deleteCategory(req, res) {
  let { category } = req.body;
  category.name = category.name.trim();
  if (!category.id) {
    return res.status(400).json({ error: "categoryId is required" });
  }
  category.id = parseInt(category.id);
  if (isNaN(category.id)) {
    return res.status(400).json({ error: "Invalid categoryId" });
  }
  const db = await getDBConnection();

  try {
    const isValid = await db.get(
      "SELECT id,name FROM expenseCategories WHERE id = ? AND user_id = ?",
      [category.id, req.session.userId],
    );
    if (!isValid.id) {
      return res.status(400).json({ error: "Category not found" });
    }
    await db.run("DELETE FROM expenseCategories WHERE id = ? AND user_id = ?", [
      category.id,
      req.session.userId,
    ]);

    console.log("item ", category, "deleted successfully");
    return res.status(204).send();
  } catch (err) {
    console.error("error causing to delete ", err.message);
    return res.status(500).json({ error: err.message });
  }
}
