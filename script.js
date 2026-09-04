const keyboardButtons = document.querySelectorAll(".keyboard-row button");
const tiles = document.querySelectorAll(".tile");
const restartButton = document.getElementById("restart-button");

let answer = wordList[Math.floor(Math.random() * wordList.length)];
let currentRow = 0;
let currentCol = 0;
let gameOver = false;

function checkGuess() {
  let guess = "";
  for (let i = 0; i < 5; i++) {
    const tileIndex = currentRow * 5 + i;
    guess = guess + tiles[tileIndex].textContent;
  }

  const letterCount = {};
  for (const char of answer) {
    if (char in letterCount) {
      letterCount[char]++;
    } else {
      letterCount[char] = 1;
    }
  }

  const results = ["", "", "", "", ""];
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      results[i] = "correct";
      letterCount[guess[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (results[i] === "correct") {
      continue;
    } else if (letterCount[guess[i]] > 0) {
      results[i] = "present";
      letterCount[guess[i]]--;
    } else {
      results[i] = "absent";
    }
  }

  return { guess: guess, results: results };
}

function colorKeyboardKey(letter, result) {
  for (const button of keyboardButtons) {
    if (button.textContent === letter) {
      // Don't downgrade a key that's already marked "correct" from an earlier guess
      if (button.classList.contains("correct")) {
        return;
      }
      button.classList.remove("present", "absent");
      button.classList.add(result);
    }
  }
}

function handleKey(key) {
  if (gameOver) {
    return;
  }

  if (key === "ENTER") {
    if (currentRow < 6 && currentCol === 5) {
      const { guess, results } = checkGuess();

      let won = true;
      for (let i = 0; i < 5; i++) {
        const tileIndex = currentRow * 5 + i;
        tiles[tileIndex].classList.add(results[i]);
        colorKeyboardKey(guess[i], results[i]);
        if (results[i] !== "correct") {
          won = false;
        }
      }

      currentRow++;
      currentCol = 0;

      if (won) {
        gameOver = true;
        alert("You win!");
      } else if (currentRow === 6) {
        gameOver = true;
        alert("You lose! The word was " + answer);
      }
    }
  } else if (key === "BACKSPACE" || key === "⌫") {
    if (currentCol > 0) {
      currentCol--;
      const tileIndex = currentRow * 5 + currentCol;
      tiles[tileIndex].textContent = "";
    }
  } else if (key.length === 1 && key >= "A" && key <= "Z") {
    if (currentCol < 5) {
      const tileIndex = currentRow * 5 + currentCol;
      tiles[tileIndex].textContent = key;
      currentCol++;
    }
  }
}

function resetGame() {
  answer = wordList[Math.floor(Math.random() * wordList.length)];
  currentRow = 0;
  currentCol = 0;
  gameOver = false;

  for (const tile of tiles) {
    tile.textContent = "";
    tile.classList.remove("correct", "present", "absent");
  }

  for (const button of keyboardButtons) {
    button.classList.remove("correct", "present", "absent");
  }
}

for (const button of keyboardButtons) {
  button.addEventListener("click", function (event) {
    handleKey(event.target.textContent.toUpperCase());
  });
}

document.addEventListener("keydown", function (event) {
  handleKey(event.key.toUpperCase());
});

restartButton.addEventListener("click", resetGame);
