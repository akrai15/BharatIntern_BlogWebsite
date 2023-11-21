const ExpenseSchema = require('../models/expenseModel');

exports.addExpense = async(req, res) => {
    const{title,amount,category,description,date} = req.body;
    const Expense=ExpenseSchema({
        title,
        amount,
        category,
        description,
        date
    });
    try{
        //validation
        
        if(!title || !category || !description || !date){
            return res.status(400).json({msg:"Not all fields have been entered."});
        }
        if(amount<=0 || amount==='number'){
            return res.status(400).json({msg:"Amount should be a positive number."});
        }
        await Expense.save();
        res.status(200).json({msg:"Expense added successfully."});
    }
    catch(error){
        res.status(500).json({msg:'Server Error'});
    }
    console.log(Expense);
    
};
exports.getExpense= async(req, res) => {
    try{
        const Expense = await ExpenseSchema.find().sort({createdAt:-1});
        res.status(200).json(Expense);
    }
    catch(error){
        res.status(500).json({msg:'Server Error'});
    }
}
exports.deleteExpense = async(req, res) => {
    try{
       const deletedExpense = await ExpenseSchema.findByIdAndDelete(req.params.id);
         res.status(200).json(deletedExpense,{msg:"Expense deleted successfully."}); 
       
    }
    catch(error){
        res.status(500).json({msg:'Server Error'});
    }
}