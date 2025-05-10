//Nav Logik
document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Aktive Klasse aktualisieren
    document
      .querySelectorAll('.nav-link')
      .forEach((l) => l.classList.remove('active'));
    this.classList.add('active');

    const selectedGame = this.getAttribute('data-game');

    // Alle Spielcontainer verstecken
    document.querySelectorAll('.game-container').forEach((div) => {
      div.classList.add('d-none');
    });

    // Gewähltes Spiel anzeigen
    const target = document.getElementById('game-' + selectedGame);
    if (target) {
      target.classList.remove('d-none');
    }
  });
});

//Imposter Game
let cards = [];
let currentCardIndex = 0;
let isClickAble = true;

async function fetchRandomWord() {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word');
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Fehler beim Abrufen des Wortes:', error);
    return 'Geheimwort';
  }
}

async function startGame() {
  const playerCount = parseInt(document.getElementById('playerCount').value);
  if (isNaN(playerCount) || playerCount < 3) {
    alert('Bitte gib mindestens 3 Spieler ein.');
    return;
  }

  // Es gibt (playerCount) normale Karten und zusätzlich eine Impostor-Karte
  cards = [];
  const word = await fetchRandomWord();
  for (let i = 0; i < playerCount; i++) {
    cards.push(word);
  }

  // Impostor hinzufügen
  cards.push('Impostor');

  // Karten mischen
  cards = cards.sort(() => Math.random() - 0.5);

  currentCardIndex = 0;
  isClickAble = true;

  document.getElementById('card').style.display = 'block';
  document.getElementById('card').innerText =
    'Spieler 1: Klicken um deine Karte zu sehen';
  document.getElementById('card').style.backgroundColor = '';
  document.getElementById('newRoundBtn').style.display = 'none';

  document.getElementById('counter').classList.add('d-none');
}

function showNextCard() {
  if (!isClickAble) return;
  const cardEl = document.getElementById('card');

  if (currentCardIndex >= cards.length) {
    cardEl.innerText = 'Alle Karten wurden gezeigt.';
    document.getElementById('newRoundBtn').style.display = 'inline-block';
    return;
  }

  const cardText = cards[currentCardIndex];
  cardEl.innerText = `Deine Karte: ${cardText}`;
  cardEl.style.backgroundColor =
    cardText === 'Impostor' ? '#ff4c4c' : '#4caf50';

  currentCardIndex++;
  isClickAble = false;

  setTimeout(() => {
    if (currentCardIndex < cards.length) {
      cardEl.innerText = `Spieler ${
        currentCardIndex + 1
      }: Klicken um deine Karte zu sehen`;
      cardEl.style.backgroundColor = '';
      isClickAble = true;
    } else {
      cardEl.innerText = 'Alle Karten wurden gezeigt.';
      document.getElementById('newRoundBtn').style.display = 'inline-block';
    }
  }, 2000);
}

//Chooser Game
const touchArea = document.getElementById('touch-area');
const resultBox = document.getElementById('chooser-result');
let touchPoints = [];

touchArea.addEventListener('touchstart', (e) => {
  e.preventDefault();
  touchPoints = [];

  // Alle Touchpunkte anzeigen
  Array.from(e.touches).forEach((touch) => {
    const rect = touchArea.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const point = document.createElement('div');
    point.classList.add('touch-point');
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;
    touchArea.appendChild(point);
    touchPoints.push(point);
  });

  // Warten und dann einen zufällig auswählen
  if (e.touches.length >= 2) {
    setTimeout(() => {
      const winnerIndex = Math.floor(Math.random() * touchPoints.length);
      touchPoints.forEach((point, i) => {
        if (i === winnerIndex) {
          point.classList.add('winner');
          resultBox.innerText = '🎉 Gewinner!';
        } else {
          point.style.opacity = 0.3;
        }
      });
    }, 1500);
  }
});

touchArea.addEventListener('touchend', () => {
  // Wenn keine Finger mehr da sind, dann aufräumen
  if (event.touches.length === 0) {
    setTimeout(() => {
      touchPoints.forEach((p) => p.remove());
      touchPoints = [];
      resultBox.innerText = '';
    }, 1000);
  }
});
