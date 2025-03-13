// Array para almacenar las flashcards y medallas
let flashcards = [];
let medals = [];

// Elementos del DOM
const flashcardsContainer = document.getElementById('flashcardsContainer');
const addFlashcardBtn = document.getElementById('addFlashcardBtn');
const viewAllFlashcardsBtn = document.getElementById('viewAllFlashcardsBtn');
const restartStudyBtn = document.getElementById('restartStudyBtn');
const flashcardModal = document.getElementById('flashcardModal');
const saveFlashcardBtn = document.getElementById('saveFlashcardBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const viewMedalsBtn = document.getElementById('viewMedalsBtn');
const medalsPage = document.getElementById('medalsPage');
const medalsContainer = document.getElementById('medalsContainer');
const backToStudyBtn = document.getElementById('backToStudyBtn');

// Variables de entrada
const englishWordInput = document.getElementById('englishWord');
const meaningInput = document.getElementById('meaning');

// Cargar flashcards y medallas desde LocalStorage
function loadFlashcards() {
    const storedFlashcards = localStorage.getItem('flashcards');
    if (storedFlashcards) {
        flashcards = JSON.parse(storedFlashcards);
    }

    const storedMedals = localStorage.getItem('medals');
    if (storedMedals) {
        medals = JSON.parse(storedMedals);
    }

    displayFlashcards();
}

// Mostrar las flashcards
function displayFlashcards() {
    flashcardsContainer.innerHTML = '';
    let flashcardsPending = 0;

    flashcards.forEach((flashcard, index) => {
        if (!flashcard.completed || !shouldReappear(flashcard)) {
            const flashcardContainer = document.createElement('div');
            flashcardContainer.classList.add('flashcard-container');

            const flashcardElement = document.createElement('div');
            flashcardElement.classList.add('flashcard');
            flashcardElement.innerHTML = `
                <div class="front">
                    <p><strong>${flashcard.word}</strong></p>
                    <button onclick="playPronunciation('${flashcard.word}')">Escuchar Pronunciación</button>
                </div>
                <div class="back">
                    <p>${flashcard.meaning}</p>
                    <button onclick="markAsCompleted(${index})">I Got It!</button>
                </div>
            `;

            flashcardContainer.appendChild(flashcardElement);
            flashcardsContainer.appendChild(flashcardContainer);

            if (!flashcard.completed || !shouldReappear(flashcard)) {
                flashcardsPending++;
            }
        }
    });

    if (flashcardsPending === 0) {
        restartStudyBtn.style.display = 'block';
    } else {
        restartStudyBtn.style.display = 'none';
    }
}

// Guardar flashcards y medallas en LocalStorage
function saveFlashcards() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    localStorage.setItem('medals', JSON.stringify(medals));
}

// Agregar una nueva flashcard
function addFlashcard() {
    flashcardModal.style.display = 'flex';
}

// Guardar la nueva flashcard
saveFlashcardBtn.addEventListener('click', function () {
    const word = englishWordInput.value;
    const meaning = meaningInput.value;

    if (word && meaning) {
        const newFlashcard = {
            word: word,
            meaning: meaning,
            completed: false,
            completedAt: null,
            clickCount: 0
        };

        flashcards.push(newFlashcard);
        englishWordInput.value = '';
        meaningInput.value = '';
        flashcardModal.style.display = 'none';
        saveFlashcards();
        displayFlashcards();
    } else {
        alert('Por favor, complete todos los campos.');
    }
});

// Ver medallas
viewMedalsBtn.addEventListener('click', function () {
    showMedalsPage();
});

// Mostrar la página de medallas
function showMedalsPage() {
    medalsPage.style.display = 'block';
    flashcardsContainer.style.display = 'none';
    restartStudyBtn.style.display = 'none';
    const medalHtml = medals.map(medal => `<span class="medal">${medal}</span>`).join('');
    medalsContainer.innerHTML = `<h3>Tus Medallas:</h3>${medalHtml}`;
}

// Marcar la flashcard como completada
function markAsCompleted(index) {
    const flashcard = flashcards[index];
    flashcard.clickCount++;

    if (flashcard.clickCount >= 10) {
        giveMedal();
    }

    flashcard.completed = true;
    saveFlashcards();
    displayFlashcards();
}

// Dar medalla con emoji único
function giveMedal() {
    const emojis = ['🏅', '🎖️', '🥇', '🏆', '🎉', '🎗️'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    if (!medals.includes(randomEmoji)) {
        medals.push(randomEmoji);
    }

    saveFlashcards();
    alert('¡Has recibido una medalla!');
}

// Verificar si debe reaparacer la flashcard después de 1 mes
function shouldReappear(flashcard) {
    if (!flashcard.completedAt) return true;

    const completedAt = new Date(flashcard.completedAt);
    const oneMonthLater = new Date(completedAt);
    oneMonthLater.setMonth(completedAt.getMonth() + 1);

    return new Date() >= oneMonthLater;
}

// Volver a la página principal
backToStudyBtn.addEventListener('click', function () {
    medalsPage.style.display = 'none';
    flashcardsContainer.style.display = 'block';
    restartStudyBtn.style.display = 'none';
});

// Cerrar el modal
closeModalBtn.addEventListener('click', function () {
    flashcardModal.style.display = 'none';
});

// Inicializar la app
loadFlashcards();
addFlashcardBtn.addEventListener('click', addFlashcard);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js').then((registration) => {
            console.log('Service Worker registrado con éxito:', registration);
        }).catch((error) => {
            console.log('Error al registrar el Service Worker:', error);
        });
    });
}
