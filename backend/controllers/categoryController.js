import { getDBConnection } from "../db/getBDConnection.js";
let getCategoryCount = 0;
export async function getCategories(req, res) {
  const db = await getDBConnection();
  getCategoryCount += 1;
  try {
    const categoriesResult = await db.query(
      "SELECT * FROM expensecategories WHERE user_id = $1",
      [req.session.userId],
    );
    const categories = categoriesResult.rows;

    return res.status(200).json({ categories });
  } catch (err) {
    console.error("error getting categories : ", err.message);
    return res.status(500).json({ error: `internal server error ` });
  }
}

export async function addNewCategory(req, res) {
  const db = await getDBConnection();

  let { name } = req.body;
  console.log(name);
  name = name.trim().toLowerCase();

  try {
    const categoryResult = await db.query(
      "SELECT * FROM expensecategories WHERE name = $1",
      [name],
    );
    const existingCategory = categoryResult.rows[0];
    if (existingCategory) {
      return res.status(409).json({ error: "category already exists!" });
    }

    await db.query(
      "INSERT INTO expensecategories (user_id,name) VALUES($1,$2)",
      [req.session.userId, name],
    );

    let category = await db.query(
      "SELECT id,name FROM expensecategories WHERE user_id = $1 AND name = $2",
      [req.session.userId, name],
    );

    category = category.rows[0];
    res.status(201).json({ category });
  } catch (err) {
    console.error("Error adding category : ", err.message);
    return res.status(500).json({ error: `Failed to add new 😩Category` });
  }
}

export async function renameCategory(req, res) {
  const db = await getDBConnection();
  const { category } = req.body;
  try {
    await db.query(
      "UPDATE expensecategories SET name = $1 WHERE user_id = $2 AND id = $3",
      [category.name.toLowerCase().trim(), req.session.userId, category.id],
    );
    let categories = await db.query(
      "SELECT * FROM expensecategories WHERE user_id = $1",
      [req.session.userId],
    );
    categories = categories.rows;

    return res.status(201).json({ categories });
  } catch (err) {
    console.error("error renaming category : ", err.message);
    return res.status(500).json({
      error: `Failed to update category, server error `,
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
    const isValid = await db.query(
      "SELECT (id,name) FROM expensecategories WHERE id = $1 AND user_id = $2",
      [category.id, req.session.userId],
    );
    if (!isValid) {
      return res.status(400).json({ error: "Category not found" });
    }
    await db.query(
      "DELETE FROM expensecategories WHERE id = $1 AND user_id = $2",
      [category.id, req.session.userId],
    );

    console.log("item ", category, "deleted successfully");
    return res.status(204).send();
  } catch (err) {
    console.error("error causing to delete ", err.message);
    return res.status(500).json({ error: err.message });
  }
}
