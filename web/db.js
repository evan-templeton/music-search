import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DatabaseService {
    constructor() {
        this.db = new Database(join(__dirname, 'songs.db'));
        this.#initializeDatabase();
    }

    #initializeDatabase() {
        // Create songs table if it doesn't exist
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        notes TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }

    addSong(title, artist, notes) {
        const stmt = this.db.prepare(`
      INSERT INTO songs (title, artist, notes)
      VALUES (?, ?, ?)
    `);

        return stmt.run(title, artist, JSON.stringify(notes));
    }

    searchSongs(notes) {
        const stmt = this.db.prepare(`
      SELECT id, title, artist, notes
      FROM songs
      WHERE notes LIKE ?
      ORDER BY created_at DESC
      LIMIT 10
    `);

        // Convert notes array to a pattern that matches the sequence
        const notePattern = `%${notes.join(',')}%`;
        const results = stmt.all(notePattern);

        return results.map(song => ({
            ...song,
            notes: JSON.parse(song.notes),
            matchScore: this.#calculateMatchScore(notes, JSON.parse(song.notes))
        }));
    }

    #calculateMatchScore(searchNotes, songNotes) {
        // Simple matching algorithm - can be improved
        let matches = 0;
        for (let i = 0; i < searchNotes.length; i++) {
            if (songNotes.includes(searchNotes[i])) {
                matches++;
            }
        }
        return matches / searchNotes.length;
    }

    getAllSongs() {
        const stmt = this.db.prepare(`
      SELECT id, title, artist, notes, created_at
      FROM songs
      ORDER BY created_at DESC
    `);

        return stmt.all().map(song => ({
            ...song,
            notes: JSON.parse(song.notes)
        }));
    }

    deleteSong(id) {
        const stmt = this.db.prepare('DELETE FROM songs WHERE id = ?');
        return stmt.run(id);
    }
}

export const db = new DatabaseService(); 