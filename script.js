// Получаем элементы
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const notesList = document.getElementById('notesList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalDate = document.getElementById('modalDate');
const deleteBtn = document.getElementById('deleteBtn');
const closeModal = document.querySelector('.close');
const usedSpaceElement = document.getElementById('usedSpace');
const warningElement = document.getElementById('warning');

// Переменная для хранения индекса текущей заметки
let currentNoteIndex = null;

// Максимальный объем localStorage (в КБ, примерное значение)
const MAX_STORAGE = 5000; // 5 MB

// Функция для загрузки всех заметок
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        const date = new Date(note.date).toLocaleString();
        li.innerHTML = `<strong>${note.title}</strong> <span>${date}</span>`;
        li.addEventListener('click', () => openNote(index));
        notesList.appendChild(li);
    });
    updateStorageStatus();
}

// Функция для сохранения заметки
function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title && content) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const note = {
            title: title,
            content: content,
            date: new Date().toISOString(),
        };
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        noteTitle.value = '';
        noteContent.value = '';
        loadNotes();
        alert('Заметка сохранена!');
    } else {
        alert('Пожалуйста, введите заголовок и текст заметки.');
    }
}

// Функция для открытия заметки
function openNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes'));
    const note = notes[index];
    const date = new Date(note.date).toLocaleString();
    modalTitle.textContent = note.title;
    modalDate.textContent = `Дата: ${date}`;
    modalContent.textContent = note.content;
    modal.style.display = 'block';
    currentNoteIndex = index;
}

// Функция для удаления заметки
function deleteNote() {
    const notes = JSON.parse(localStorage.getItem('notes'));
    notes.splice(currentNoteIndex, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    modal.style.display = 'none';
    loadNotes();
}

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Закрытие модального окна при клике вне области
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Функция для очистки поля ввода
function clearField() {
    noteTitle.value = '';
    noteContent.value = '';
}

// Функция для обновления состояния хранилища
function updateStorageStatus() {
    const usedBytes = new Blob(Object.values(localStorage)).size;
    const usedKB = (usedBytes / 1024).toFixed(2);
    usedSpaceElement.textContent = usedKB;

    // Если занято больше 80% хранилища, показываем предупреждение
    if (usedKB >= MAX_STORAGE * 0.8) {
        warningElement.textContent = 'Внимание! Почти все хранилище занято.';
    } else {
        warningElement.textContent = '';
    }
}

// Обработчики событий
saveBtn.addEventListener('click', saveNote);
clearBtn.addEventListener('click', clearField);
deleteBtn.addEventListener('click', deleteNote);

// Загрузка сохраненных заметок при загрузке страницы
window.addEventListener('load', loadNotes);