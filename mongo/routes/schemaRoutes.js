const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

let DynamicModel;

router.post("/schema", async (req, res) => {
  try {
    const { fields } = req.body;
    const schemaDefinition = {};

    fields.forEach((field) => {
      schemaDefinition[field.name] = mongoose.Schema.Types[field.type];
    });

    const DynamicSchema = new mongoose.Schema(schemaDefinition, {
      strict: false,
    });
    DynamicModel = mongoose.model("DynamicModel", DynamicSchema);

    res.status(201).json({ message: "Schema created successfully" });
  } catch (error) {
    console.error("Error creating schema:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create (already implemented)
router.post("/items", async (req, res) => {
  try {
    if (!DynamicModel) {
      return res.status(400).json({ error: "Schema not defined yet" });
    }
    const newItem = new DynamicModel(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Error creating item" });
  }
});

// Read (already implemented)
router.get("/items", async (req, res) => {
  try {
    if (!DynamicModel) {
      return res.status(400).json({ error: "Schema not defined yet" });
    }
    const items = await DynamicModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

// Read Single Item
router.get("/items/:id", async (req, res) => {
  try {
    if (!DynamicModel) {
      return res.status(400).json({ error: "Schema not defined yet" });
    }
    const item = await DynamicModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error fetching item" });
  }
});

// Update
router.put("/items/:id", async (req, res) => {
  try {
    if (!DynamicModel) {
      return res.status(400).json({ error: "Schema not defined yet" });
    }
    const updatedItem = await DynamicModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
});

// Delete
router.delete("/items/:id", async (req, res) => {
  try {
    if (!DynamicModel) {
      return res.status(400).json({ error: "Schema not defined yet" });
    }
    const deletedItem = await DynamicModel.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
});

module.exports = router;
