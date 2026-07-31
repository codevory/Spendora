import { getDBConnection } from "../db/getBDConnection.js";
import { validateLimit, validateSort } from "../helpers/utils.ts";

export async function addNewCategory(req, res) {
  const db = await getDBConnection();

  let { name } = req.body;
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "category name is required" });
  }
  name = name.trim().toLowerCase();

  try {
    const categoryResult = await db.query(
      "SELECT id, name FROM expensecategories WHERE user_id = $1 AND name = $2",
      [req.session.userId, name],
    );
    const existingCategory = categoryResult.rows[0];
    if (existingCategory) {
      return res.status(409).json({ error: "category already exists!" });
    }

    const createdCategory = await db.query(
      "INSERT INTO expensecategories (user_id, name) VALUES($1, $2) RETURNING id, name",
      [req.session.userId, name],
    );

    res.status(201).json({ category: createdCategory.rows[0] });
  } catch (err) {
    console.error("Error adding category : ", err.message);
    return res.status(500).json({ error: `Failed to add new 😩Category` });
  }
}

export async function renameCategory(req, res) {
  const db = await getDBConnection();
  let { id } = req.params;
  id = parseInt(id);
  const { name } = req.body;

  if (!id || typeof id !== "number") {
    return res.status(400).json({ error: "category id is required" });
  } else if (!name || typeof name !== "string") {
    return res.status(200).json({ error: "category name is required" });
  }

  try {
    const category_renamed = await db.query(
      "UPDATE expensecategories SET name = $1 WHERE user_id = $2 AND id = $3 RETURNING id,name",
      [name.trim().toLowerCase(), req.session.userId, parseInt(id)],
    );

    if (category_renamed.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "category not found or unauthorized access" });
    }

    return res.status(201).json({ category: category_renamed.rows[0] });
  } catch (err) {
    console.error("error renaming category : ", err.message);
    return res.status(500).json({
      error: `Failed to update category, server error `,
    });
  }
}

export async function deleteCategory(req, res) {
  let { id } = req.params;
  id = parseInt(id);

  console.log("cat to del:  ", id);
  if (!id || typeof id !== "number") {
    return res.status(400).json({ error: "categoryId is required" });
  }
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid categoryId" });
  }
  const db = await getDBConnection();

  try {
    const isValid = await db.query(
      "SELECT id FROM expensecategories WHERE id = $1 AND user_id = $2",
      [id, req.session.userId],
    );
    if (isValid.rows.length === 0) {
      return res.status(400).json({ error: "Category not found" });
    }
    await db.query(
      "DELETE FROM expensecategories WHERE id = $1 AND user_id = $2",
      [id, req.session.userId],
    );

    console.log("category deleted successfully");
    return res.status(204).send();
  } catch (err) {
    console.error("error causing to delete ", err.message);
    return res.status(500).json({ error: err.message });
  }
}

export async function getCategories(req, res) {
  const { sort, limit } = req.params;

  let data_sort = validateSort(sort);
  let data_limit = validateLimit(limit ?? 50);

  const db = await getDBConnection();

  try {
    const categoriesResult = await db.query(
      `SELECT 
      c.id,
      c.name,
      COUNT(e.id) AS "transactionCount"
      FROM expensecategories c
      LEFT JOIN userexpense e ON c.id = e.category_id
      WHERE c.user_id = $1 
      GROUP BY c.id, c.name 
      ORDER BY "transactionCount" ${data_sort}
      LIMIT $2
      `,
      [req.session.userId, data_limit],
    );

    return res.status(200).json({
      categories: categoriesResult.rows,
      meta: {
        size: categoriesResult.rows.length,
      },
    });
  } catch (err) {
    console.error("error getting categories : ", err.message);
    return res.status(500).json({ error: `internal server error ` });
  }
}
