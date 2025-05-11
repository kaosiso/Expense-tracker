
const xlsx = require('xlsx')
const Expense = require("../models/Expense")

const path = require('path');
const fs = require('fs');


//Add Expense category
exports.addExpense = async (req, res) => {
    const userId = req.user?.id || req.user?._id; // Ensure compatibility with how your user is stored

    try {
        const { icon, category, amount, date } = req.body;

        // Validation
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();

        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// Add Expense 
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


//Delete Expense 
exports.deleteExpense = async (req, res) => {

    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense deleted successfully "})
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
    
}


//update Expense 
exports.editExpense = async (req, res) => {
    const userId = req.user.id;
    const expenseId = req.params.id;

    try {
        const expense = await Expense.findOne({ _id: expenseId, userId });

        if (!expense) {
            return res.status(404).json({ message: "expense not found or unauthorized" });
        }

        // edit the expense with data from the request
        expense.category = req.body.category || expense.category;
        expense.amount = req.body.amount || expense.amount;
        expense.date = req.body.date || expense.date;

        await expense.save();

        res.json({ message: "Expense edited Successfully", data: expense });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};





exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date.toISOString().split('T')[0],
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Expense');

        // Ensure the 'exports' directory exists
        const exportDir = path.join(__dirname, '../exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        // Save Excel file
        const filePath = path.join(exportDir, 'Expense_details.xlsx');
        xlsx.writeFile(wb, filePath);

        // Send file for download
        res.download(filePath, 'Expense_details.xlsx', (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).send('Could not download file.');
            }
        });
      
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
