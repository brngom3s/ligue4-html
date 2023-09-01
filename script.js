//Initial references
const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const textoInicial = document.getElementById("primeiro-texto")
const pontosDoJogo = document.getElementById("pontos-do-jogo1")
const pontosDoJogo2 = document.getElementById("pontos-do-jogo2")
const startButtonProximo = document.getElementById("actions-buttons-próximo");
const startButtonAnterior = document.getElementById("actions-buttons-anterior");
const message = document.getElementById("message");
let initialMatrix = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
let currentPlayer;

//Random Number Between Range
const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

//Loop through array and check for same values
const verifyArray = (arrayElement) => {
  let bool = false;
  let elementCount = 0;
  arrayElement.forEach((element, index) => {
    if (element == currentPlayer) {
      elementCount += 1;
      if (elementCount == 4) {
        bool = true;
      }
    } else {
      elementCount = 0;
    }
  });
  return bool;
};

//Check for game over(Last step)
const gameOverCheck = () => {
  let truthCounnt = 0;
  for (let innerArray of initialMatrix) {
    if (innerArray.every((val) => val != 0)) {
      truthCounnt += 1;
    } else {
      return false;
    }
  }
  if (truthCounnt == 6) {
    message.innerText = "EMPATE!";
    message.innerText = "Game Over";
    startScreen.classList.remove("hide");
  }
};

//Check rows
const checkAdjacentRowValues = (row) => {
  return verifyArray(initialMatrix[row]);
};

//Check columns
const checkAdjacentColumnValues = (column) => {
  let colWinCount = 0,
    colWinBool = false;
  initialMatrix.forEach((element, index) => {
    if (element[column] == currentPlayer) {
      colWinCount += 1;
      if (colWinCount == 4) {
        colWinBool = true;
      }
    } else {
      colWinCount = 0;
    }
  });
  //no match
  return colWinBool;
};

//Get Right diagonal values
const getRightDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let rightDiagonal = [];
  while (rowCount > 0) {
    if (columnCount >= columnLength - 1) {
      break;
    }
    rowCount -= 1;
    columnCount += 1;
    rightDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount < 0) {
      break;
    }
    rightDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount -= 1;
  }
  return rightDiagonal;
};

const getLeftDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let leftDiagonal = [];
  while (rowCount > 0) {
    if (columnCount <= 0) {
      break;
    }
    rowCount -= 1;
    columnCount -= 1;
    leftDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount >= columnLength) {
      break;
    }
    leftDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount += 1;
  }
  return leftDiagonal;
};

//Check diagonal
const checkAdjacentDiagonalValues = (row, column) => {
  let diagWinBool = false;
  let tempChecks = {
    leftTop: [],
    rightTop: [],
  };
  let columnLength = initialMatrix[row].length;
  let rowLength = initialMatrix.length;

  //Store left and right diagonal array
  tempChecks.leftTop = [
    ...getLeftDiagonal(row, column, rowLength, columnLength),
  ];

  tempChecks.rightTop = [
    ...getRightDiagonal(row, column, rowLength, columnLength),
  ];
  //check both arrays for similarities
  diagWinBool = verifyArray(tempChecks.rightTop);
  if (!diagWinBool) {
    diagWinBool = verifyArray(tempChecks.leftTop);
  }
  return diagWinBool;
};

//Win check logic
const winCheck = (row, column) => {
  //if any of the functions return true we return true
  return checkAdjacentRowValues(row)
    ? true
    : checkAdjacentColumnValues(column)
    ? true
    : checkAdjacentDiagonalValues(row, column)
    ? true
    : false;
};

//Sets the circle to exact points
const setPiece = (startCount, colValue) => {
  let rows = document.querySelectorAll(".grid-row");
  //Initially it will place the circles in the last row else if no place availabke we will decrement the count until we find empty slot
  if (initialMatrix[startCount][colValue] != 0) {
    startCount -= 1;
    setPiece(startCount, colValue);
  } else {
    //place circle
    let currentRow = rows[startCount].querySelectorAll(".grid-box");
    currentRow[colValue].classList.add("filled", `player${currentPlayer}`);
    //Update Matrix
    initialMatrix[startCount][colValue] = currentPlayer;
    //Check for wins
    if (winCheck(startCount, colValue)) {
      // function showAlert(message) {
      //   alert(message);
      // }
      alert = `Vitória do Jogador <span> ${currentPlayer}</span> `;
      startScreen.classList.remove("hide");
      return false;
    }
  }
  //Check if all are full
  gameOverCheck();
};

//When user clicks on a box
const fillBox = (e) => {
  //get column value
  let colValue = parseInt(e.target.getAttribute("data-value"));
  //5 because we have 6 rows (0-5)
  setPiece(5, colValue);
  currentPlayer = currentPlayer == 1 ? 2 : 1;

  // playerTurn.innerHTML = `Turno do Jogador <span>${currentPlayer}</span> `;
};

//Create Matrix
const matrixCreator = () => {
  for (let innerArray in initialMatrix) {
    let outerDiv = document.createElement("div");
    outerDiv.classList.add("grid-row");
    outerDiv.setAttribute("data-value", innerArray);
    for (let j in initialMatrix[innerArray]) {
      //Set all matrix values to 0
      initialMatrix[innerArray][j] = [0];
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("grid-box");
      innerDiv.setAttribute("data-value", j);
      innerDiv.addEventListener("click", (e) => {
        fillBox(e);
      });
      outerDiv.appendChild(innerDiv);
    }
    container.appendChild(outerDiv);
  }
};

//Initialise game
window.onload = startGame = async () => {
  //Between 1 and 2
  currentPlayer = generateRandomNumber(1, 3);
  currentPlayer = 1;
  container.innerHTML = "";
  await matrixCreator();
  // playerTurn.innerHTML = `Turno do Jogador <span>${currentPlayer}</span> `;
};

//start game
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  startGame();
});

startButtonProximo.addEventListener("click", () => {
  if(textoInicial.style.display == "flex") {
    pontosDoJogo.style.display = "block";
    textoInicial.style.display = "none";
  } else if (pontosDoJogo.style.display == "block") {
    pontosDoJogo.style.display = "none";
    pontosDoJogo2.style.display = "block"
  }
});

startButtonAnterior.addEventListener("click", () => {
  if(pontosDoJogo2.style.display == "block") {
    pontosDoJogo.style.display = "block";
    pontosDoJogo2.style.display = "none"
  } else if(pontosDoJogo.style.display == "block") {
    pontosDoJogo.style.display = "none";
    textoInicial.style.display = "flex";
  } 
});

const toggleButton = document.getElementById('toggle-contrast');
const body = document.body;

// Alto Contraste
toggleButton.addEventListener('click', function() {
  body.classList.toggle('high-contrast');
});

// Voltar à tela inicial
const botao = document.querySelector(".back");
botao.addEventListener("click", startGame());

var player1Text = document.querySelector(".player-wrappers:nth-child(1)");
var player2Text = document.querySelector(".player-wrappers:nth-child(2)");

var vezDoPlayer1 = true;
player1Text.classList.add("playerTurn");

function atualizarClasseJogador() {
  if (vezDoPlayer1) {
    player1Text.classList.add("playerTurn");
    player2Text.classList.remove("playerTurn");
  } else {
    player1Text.classList.remove("playerTurn");
    player2Text.classList.add("playerTurn");
  }
}

document.querySelector(".container").addEventListener("click",function() {
  vezDoPlayer1 = !vezDoPlayer1;
  atualizarClasseJogador();

});