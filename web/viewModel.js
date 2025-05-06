import { keyToNote, noteToKey } from './model.js';
import { SearchService } from './searchService.js';

export class PianoViewModel {
  #staffNotes = [];
  #pressedKeys = new Set();
  #searchTimeout = null;
  #searchService = new SearchService();
  #searchResults = null;
  #onSearchResultsUpdate = null;
  #isSearching = false;

  constructor() {
    // No initialization needed as private fields are initialized above
  }

  // Public getters
  getNotes() {
    return this.#staffNotes;
  }

  getSearchResults() {
    return this.#searchResults;
  }

  get pressedKeys() {
    return this.#pressedKeys;
  }

  get isSearching() {
    return this.#isSearching;
  }

  // Public methods
  setOnSearchResultsUpdate(callback) {
    this.#onSearchResultsUpdate = callback;
  }

  handleKeyDown(key) {
    if (key === 'BACKSPACE') {
      console.log('Backspace detected, removing last note');
      this.#removeLastNote();
      return true;
    }

    const note = keyToNote[key];
    if (note && !this.#pressedKeys.has(key)) {
      this.#pressedKeys.add(key);
      this.#addNote(note);
      return true;
    }
    return false;
  }

  handleKeyUp(key) {
    if (keyToNote[key]) {
      this.#pressedKeys.delete(key);
      return true;
    }
    return false;
  }

  // Private methods
  #addNote(note) {
    this.#staffNotes.push(note);
    this.#triggerSearch();
  }

  #removeLastNote() {
    this.#staffNotes.pop();
    this.#triggerSearch();
  }

  #triggerSearch() {
    if (this.#searchTimeout) {
      clearTimeout(this.#searchTimeout);
    }
    
    this.#searchTimeout = setTimeout(async () => {
      await this.#performSearch();
    }, 1000);
  }

  async #performSearch() {
    if (this.#staffNotes.length < 3) {
      console.log('Need at least 3 notes to search');
      this.#searchResults = null;
      this.#isSearching = false;
      this.#notifySearchResultsUpdate();
      return;
    }
    
    try {
      this.#isSearching = true;
      this.#notifySearchResultsUpdate();
      this.#searchResults = await this.#searchService.search(this.#staffNotes);
      console.log('Search results:', this.#searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      this.#searchResults = null;
    } finally {
      this.#isSearching = false;
      this.#notifySearchResultsUpdate();
    }
  }

  #notifySearchResultsUpdate() {
    if (this.#onSearchResultsUpdate) {
      this.#onSearchResultsUpdate(this.#searchResults);
    }
  }
} 