const IncomeSchema = require('../models/incomeModel');

exports.addIncome = async(req, res) => {
    const{title,amount,category,description,date} = req.body;
    const income=IncomeSchema({
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
        await income.save();
        res.status(200).json({msg:"Income added successfully."});
    }
    catch(error){
        res.status(500).json({msg:'Server Error'});
    }
    console.log(income);
    
};
exports.getIncome = async(req, res) => {
    try{
        const income = await IncomeSchema.find().sort({createdAt:-1});
        res.status(200).json(income);
    }
    catch(error){
        res.status(500).json({msg:'Server Error'});
    }
}
exports.deleteIncome = async(req, res) => {
    try{
       const deletedIncome = await IncomeSchema.findByIdAndDelete(req.params.id);
         res.status(200).json(deletedIncome,{msg:"Income deleted successfully."}); 
       
    }
    catch(error){
        res.status(500).json({msg:'Server Error'});
    }
}