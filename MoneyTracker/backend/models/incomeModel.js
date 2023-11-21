const mongoose = require('mongoose');
const IncomeSchema = new mongoose.Schema({
    title: {    
        type: String,
        required: true,
        trim: true,
        maxlength: 40
    },  
    amount: {
        type: Number,
        required: true,
        trim:true,
        maxlength: 15
    },
    type: { 
        type: String,
        default: 'income'   
    },
    date: { 
        type: Date,
        trim: true,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {  
        type: String,
        required: true,
        trim: true,
        maxlength:20
    },}, { timestamps: true });

module.exports = mongoose.model('Income', IncomeSchema);
