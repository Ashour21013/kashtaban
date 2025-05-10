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


