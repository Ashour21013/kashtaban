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
    return 'Geheimwort'; // Fallback
  }
}

async function startGame() {
  const playerCount = parseInt(document.getElementById('playerCount').value);
  if (isNaN(playerCount) || playerCount < 3) {
    alert('Bitte gib mindestens 3 Spieler ein.');
    return;
  }

  const word = await fetchRandomWord();
  cards = Array(playerCount).fill(word);
  const imposterIndex = Math.floor(Math.random() * playerCount);
  cards[imposterIndex] = 'Impostor';

  //Sort cards
  cards = cards.sort(() => Math.random() - 0.5);

  currentCardIndex = 0;
  isClickAble = true;

  document.getElementById('card').style.display = 'block';
  document.getElementById('card').innerText =
    'Spieler 1: Klicken um deine Karte zu sehen';
  document.getElementById('newRoundBtn').style.display = 'none';
}

function showNextCard() {
  if (!isClickAble) return;
  cardEl = document.getElementById('card');

  if (currentCardIndex >= cards.length) {
    document.getElementById('card').innerText = 'Alle Karten wurden gezeigt.';
    document.getElementById('newRoundBtn').style.display = 'inline-block';
    return;
  }

  const cardText = cards[currentCardIndex];
  cardEl.innerText = `Deine Karte: ${cardText}`;
  cardEl.style.backgroundColor =
    cardText === 'Impostor' ? '#ff4c4c' : '#4caf50'; // rot oder grün

  currentCardIndex++;
  isClickAble = false;

  setTimeout(() => {
    if (currentCardIndex < cards.length) {
      document.getElementById('card').innerText = `Spieler ${
        currentCardIndex + 1
      }: Klicken um deine Karte zu sehen`;
      isClickAble = true;
      cardEl.style.backgroundColor = '';
    } else {
      document.getElementById('card').innerText = 'Alle Karten wurden gezeigt.';
      document.getElementById('newRoundBtn').style.display = 'inline-block';
    }
  }, 2000);
}
