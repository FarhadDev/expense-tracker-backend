const Expense = require('../models/Expense');
const Joi = require('joi');

const expenseSchema = Joi.object({
    title: Joi.string().min(3).required(),
    amount: Joi.number().greater(0).required(),
    category: Joi.string().allow(''),
    date: Joi.date().required(),
});

exports.addExpense = async (req, res) => {
    const { error } = expenseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const expense = new Expense({ ...req.body, user: req.user._id });
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add expense' });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};

exports.updateExpense = async (req, res) => {
    const { error } = expenseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};
