import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// API endpoints
app.get('/api/search', (req, res) => {
    try {
        const notes = req.query.notes.split(',');
        const results = db.searchSongs(notes);
        res.json({ matches: results });
    } catch (error) {
        console.error('Search failed:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.get('/api/songs', (req, res) => {
    try {
        const songs = db.getAllSongs();
        res.json(songs);
    } catch (error) {
        console.error('Failed to get songs:', error);
        res.status(500).json({ error: 'Failed to get songs' });
    }
});

app.post('/api/songs', (req, res) => {
    try {
        const { title, artist, notes } = req.body;
        const result = db.addSong(title, artist, notes);
        res.json(result);
    } catch (error) {
        console.error('Failed to add song:', error);
        res.status(500).json({ error: 'Failed to add song' });
    }
});

app.delete('/api/songs/:id', (req, res) => {
    try {
        const { id } = req.params;
        const result = db.deleteSong(id);
        res.json(result);
    } catch (error) {
        console.error('Failed to delete song:', error);
        res.status(500).json({ error: 'Failed to delete song' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 