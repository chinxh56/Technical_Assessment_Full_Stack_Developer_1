import { itemQueries } from "./queries/itemQueries.js";

export const getAllItemsController = async (req, res, next) => {
  try {
    const items = await itemQueries.getItems();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

export const getItemController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const notifications = await itemQueries.getItemsById(id);

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

export const createItemController = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        message: "Price must be positive numbers.",
      });
    }

    const existingItem = await itemQueries.getItemByName(name);
    if (existingItem) {
      return res.status(400).json({
        message: "Item with this name already exists, please change a name.",
      });
    }

    const created_at = new Date();
    const updated_at = created_at;

    const data = {
      name,
      description,
      price,
      createdAt: created_at,
      updatedAt: updated_at,
    };

    const result = await itemQueries.createItems(data);

    res.status(201).json({
      message: `Item added with ID: ${result.id}`,
      data: result,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      message: "There is a hiccup during create item.",
    });
  }
};

export const editItemController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    if (!name || !price || price <= 0) {
      return res.status(400).json({
        message:
          "Invalid data: name and price are required, and price must be positive.",
      });
    }

    const existingItem = await itemQueries.getItemsById(id);
    if (!existingItem) {
      return res.status(404).json({
        message: `Item with ID ${id} not found.`,
      });
    }

    const updated_at = new Date();

    const data = {
      name,
      description,
      price,
      updatedAt: updated_at,
    };

    const result = await itemQueries.updateItem(id, data);

    res.status(200).json({
      message: `Item with ID ${id} updated successfully.`,
      data: result,
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      message: "There is a hiccup during update item.",
    });
  }
};

export const deleteItemController = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await itemQueries.deleteItemById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: `Item with ID: ${id} has been deleted` });
  } catch (error) {
    next(error);
    return res.status(500).json({
      message: "There is a hiccup during delete item.",
    });
  }
};
