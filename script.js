let editingIndex = null;

function saveNote() {
  const input = document.getElementById('noteInput').value.trim();
  if (!input) return;

  const notes = JSON.parse(localStorage.getItem('notes') || '[]');

  if (editingIndex !== null) {
    // Edit existing note
    notes[editingIndex] = parseInput(input);
    editingIndex = null;
  } else {
    // Add new note
    notes.push(parseInput(input));
  }

  localStorage.setItem('notes', JSON.stringify(notes));
  document.getElementById('noteInput').value = '';
  renderNotes();
}

function parseInput(input) {
  if (input.includes('\n')) {
    const checklist = input.split('\n').map(line => ({ text: line, done: false }));
    return { type: 'checklist', items: checklist };
  } else {
    return { type: 'text', content: input };
  }
}

function renderNotes() {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const list = document.getElementById('notesList');
  list.innerHTML = '';

  notes.forEach((note, idx) => {
    const li = document.createElement('li');

    const noteWrapper = document.createElement('div');
    noteWrapper.className = 'note';

    if (note.type === 'text') {
      noteWrapper.textContent = note.content;
    } else if (note.type === 'checklist') {
      note.items.forEach((item, i) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.done;
        checkbox.onchange = () => {
          note.items[i].done = checkbox.checked;
          localStorage.setItem('notes', JSON.stringify(notes));
        };
        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(item.text));
        noteWrapper.appendChild(label);
        noteWrapper.appendChild(document.createElement('br'));
      });
    }

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.onclick = () => editNote(idx);

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => deleteNote(idx);

    li.appendChild(noteWrapper);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function editNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const note = notes[index];

  if (note.type === 'text') {
    document.getElementById('noteInput').value = note.content;
  } else if (note.type === 'checklist') {
    document.getElementById('noteInput').value = note.items.map(i => i.text).join('\n');
  }

  editingIndex = index;
}

function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();
}

function clearNotes() {
  if (confirm('Clear all notes?')) {
    localStorage.removeItem('notes');
    renderNotes();
  }
}

renderNotes();
