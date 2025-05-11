
const xlsx = require('xlsx')
const Income = require("../models/Income")

const path = require('path');
const fs = require('fs');


//Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user?.id || req.user?._id; // Ensure compatibility with how your user is stored

    try {
        const { icon, source, amount, date } = req.body;

        // Validation
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();

        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// Add Income Source
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


//Delete Income Source
exports.deleteIncome = async (req, res) => {

    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message: "Income deleted successfully "})
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
    
}


//update Income Source
// exports.updateIncome = async (req, res) => {
//     const userId = req.user.id;

//     try {
//         const updatedIncome = await Income.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         res.json({ message: "Income Updated Successfully", data: updatedIncome });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error" });
//     }
// };
exports.updateIncome = async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;

    try {
        const income = await Income.findOne({ _id: incomeId, userId });

        if (!income) {
            return res.status(404).json({ message: "Income not found or unauthorized" });
        }

        // Update the income with data from the request
        income.source = req.body.source || income.source;
        income.amount = req.body.amount || income.amount;
        income.date = req.body.date || income.date;

        await income.save();

        res.json({ message: "Income Updated Successfully", data: income });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};





exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date.toISOString().split('T')[0],
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Income');

        // Ensure the 'exports' directory exists
        const exportDir = path.join(__dirname, '../exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        // Save Excel file
        const filePath = path.join(exportDir, 'income_details.xlsx');
        xlsx.writeFile(wb, filePath);

        // Send file for download
        res.download(filePath, 'income_details.xlsx', (err) => {
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
