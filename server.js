const express = require('express');
const morgan = require('morgan');
const sequelize = require('./backend/config/db');
const userRoutes = require("./backend/routes/user.routes");
const farmRoutes = require("./backend/routes/farm.routes");
const productRoutes = require("./backend/routes/product.routes");
const chatRoutes = require("./backend/routes/chat.routes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/users", userRoutes);
app.use("/farms", farmRoutes);
app.use("/products", productRoutes);
app.use("/chats", chatRoutes);

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
app.listen(PORT, async () => {
    await initializeDatabase();
    console.log(`Server is running on http://localhost:${PORT}`);
});