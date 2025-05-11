const express = require("express")
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    editExpense,
    downloadExpenseExcel
} = require("../controllers/expenseController")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", protect,(req, res) => {
    res.send("Income route is working");
  });
  



router.post("/add", protect, addExpense)

router.get("/get", protect, getAllExpense)

router.put("/edit/:id", protect, editExpense)

router.get("/downloadexcel", protect, downloadExpenseExcel)

router.delete("/:id", protect, deleteExpense)


module.exports = router