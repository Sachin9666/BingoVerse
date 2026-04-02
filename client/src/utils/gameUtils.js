export function createBoard() {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

export function getMarkedNumbers(board, selectedNumbers) {
  return board.filter((value) => selectedNumbers.has(value));
}

export function getCompletedLines(board, selectedNumbers) {
  const marked = new Set(board.filter((value) => selectedNumbers.has(value)));
  const grid = Array.from({ length: 5 }, (_, row) => board.slice(row * 5, row * 5 + 5));
  let count = 0;

  for (let row = 0; row < 5; row += 1) {
    if (grid[row].every((value) => marked.has(value))) count += 1;
  }
  for (let col = 0; col < 5; col += 1) {
    if (grid.every((row) => marked.has(row[col]))) count += 1;
  }
  if ([0, 1, 2, 3, 4].every((index) => marked.has(grid[index][index]))) count += 1;
  if ([0, 1, 2, 3, 4].every((index) => marked.has(grid[index][4 - index]))) count += 1;
  return count;
}

export function getCompletedLineNumbers(board, selectedNumbers) {
  const marked = new Set(board.filter((value) => selectedNumbers.has(value)));
  const grid = Array.from({ length: 5 }, (_, row) => board.slice(row * 5, row * 5 + 5));
  const completedNumbers = new Set();

  for (let row = 0; row < 5; row += 1) {
    if (grid[row].every((value) => marked.has(value))) {
      grid[row].forEach((value) => completedNumbers.add(value));
    }
  }
  for (let col = 0; col < 5; col += 1) {
    const columnValues = grid.map((row) => row[col]);
    if (columnValues.every((value) => marked.has(value))) {
      columnValues.forEach((value) => completedNumbers.add(value));
    }
  }
  const mainDiag = [0, 1, 2, 3, 4].map((index) => grid[index][index]);
  if (mainDiag.every((value) => marked.has(value))) mainDiag.forEach((value) => completedNumbers.add(value));
  const antiDiag = [0, 1, 2, 3, 4].map((index) => grid[index][4 - index]);
  if (antiDiag.every((value) => marked.has(value))) antiDiag.forEach((value) => completedNumbers.add(value));

  return completedNumbers;
}

function findAvailable(board, selectedNumbers) {
  return board.filter((value) => !selectedNumbers.has(value));
}

function findLineTarget(board, selectedNumbers, targetCount) {
  const marked = new Set(board.filter((value) => selectedNumbers.has(value)));
  const grid = Array.from({ length: 5 }, (_, row) => board.slice(row * 5, row * 5 + 5));

  const lines = [];
  for (let row = 0; row < 5; row += 1) {
    lines.push(grid[row]);
  }
  for (let col = 0; col < 5; col += 1) {
    lines.push(grid.map((row) => row[col]));
  }
  lines.push([0, 1, 2, 3, 4].map((index) => grid[index][index]));
  lines.push([0, 1, 2, 3, 4].map((index) => grid[index][4 - index]));

  for (const line of lines) {
    const markedCount = line.filter((value) => marked.has(value)).length;
    if (markedCount === targetCount) {
      const candidates = line.filter((value) => !marked.has(value));
      if (candidates.length === 1) {
        return candidates[0];
      }
    }
  }
  return null;
}

export function findBestAIMove(aiBoard, playerBoard, selectedNumbers) {
  const selectedSet = new Set(selectedNumbers);
  const completeMove = findLineTarget(aiBoard, selectedSet, 4);
  if (completeMove) return completeMove;

  const blockMove = findLineTarget(playerBoard, selectedSet, 4);
  if (blockMove) return blockMove;
  const earlyBlock = findLineTarget(playerBoard, selectedSet, 3);
  if (earlyBlock) return earlyBlock;
  const preBlock = findLineTarget(playerBoard, selectedSet, 2);
  if (preBlock) return preBlock;

  const promising = [];
  const lines = [];
  const grid = Array.from({ length: 5 }, (_, row) => aiBoard.slice(row * 5, row * 5 + 5));
  for (let row = 0; row < 5; row += 1) lines.push(grid[row]);
  for (let col = 0; col < 5; col += 1) lines.push(grid.map((row) => row[col]));
  lines.push([0, 1, 2, 3, 4].map((index) => grid[index][index]));
  lines.push([0, 1, 2, 3, 4].map((index) => grid[index][4 - index]));

  for (const line of lines) {
    const aiMarks = line.filter((value) => selectedSet.has(value)).length;
    const playerMarks = line.filter((value) => new Set(playerBoard.filter((v) => selectedSet.has(v))).has(value)).length;
    line.forEach((value) => {
      if (!selectedSet.has(value)) {
        // Higher weight for cells that advance AI lines and disrupt player
        const cellScore = aiMarks * 2.2 + playerMarks * 1.8;
        const isCenter = value === aiBoard[12];
        const isCorner = [aiBoard[0], aiBoard[4], aiBoard[20], aiBoard[24]].includes(value);
        const bonus = isCenter ? 0.8 : isCorner ? 0.4 : 0;
        promising.push({ value, score: cellScore + bonus });
      }
    });
  }

  promising.sort((a, b) => b.score - a.score || a.value - b.value);
  if (promising.length > 0) {
    return promising[0].value;
  }

  const available = findAvailable(aiBoard, selectedSet);
  return available[Math.floor(Math.random() * available.length)];
}

export function formatBingoProgress(score) {
  return ['B', 'I', 'N', 'G', 'O'].map((letter, index) => ({ letter, active: index < score }));
}
