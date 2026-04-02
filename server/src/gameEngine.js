const SHUFFLE_SIZE = 25;

export function createBoard() {
  const values = Array.from({ length: SHUFFLE_SIZE }, (_, i) => i + 1);
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

export function getCompletedLines(board, selectedNumbers) {
  const completed = [];
  const marked = new Set(Array.from(selectedNumbers).filter((num) => board.includes(num)));

  const grid = Array.from({ length: 5 }, (_, row) => board.slice(row * 5, row * 5 + 5));

  for (let row = 0; row < 5; row += 1) {
    if (grid[row].every((value) => marked.has(value))) {
      completed.push(`row-${row}`);
    }
  }

  for (let col = 0; col < 5; col += 1) {
    if (grid.every((row) => marked.has(row[col]))) {
      completed.push(`col-${col}`);
    }
  }

  if ([0, 1, 2, 3, 4].every((index) => marked.has(grid[index][index]))) {
    completed.push('diag-main');
  }

  if ([0, 1, 2, 3, 4].every((index) => marked.has(grid[index][4 - index]))) {
    completed.push('diag-anti');
  }

  return completed;
}

export function computeBoardScore(board, selectedNumbers) {
  return getCompletedLines(board, selectedNumbers).length;
}

export function createRoomId(existingRooms) {
  const length = 6 + Math.floor(Math.random() * 3);
  const digits = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  if (existingRooms.has(digits) || digits.length < 6) {
    return createRoomId(existingRooms);
  }
  return digits;
}
