import { keyToNote, noteToKey } from './model.js';

export class PianoViewModel {
  constructor() {
    this.staffNotes = [];
    this.pressedKeys = new Set();
    this.searchTimeout = null;
  }

  addNote(note) {
    this.staffNotes.push(note);
    this.triggerSearch();
  }

  removeLastNote() {
    this.staffNotes.pop();
    this.triggerSearch();
  }

  getNotes() {
    return this.staffNotes;
  }

  handleKeyDown(key) {
    if (key === 'BACKSPACE') {
      this.removeLastNote();
      return true;
    }

    const note = keyToNote[key];
    if (note && !this.pressedKeys.has(key)) {
      this.pressedKeys.add(key);
      this.addNote(note);
      return true;
    }
    return false;
  }

  handleKeyUp(key) {
    if (keyToNote[key]) {
      this.pressedKeys.delete(key);
      return true;
    }
    return false;
  }

  triggerSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 1000);
  }

  performSearch() {
    if (this.staffNotes.length < 3) {
      console.log('Need at least 3 notes to search');
      return;
    }
    
    // TODO: Implement actual search service
    console.log('Searching for notes:', this.staffNotes);
  }
} 