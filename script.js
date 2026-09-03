const keyboardButtons = document.querySelectorAll(".keyboard-row button");
const tiles = document.querySelectorAll(".tile");
let currentRow = 0;
let currentCol = 0;

for (const button of keyboardButtons) {
  button.addEventListener("click", function (event) {
    const letter = event.target.textContent;

    if (letter === "Enter") {
      // Only advance if the row is full and we haven't used all 6 guesses
      if (currentRow < 6 && currentCol === 5) {
        // TODO: check guess before advancing
        currentRow++;
        currentCol = 0;
      }
    } else if (letter === "⌫") {
      // Only delete if we aren't at the start of the row
      if (currentCol > 0) {
        currentCol--;
        const tileIndex = currentRow * 5 + currentCol;
        tiles[tileIndex].textContent = "";
      }
    } else {
      // Only add a letter if we haven't filled the 5 columns
      if (currentCol < 5) {
        const tileIndex = currentRow * 5 + currentCol;
        tiles[tileIndex].textContent = letter;
        currentCol++;
      }
    }
  });
}

