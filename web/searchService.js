export class SearchService {
    constructor() {
        this.searchHistory = [];
    }

    async search(notes) {
        try {
            const response = await fetch(`/api/search?notes=${notes.join(',')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();

            // Add to search history
            this.searchHistory.push({
                timestamp: new Date(),
                notes: [...notes],
                results: data.matches
            });

            return {
                matches: data.matches.map(match => ({
                    title: match.title,
                    artist: match.artist,
                    matchScore: match.matchScore,
                    matchedNotes: match.notes
                }))
            };
        } catch (error) {
            console.error('Search failed:', error);
            throw error;
        }
    }

    getSearchHistory() {
        return this.searchHistory;
    }

    clearSearchHistory() {
        this.searchHistory = [];
    }
} 