const express = require('express');
const sequelize = require('./database');
const movieRoutes = require('./routes/movieRoutes');
const characterRoutes = require('./routes/characterRoutes');

const app = express();
const PORT = 3000;

// Midlleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(movieRoutes);
app.use(characterRoutes);

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });