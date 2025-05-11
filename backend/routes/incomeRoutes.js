const express = require("express")
const {
    addIncome,
    getAllIncome,
    deleteIncome,
    updateIncome,
    downloadIncomeExcel
} = require("../controllers/incomeController")

const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/test", protect,(req, res) => {
    res.send("Income route is working");
  });
  



router.post("/add", protect, addIncome)

router.get("/get", protect, getAllIncome)

router.put("/update/:id", protect, updateIncome)

router.get("/downloadexcel", protect, downloadIncomeExcel)

router.delete("/:id", protect, deleteIncome)


module.exports = router