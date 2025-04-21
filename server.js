const { Client } = require("pg");
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ansluter till databasen (PostgreSQL)
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect((err) => {
    if (err) {
        console.log("Fel vid anslutning: " + err);
    } else {
        console.log("Ansluten till databasen...");
        createTable();
    }
});

// Skapar tabellen om den inte finns
function createTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS workexperience (
            id SERIAL PRIMARY KEY,
            companyname TEXT NOT NULL,
            jobtitle TEXT NOT NULL,
            location TEXT NOT NULL,
            startdate DATE NOT NULL,
            enddate DATE NOT NULL,
            description TEXT NOT NULL
        )
    `;

    client.query(createTableQuery)
        .then(() => console.log("Tabellen 'workexperience' är redo!"))
        .catch(err => console.error("Fel vid skapande av tabell:", err));
}

// Routes
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Work Experience API' });
});

app.get('/api/workexperience', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM workexperience ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fel vid hämtning av data' });
    }
});

app.post('/api/workexperience', async (req, res) => {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    const errors = [];

    if (!companyname) {
        errors.push("Företagsnamn är obligatoriskt.");
    }
    if (!jobtitle) {
        errors.push("Jobbtitel är obligatoriskt.");
    }
    if (!location) {
        errors.push("Plats är obligatoriskt.");
    }
    if (!startdate) {
        errors.push("Startdatum är obligatoriskt.");
    }
    if (!enddate) {
        errors.push("Slutdatum är obligatoriskt.");
    }
    if (!description) {
        errors.push("Beskrivning är obligatoriskt.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            errors
        });
    }

    try {
        const result = await client.query(
            `INSERT INTO workexperience (companyname, jobtitle, location, startdate, enddate, description)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [companyname, jobtitle, location, startdate, enddate, description]
        );

        res.status(201).json({
            message: 'Arbetserfarenhet tillagd',
            newExperience: result.rows[0]
        });

    } catch (err) {
        console.error('Fel vid insert:', err);
        res.status(500).json({ error: 'Något gick fel vid sparandet i databasen' });
    }
});

app.put('/api/workexperience/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    try {
        const result = await client.query(
            `UPDATE workexperience
             SET companyname=$1, jobtitle=$2, location=$3, startdate=$4, enddate=$5, description=$6
             WHERE id=$7 RETURNING *`,
            [companyname, jobtitle, location, startdate, enddate, description, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Erfarenheten hittades inte' });
        }

        res.json({ message: 'Work experience uppdaterad', updatedExperience: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fel vid uppdatering' });
    }
});

app.delete('/api/workexperience/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await client.query('DELETE FROM workexperience WHERE id=$1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Erfarenheten hittades inte' });
        }

        res.json({ message: 'Work experience raderad', deleted: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fel vid borttagning' });
    }
});

// Startar servern
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});