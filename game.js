// Arreglo de colores para el juego Simon
var simonColors = ['red', 'blue', 'green', 'yellow'];
// Variables de estado del juego
var sequence = [];
var playerSequence = [];
var level = 1;
var score = 0;
var isStrictMode = false;
var isGameRunning = false;
var startTime;
var penaltyTime = 10;
var playerName = "";
// Elementos del DOM
var btnStart = document.getElementById('btn-start');
var simonButtons = document.querySelectorAll('.simon-button');
var scoreDisplay = document.getElementById('score');
var levelDisplay = document.getElementById('level');
var modal = document.getElementById('modal');
var finalScoreDisplay = document.getElementById('final-score');
var btnRestart = document.getElementById('btn-restart');
var timerDisplay = document.createElement('div');
var scoreDisplayElement = document.createElement('div');
var timerScoreContainer = document.createElement('div');
var btnSortDate = document.getElementById('btn-sort-date');
var btnSortScore = document.getElementById('btn-sort-score');
var rankingList = document.getElementById('ranking-list');
// Configuración y estilos de temporizador y puntaje
timerScoreContainer.classList.add('timer-score-container');
timerDisplay.textContent = 'Tiempo: 0s';
scoreDisplayElement.textContent = 'Puntaje: 0';
// Agregar elementos al contenedor del juego
var FLASH_DURATION = 100;
var DELAY_BETWEEN_FLASHES = 100;
var BUTTON_SIZE_SCALE = 1.1;
timerScoreContainer.appendChild(timerDisplay);
timerScoreContainer.appendChild(scoreDisplayElement);
var gameContainer = document.querySelector('.game-container');
gameContainer.insertBefore(timerScoreContainer, document.getElementById('simon-container'));
// Otras variables y elementos del juego
var elapsedTime = 0;
var gameStartTime;
var gameTimer;
var penzalizacion;
var tiempo = 0;
var tiempofinal;
// Función para iniciar el temporizador del juego
function startGameTimer() {
  var intervalId = setInterval(function() {
    tiempo += 1;
    timerDisplay.textContent = 'Tiempo: ' + tiempo + 's';
  }, 1000);
}
// Función para reproducir la secuencia de colores de Simon
function playSimonSequence() {
  isGameRunning = false;
  playerSequence = [];
  var randomColor = simonColors[Math.floor(Math.random() * simonColors.length)];
  sequence.push(randomColor);
  var i = 0;
  var intervalId = setInterval(function() {
    var color = sequence[i];
    flashButton(color, true);
    setTimeout(function() {
      unflashButton(color, true);
    }, FLASH_DURATION);
    i++;
    if (i >= sequence.length) {
      clearInterval(intervalId);
      setTimeout(function() {
        isGameRunning = true;
        startTime = Date.now();
        playerSequence = [];
      }, DELAY_BETWEEN_FLASHES);
    }
  }, FLASH_DURATION + DELAY_BETWEEN_FLASHES);
}
// Función para destellar un botón
function flashButton(color, isShowSequence) {
  var button = document.getElementById(color);
  button.style.backgroundColor = isShowSequence ? 'white' : color;
  button.style.opacity = 1;
  button.classList.add('active');
  setTimeout(function() {
    unflashButton(color, isShowSequence);
  }, isShowSequence ? FLASH_DURATION : FLASH_DURATION - 150);
}
// Función para dejar de destellar un botón
function unflashButton(color, isShowSequence) {
  var button = document.getElementById(color);
  button.style.backgroundColor = isShowSequence ? color : 'transparent';
  button.style.opacity = isShowSequence ? 1 : 0.7;
  button.classList.remove('active');
  if (!isShowSequence && isGameRunning) {
    setTimeout(function() {
      button.style.backgroundColor = color;
      button.style.opacity = 1;
    }, 200);
  }
}
// Función para manejar el click en un botón de color
function handleSimonButtonClick(event) {
  if (!isGameRunning) return;
  var color = event.target.id;
  playerSequence.push(color);
  if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
    endGame();
  } else {
    flashButton(color);
    if (playerSequence.length === sequence.length) {
      score += sequence.length;
      scoreDisplayElement.textContent = "Puntaje: " + score;
      level++;
      levelDisplay.textContent = " " + level;
      playSimonSequence();
    }
  }
}
// Función para manejar el click en un botón de color
function endGame() {
  var finalScore = Math.max(score, 0);
  finalScoreDisplay.textContent = "Puntaje Final: " + finalScore;
  modal.style.display = 'block';
  saveGameResult();
  tiempo = 0;
  clearInterval(intervalId);
  timerDisplay.textContent = 'Tiempo: 0s';
}
// Función para reiniciar el juego
function restartGame() {
  sequence = [];
  playerSequence = [];
  level = 1;
  score = 0;
  scoreDisplayElement.textContent = 'Puntaje: 0';
  levelDisplay.textContent = ' 1';
  finalScoreDisplay.textContent = '';
  modal.style.display = 'none';
  isGameRunning = true;
  playSimonSequence();
  startGameTimer();
}
// Evento de click en el botón de inicio
btnStart.addEventListener('click', function() {
  playerName = prompt('Ingresa tu nombre:');
  if (!playerName) return;
  if (!isGameRunning) {
    restartGame();
  }
});
// Evento de click en el botón de inicio
simonButtons.forEach(function(button) {
  button.addEventListener('click', handleSimonButtonClick);
});
// Evento de click en el botón de reiniciar
btnRestart.addEventListener('click', restartGame);

