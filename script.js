function saveNote() {
  const input = document.getElementById('noteInput').value.trim();
  if (!input) return;

  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  if (input.includes('\n')) {
    const checklist = input.split('\n').map(line => ({ text: line, done: false }));
    notes.push({ type: 'checklist', items: checklist });
  } else {
    notes.push({ type: 'text', content: input });
  }

  localStorage.setItem('notes', JSON.stringify(notes));
  document.getElementById('noteInput').value = '';
  renderNotes();
}

function renderNotes() {
  const notes = JSON.parse(localStorage.getItem('notes') || '[]');
  const list = document.getElementById('notesList');
  list.innerHTML = '';

  notes.forEach((note, idx) => {
    const li = document.createElement('li');
    if (note.type === 'text') {
      li.textContent = note.content;
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
        li.appendChild(label);
        li.appendChild(document.createElement('br'));
      });
    }
    list.appendChild(li);
  });
}

function clearNotes() {
  if (confirm('Clear all notes?')) {
    localStorage.removeItem('notes');
    renderNotes();
  }
}

renderNotes();
