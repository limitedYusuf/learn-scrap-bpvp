const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = 6666;

app.use(cors());
app.use(express.json());

app.post('/scrape', async (req, res) => {
    const { url, tags } = req.body;
    
    if (!url || !tags || !tags.length) {
        return res.status(400).json({ error: 'Setidaknya harus ada URL dan 1 tag' });
    }
    
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const results = [];

        for (const tag of tags) {
            const elements = await page.evaluate((tag) => {
                const elements = document.querySelectorAll(tag);
                return Array.from(elements).map(el => el.innerText.trim());
            }, tag);

            elements.forEach((element, index) => {
                if (!results[index]) {
                    results[index] = {};
                }
                results[index][tag] = element;
            });
        }

        await browser.close();
        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Gagal, sorry my skill issues' });
    }
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});