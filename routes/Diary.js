const express = require("express");
const {
  getAllDiary,
  addDiary,
  getOneDiary,
  updateDiary,
  deleteDiary,
} = require("../controllers/Diary");

const router = express.Router();

router.route("/").get(getAllDiary).post(addDiary);
router.route("/:id").get(getOneDiary).patch(updateDiary).delete(deleteDiary);

module.exports = router;
