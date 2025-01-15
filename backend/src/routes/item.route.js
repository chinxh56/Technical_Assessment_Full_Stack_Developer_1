import express from "express";
import {
  getAllItemsController,
  getItemController,
  createItemController,
  deleteItemController,
  editItemController,
} from "../controllers/item.ctrl.js";

const router = express.Router();

//Get All
router.get("/api/all", getAllItemsController);
//Get By Id
router.get("/api/:id", getItemController);

//Create
router.post("/api/create", createItemController);

//Edit
router.put("/api/edit/:id", editItemController);

//Delete
router.delete("/api/delete/:id", deleteItemController);

export default router;
