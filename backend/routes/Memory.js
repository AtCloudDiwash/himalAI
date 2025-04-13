const express = require("express");
const router = express.Router();
const { verify } = require("../auth.js");
const {
  createMemory,
  getAllMemories,
  getMemoryById,
  updateMemory,
  deleteMemory,
} = require("../controllers/Memory.js");


router.post("/", verify, createMemory);
router.get("/", verify, getAllMemories);
router.get("/:id", verify, getMemoryById);
router.put("/:id", verify, updateMemory);
router.delete("/:id", verify, deleteMemory);

module.exports = router;