window.addEventListener('beforeunload', function() {
  if (isGameRunning) {
    stopGameTimer();
  }
});
// Crear botón para mostrar los resultados del juego
var btnShowResults = document.createElement('button');
btnShowResults.textContent = 'Mostrar Resultados';
btnShowResults.addEventListener('click', displayGameResults);
document.body.appendChild(btnShowResults);

var btnClearResults = document.createElement('button');
btnClearResults.textContent = 'Limpiar Resultados';
btnClearResults.addEventListener('click', function() {
  localStorage.removeItem('gameResults');
  alert('Resultados limpiados.');
});
document.body.appendChild(btnClearResults);
// Crear botón para limpiar los resultados del juego
function saveGameResult() {
  penzalizacion = score * (0.05);
  ScoreFinal = score - penzalizacion;
  var gameResult = {
    name: playerName,
    score: Math.max(score, 0),
    level: level,
    date: new Date().toLocaleString(),
    Puntaje: ScoreFinal,
  };
  var gameResults = localStorage.getItem('gameResults');
  if (gameResults) {
    gameResults = JSON.parse(gameResults);
  } else {
    gameResults = [];
  }
  gameResults.push(gameResult);
  localStorage.setItem('gameResults', JSON.stringify(gameResults));
}
// Función para mostrar los resultados del juego
function displayGameResults() {
  var gameResults = JSON.parse(localStorage.getItem('gameResults'));
  if (!gameResults || gameResults.length === 0) {
    alert('Aún no hay resultados guardados.');
    return;
  }
  var resultDisplay = gameResults.map(function(result) {
    return result.name + " - Puntaje: " + result.score + " - Nivel: " + result.level + " - Fecha: " + result.date + " - Puntaje con Penalizacion: " + result.Puntaje;
  }).join('\n');
  alert('Resultados:\n' + resultDisplay);
}
// Asociar eventos de click a los botones de ordenamiento
btnSortDate.addEventListener('click', function() {
  renderRanking(sortByDate());
});
btnSortScore.addEventListener('click', function() {
  renderRanking(sortByScore());
});
// Función para ordenar por fecha
function sortByDate() {
  var gameResults = getGameResultsFromLocalStorage();
  gameResults.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  return gameResults;
}
// Función para ordenar por fecha
function sortByScore() {
  var gameResults = getGameResultsFromLocalStorage();
  gameResults.sort(function(a, b) {
    return b.score - a.score;
  });
  return gameResults;
}
// Función para renderizar la lista de ranking
function renderRanking(gameResults) {
  rankingList.innerHTML = '';
  gameResults.forEach(function(result, index) {
    var listItem = document.createElement('li');
    listItem.textContent = index + 1 + ". " + result.name + " - Puntaje: " + result.score + ", Nivel: " + result.level + ", Fecha: " + result.date + ", Puntaje con Penalizacion: " + result.Puntaje;
    rankingList.appendChild(listItem);
  });
}
// Función para obtener los resultados del juego almacenados
function getGameResultsFromLocalStorage() {
  var gameResults = localStorage.getItem('gameResults');
  if (gameResults) {
    return JSON.parse(gameResults);
  } else {
    return [];
  }
}
renderRanking(sortByScore());
