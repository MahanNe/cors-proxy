const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors()); // Enable CORS for all routes

app.get('/api/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        console.error('Error proxying request:', error.message);
        res.status(500).send('Error proxying request');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
