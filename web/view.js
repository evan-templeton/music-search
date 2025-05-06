import { whiteNotes, blackNotes, noteToKey, keyToNote, whiteKeyWidth, blackKeyWidth, whiteKeyHeight, blackKeyMap, staffNoteY } from './model.js';

export class PianoView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.staffSVG = document.getElementById('staff');
    this.pianoKeys = document.getElementById('piano-keys');
    this.debugDisplay = document.getElementById('debug-display');
    this.loadingElement = document.getElementById('loading');
    this.errorElement = document.getElementById('error');
    this.resultsElement = document.getElementById('results');
    
    this.#initializePiano();
    this.#drawStaff();
    this.#setupEventListeners();
    this.#setupSearchResultsListener();
  }

  #initializePiano() {
    // Calculate total width based on number of white keys
    const totalWidth = whiteNotes.length * whiteKeyWidth;
    this.pianoKeys.style.width = `${totalWidth}px`;
    this.pianoKeys.style.height = `${whiteKeyHeight}px`;

    // Draw white keys
    whiteNotes.forEach((note, i) => {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'white-key';
      keyDiv.style.position = 'absolute';
      keyDiv.style.left = `${i * whiteKeyWidth}px`;
      keyDiv.style.top = '0px';
      keyDiv.dataset.note = note;
      keyDiv.innerHTML = `<span class="key-label">${noteToKey[note]}</span>`;
      this.pianoKeys.appendChild(keyDiv);
    });

    // Draw black keys
    blackNotes.forEach(note => {
      const i = blackKeyMap[note];
      const blackDiv = document.createElement('div');
      blackDiv.className = 'black-key';
      blackDiv.style.position = 'absolute';
      blackDiv.style.left = `${i * whiteKeyWidth - blackKeyWidth/2}px`;
      blackDiv.style.top = '0px';
      blackDiv.dataset.note = note;
      blackDiv.innerHTML = `<span class="key-label" style="color:#fff;">${noteToKey[note]}</span>`;
      this.pianoKeys.appendChild(blackDiv);
    });
  }

  #setupEventListeners() {
    document.addEventListener('keydown', e => {
      const key = e.key.toUpperCase();
      if (this.viewModel.handleKeyDown(key)) {
        this.updateView();
      }
    });

    document.addEventListener('keyup', e => {
      const key = e.key.toUpperCase();
      if (this.viewModel.handleKeyUp(key)) {
        this.updateView();
      }
    });
  }

  #drawStaff() {
    this.staffSVG.innerHTML = '';
    // Draw the treble clef
    this.staffSVG.innerHTML = `
      <text x="20" y="105" font-size="140" font-family="serif">&#x1D11E;</text>
    `;
    // Draw the staff lines
    for (let i = 0; i < 5; i++) {
      this.staffSVG.innerHTML += `<line x1="20" y1="${30+i*16}" x2="540" y2="${30+i*16}" stroke="#222" stroke-width="2"/>`;
    }
  }

  #drawNotes() {
    this.#drawStaff();
    const notes = this.viewModel.getNotes();
    
    notes.forEach((note, i) => {
      const x = 90 + i*40;
      const y = staffNoteY[note];
      
      // Draw sharp if note is a sharp
      if (note.includes('#')) {
        this.staffSVG.innerHTML += `<text x="${x-22}" y="${y+5}" font-size="22" font-family="serif">&#x266F;</text>`;
      }
      
      this.staffSVG.innerHTML += `<ellipse cx="${x}" cy="${y}" rx="12" ry="8" fill="#222"/>`;
      
      // Ledger line for C and C#
      if (note === 'C' || note === 'C#') {
        this.staffSVG.innerHTML += `<line x1="${x-14}" y1="${y}" x2="${x+14}" y2="${y}" stroke="#222" stroke-width="2"/>`;
      }
    });
  }

  #updateDebugDisplay() {
    const notes = this.viewModel.getNotes();
    this.debugDisplay.textContent = `Notes: [${notes.join(', ')}]`;
  }

  #updateKeys() {
    // Remove pressed class from all keys first
    Array.from(this.pianoKeys.querySelectorAll('div')).forEach(div => {
      div.classList.remove('pressed');
    });

    // Add pressed class to currently pressed keys
    this.viewModel.pressedKeys.forEach(key => {
      const note = keyToNote[key];
      if (note) {
        const keyDiv = Array.from(this.pianoKeys.querySelectorAll('div')).find(div => div.dataset.note === note);
        if (keyDiv) {
          keyDiv.classList.add('pressed');
        }
      }
    });
  }

  #setupSearchResultsListener() {
    this.viewModel.setOnSearchResultsUpdate((results) => {
      if (this.viewModel.isSearching) {
        this.loadingElement.classList.remove('hidden');
        this.errorElement.classList.add('hidden');
        this.resultsElement.innerHTML = '';
      } else {
        this.loadingElement.classList.add('hidden');
        this.#updateSearchResults(results);
      }
    });
  }

  #updateSearchResults(results) {
    if (!results) {
      return;
    }

    // Display results
    if (results.matches && results.matches.length > 0) {
      const resultsHTML = results.matches.map(match => `
        <div class="result-item">
          <div class="result-title">${match.title}</div>
          <div class="result-artist">${match.artist}</div>
          <div class="result-score">Match: ${Math.round(match.matchScore * 100)}%</div>
        </div>
      `).join('');
      
      this.resultsElement.innerHTML = resultsHTML;
    } else {
      this.resultsElement.innerHTML = '<div class="result-item">No matches found</div>';
    }
  }

  // Public methods
  updateView() {
    this.#drawNotes();
    this.#updateDebugDisplay();
    this.#updateKeys();
  }

  showError(message) {
    this.loadingElement.classList.add('hidden');
    this.errorElement.textContent = message;
    this.errorElement.classList.remove('hidden');
  }
} 