const keyboardButtons = document.querySelectorAll(".keyboard-row button");
const tiles = document.querySelectorAll(".tile");
const restartButton = document.getElementById("restart-button");

let answer = answerList[Math.floor(Math.random() * answerList.length)];
let currentRow = 0;
let currentCol = 0;
let gameOver = false;

let startTime = Date.now();
let timerInterval = null;

let saved = localStorage.getItem("leaderboard");
let leaderboardData = saved ? JSON.parse(saved) : [];

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
      if (button.classList.contains("correct")) {
        return;
      }
      button.classList.remove("present", "absent");
      button.classList.add(result);
    }
  }
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  clearInterval(timerInterval);
  document.getElementById("current-timer").textContent = "0:00";
  timerInterval = setInterval(function () {
    const elapsed = Date.now() - startTime;
    document.getElementById("current-timer").textContent = formatDuration(elapsed);
  }, 1000);
}

function handleKey(key) {
  if (gameOver) {
    return;
  }

  if (key === "ENTER") {
    if (currentRow < 6 && currentCol === 5) {
      const { guess, results } = checkGuess();

    if (!wordList.includes(guess)) {
      alert("Not a valid word!");
      return;
    }

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
        clearInterval(timerInterval);
        alert("You win!");
	finishGame();
      } else if (currentRow === 6) {
        gameOver = true;
        clearInterval(timerInterval);
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

function finishGame() {
  const durationMs = Date.now() - startTime;
  let nickname = prompt("Game over! Enter your nickname (max 8 chars):");
  if (!nickname) nickname = "Player";
  nickname = nickname.slice(0, 8);

  const newEntry = {
    nickname: nickname,
    realName: nickname,
    timestamp: Date.now(),
    durationMs: durationMs
  };

  leaderboardData.push(newEntry);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));
  renderLeaderboard(sortLeaderboard(leaderboardData));
}

function resetGame() {
  answer = answerList[Math.floor(Math.random() * answerList.length)];
  currentRow = 0;
  currentCol = 0;
  gameOver = false;
  startTime = Date.now();
  startTimer();		

  for (const tile of tiles) {
    tile.textContent = "";
    tile.classList.remove("correct", "present", "absent");
  }

  for (const button of keyboardButtons) {
    button.classList.remove("correct", "present", "absent");
  }

  restartButton.blur();
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

function renderLeaderboard(entries) {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";

  const top10 = entries.slice(0, 10);

  for (const entry of top10) {
    const item = document.createElement("li");
    item.textContent = `${entry.nickname} — ${formatDuration(entry.durationMs)}`;
    list.appendChild(item);
  }
}

function sortLeaderboard(entries) {
  for (let i = 0; i < entries.length; i++) {
    for (let j = 0; j < entries.length - 1; j++) {
      if (entries[j].durationMs > entries[j+1].durationMs) {
        let temp = entries[j];
        entries[j] = entries[j + 1];
        entries[j + 1] = temp;
      } else if (entries[j].durationMs == entries[j+1].durationMs) {
        if (entries[j].timestamp > entries[j+1].timestamp) {
          let temp = entries[j];
          entries[j] = entries[j + 1];
          entries[j + 1] = temp;
        }
      }
    }
  }
  return entries;
}

renderLeaderboard(sortLeaderboard(leaderboardData));
startTimer();	