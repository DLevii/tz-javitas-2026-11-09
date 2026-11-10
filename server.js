
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "raktar",
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("A JSON szerver működik!");
});

// 1. Összes termék ár szerint növekvő sorrendben
app.get("/termekek", async (req, res) => {
    try {
        const [eredmeny] = await pool.query(`
            SELECT
                termekek.id,
                termekek.nev,
                termekek.ar,
                termekek.keszlet,
                termekek.elerheto,
                kategoriak.nev AS kategoria_nev
            FROM termekek
            INNER JOIN kategoriak
                ON termekek.kategoria_id = kategoriak.id
            ORDER BY termekek.ar ASC
        `);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

// 2. Elérhető termékek
app.get("/termekek/elerheto", async (req, res) => {
    try {
        const [eredmeny] = await pool.query(`
            SELECT *
            FROM termekek
            WHERE elerheto = 1 AND keszlet > 0
        `);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

// 3. Termék keresése név alapján
app.get("/termekek/kereses/:szoveg", async (req, res) => {
    try {
        const szoveg = req.params.szoveg;

        const [eredmeny] = await pool.query(`
            SELECT *
            FROM termekek
            WHERE nev LIKE CONCAT('%', ?, '%')
        `, [szoveg]);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

// 4. Kategóriák statisztikája
app.get("/kategoriak/statisztika", async (req, res) => {
    try {
        const [eredmeny] = await pool.query(`
            SELECT
                kategoriak.nev AS kategoria_nev,
                COUNT(termekek.id) AS termekek_szama,
                ROUND(AVG(termekek.ar), 1) AS atlagos_ar
            FROM kategoriak
            INNER JOIN termekek
                ON kategoriak.id = termekek.kategoria_id
            GROUP BY kategoriak.id, kategoriak.nev
        `);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

// 5. Drága termékek (10 000 Ft felett)
app.get("/termekek/dragak", async (req, res) => {
    try {
        const [eredmeny] = await pool.query(`
            SELECT
                nev,
                ar,
                keszlet
            FROM termekek
            WHERE ar > 10000
            ORDER BY keszlet DESC
        `);

        res.json(eredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`A szerver fut: http://localhost:${PORT}`);
});

app.listen(PORT, () => {
    console.log(`1-es feladat: http://localhost:${PORT}/termekek`);
});

app.listen(PORT, () => {
    console.log(`2-es feladat: http://localhost:${PORT}/termekek/elerheto`);
});

app.listen(PORT, () => {
    console.log(`3-as feladat: http://localhost:${PORT}/termekek/kereses/:szoveg`);
});

app.listen(PORT, () => {
    console.log(`4-es feladat: http://localhost:${PORT}/termekek/statisztika`);
});

app.listen(PORT, () => {
    console.log(`5-ös feladat: http://localhost:${PORT}/termekek/dragak`);
});