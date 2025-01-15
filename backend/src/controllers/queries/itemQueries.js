import { pool } from "../../db.js";

export const itemQueries = {
  async getItems() {
    const query = `
      SELECT * FROM items;
    `;

    try {
      const [items] = await pool.execute(query);

      return items;
    } catch (error) {
      console.error("Error retrieving item:", error);
      throw new Error("Failed to get item by ID");
    }
  },

  async getItemsById(id) {
    const query = `
      SELECT id, name, description, price, createdAt, updatedAt
      FROM items
      WHERE id = ?;
    `;

    try {
      const [items] = await pool.execute(query, [id]);

      // Check if the item exists
      if (items.length === 0) {
        return null;
      }

      // Return the found item
      return items[0];
    } catch (error) {
      console.error("Error retrieving item:", error);
      throw new Error("Failed to get item by ID");
    }
  },

  async getItemByName(name) {
    const query = `SELECT * FROM items WHERE name = ? LIMIT 1`;
    const [rows] = await pool.execute(query, [name]);
    return rows[0];
  },

  async createItems(data) {
    const query = `
      INSERT INTO items (name, description, price, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?);
    `;

    const values = [
      data.name,
      data.description || null, // Handle optional description
      data.price,
      data.createdAt,
      data.updatedAt,
    ];

    try {
      // Execute the INSERT query
      const [result] = await pool.execute(query, values);

      // Return the created item with the auto-generated ID
      return {
        id: result.insertId, // MySQL automatically generates the `id`
        name: data.name,
        description: data.description,
        price: data.price,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    } catch (error) {
      console.error("Error creating item:", error); // Log the error for debugging
      throw new Error("Failed to create item");
    }
  },

  async updateItem(id, data) {
    const query = `
      UPDATE items
      SET name = ?, description = ?, price = ?, updatedAt = ?
      WHERE id = ?;
    `;

    const values = [
      data.name,
      data.description || null, // Handle optional description
      data.price,
      data.updatedAt,
      id, // The item ID for the WHERE clause
    ];

    try {
      // Execute the update query
      const [result] = await pool.execute(query, values);

      // If no rows were affected, the item might not exist (which we already checked in the controller)
      if (result.affectedRows === 0) {
        throw new Error(`No item found with ID: ${id}`);
      }

      // Return the updated item
      return {
        id,
        name: data.name,
        description: data.description,
        price: data.price,
        updatedAt: data.updatedAt,
      };
    } catch (error) {
      console.error("Error updating item:", error); // Log error for debugging
      throw new Error("Failed to update item");
    }
  },

  async deleteItemById(id) {
    const query = "DELETE FROM items WHERE id = ?";

    try {
      const [result] = await pool.query(query, [id]);

      return result;
    } catch (error) {
      console.error("Error deleting item:", error);
      throw new Error("Failed to delete item");
    }
  },
};
