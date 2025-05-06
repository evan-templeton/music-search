// Musical note definitions and mappings
export const notes = [
    { name: 'C', key: 'A' },
    { name: 'C#', key: 'W' },
    { name: 'D', key: 'S' },
    { name: 'D#', key: 'E' },
    { name: 'E', key: 'D' },
    { name: 'F', key: 'F' },
    { name: 'F#', key: 'T' },
    { name: 'G', key: 'G' },
    { name: 'G#', key: 'Y' },
    { name: 'A', key: 'H' },
    { name: 'A#', key: 'U' },
    { name: 'B', key: 'J' },
    { name: 'C2', key: 'K' },
    { name: 'C#2', key: 'O' },
    { name: 'D2', key: 'L' },
    { name: 'D#2', key: 'P' },
    { name: 'E2', key: ';' },
    { name: 'F2', key: "'" },
    { name: 'F#2', key: ']' }
];

export const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2', 'D2', 'E2', 'F2'];
export const blackNotes = ['C#', 'D#', 'F#', 'G#', 'A#', 'C#2', 'D#2', 'F#2'];

// Key mappings
export const keyToNote = Object.fromEntries(notes.map(n => [n.key, n.name]));
export const noteToKey = Object.fromEntries(notes.map(n => [n.name, n.key]));

// Piano key dimensions
export const whiteKeyWidth = 40;
export const whiteKeyHeight = 180;

export const blackKeyWidth = 28;
export const blackKeyHeight = 110;

// Black key positions
export const blackKeyMap = {
    'C#': 1,
    'D#': 2,
    'F#': 4,
    'G#': 5,
    'A#': 6,
    'C#2': 8,
    'D#2': 9,
    'F#2': 11
};

// Staff note positions
export const staffNoteY = {
    'C': 110,   // C4 (ledger line below, further down)
    'C#': 110,
    'D': 102,    // space below
    'D#': 102,
    'E': 94,    // bottom line
    'F': 86,    // bottom space
    'F#': 86,
    'G': 78,    // 2nd line
    'G#': 78,
    'A': 70,    // 2nd space
    'A#': 70,
    'B': 62,    // 3rd line
    'C2': 54,   // 3rd space (C5)
    'C#2': 54,
    'D2': 46,   // 4th line
    'D#2': 46,
    'E2': 38,   // 4th space
    'F2': 30,    // 5th line (top)
    'F#2': 30
}; 