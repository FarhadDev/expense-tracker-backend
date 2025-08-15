
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./src/routes/userRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');

const app = express();
app.use(express.json());


// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


// Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
