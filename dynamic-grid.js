const container = document.querySelector('.grid-container');

function updateGrid() {
  container.innerHTML = '';

  const containerWidth = container.offsetWidth;
  const squareSize = 50;
  const columns = Math.floor(containerWidth / squareSize);

  // Total squares adjusted for 432 + 12 = 444
  const totalBaseSquares = 444;

  // Determine number of rows based on column count
  let baseRows;
  if (columns >= 20) {
    baseRows = Math.ceil(totalBaseSquares / columns);
  } else if (columns > 11 && columns < 20) {
    // Original rows: 29, increase by 1 to accommodate 12 extra squares
    baseRows = 29 + 1; // 30 rows
  } else { // columns <= 11
    // Original rows: 36, increase by 2 to accommodate 12 extra squares (for 6 columns, 12/6=2)
    // For columns <=11, ceil(12 / columns) = ceil(12/11)=2 to ceil(12/1)=12
    baseRows = 36 + Math.ceil(12 / columns);
  }

  const totalSquares = baseRows * columns + 12;
  const rows = baseRows;

  container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

  // Create squares with "s, a, n, d, b, o, x" logic
  for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-square');

    // "s, a, n, d" in the first row
    if (i === 0) {
      square.textContent = 's';
      styleBigLetter(square, squareSize);
    } else if (i === 1) {
      square.textContent = 'a';
      styleBigLetter(square, squareSize);
    } else if (i === 2) {
      square.textContent = 'n';
      styleBigLetter(square, squareSize);
    } else if (i === 3) {
      square.textContent = 'd';
      styleBigLetter(square, squareSize);
    }
    // Hide 5th box in row 1 & row 2
    else if (i === 4 || i === columns + 4) {
      square.style.visibility = 'hidden';
    }
    // Diagonal fill for first box in 2nd row
    else if (i === columns) {
      square.style.position = 'relative';
      square.style.overflow = 'hidden';
      const triangle = document.createElement('div');
      triangle.style.position = 'absolute';
      triangle.style.top = '0';
      triangle.style.left = '0';
      triangle.style.width = '100%';
      triangle.style.height = '100%';
      triangle.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%)';
      triangle.style.backgroundColor = 'white';
      square.appendChild(triangle);
    }
    // "b, o, x" in the second row
    else if (i === columns + 1) {
      square.textContent = 'b';
      styleBigLetter(square, squareSize);
    } else if (i === columns + 2) {
      square.textContent = 'o';
      styleBigLetter(square, squareSize);
    } else if (i === columns + 3) {
      square.textContent = 'x';
      styleBigLetter(square, squareSize);
    }
    // First 5 squares in 3rd row invisible
    else if (i >= columns * 2 && i < columns * 2 + 5) {
      square.style.visibility = 'hidden';
    }

    container.appendChild(square);
  }

  // Insert 3 articles based on the new responsive approach
  createResponsiveArticles(columns, rows);
}

/** Style for the big letters ("s, a, n, d, b, o, x"). */
function styleBigLetter(elem, size) {
  elem.style.color = 'white';
  elem.style.textAlign = 'center';
  elem.style.fontSize = '33px';
  elem.style.lineHeight = `${size}px`;
}

/** Decide which layout to use based on the number of columns. */
function createResponsiveArticles(columns, rows) {
  if (columns >= 20) {
    // Horizontal layout with slight vertical randomness
    createHorizontalArticles(columns, rows);
  } else if (columns > 11 && columns < 20) {
    // Vertical formation with anchor at 5th or 6th row
    createVerticalArticlesMedium(columns, rows);
  } else { // columns <= 11
    // Vertical formation with three square separation
    createVerticalArticlesSmall(columns, rows);
  }
}

/** HORIZONTAL layout:
 * - Place 3 articles horizontally with slight vertical randomness.
 */
function createHorizontalArticles(columns, rows) {
  const articleWidth = 5;
  const articleHeight = 7;
  const margin = 1;

  const totalArticles = 3;
  const takenAreas = [];

  for (let i = 0; i < totalArticles; i++) {
    let placed = false;
    const maxAttempts = 50;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const colStart = randomInt(0, columns - articleWidth + 1);
      const baseRow = randomInt(0, rows - articleHeight + 1);
      // Introduce slight vertical randomness
      const rowStart = baseRow + randomInt(-2, 3); // ±2 squares

      if (rowStart < 0 || rowStart + articleHeight > rows) continue;

      if (!isValidPlacement(colStart, rowStart, articleWidth, articleHeight, columns, rows, takenAreas, margin)) {
        continue;
      }

      // Place the article
      appendArticle(colStart, rowStart);
      removeSquaresInArea(colStart, colStart + articleWidth, rowStart, rowStart + articleHeight, columns);

      takenAreas.push({
        colStart,
        colEnd: colStart + articleWidth,
        rowStart,
        rowEnd: rowStart + articleHeight
      });

      placed = true;
      break;
    }

    if (!placed) {
      console.warn(`Could not place horizontal article ${i + 1}`);
    }
  }
}

/** VERTICAL layout for 12-19 columns:
 * - One article anchored at 5th or 6th row, others beneath with one square separation.
 * - Horizontal positions vary randomly.
 */
function createVerticalArticlesMedium(columns, rows) {
  const articleWidth = 5;
  const articleHeight = 7;
  const margin = 1;
  const separation = 1;

  const totalArticles = 3;
  const takenAreas = [];

  // Anchor the first article at row 5 or 6 (0-based index: 4 or 5)
  const anchorRows = [4, 5];
  const anchorRow = anchorRows[randomInt(0, anchorRows.length)];

  let placed = false;

  for (let attempt = 0; attempt < 50; attempt++) {
    const colStart = randomInt(0, columns - articleWidth + 1);
    const rowStart = anchorRow;

    if (rowStart + articleHeight > rows) continue;

    if (!isValidPlacement(colStart, rowStart, articleWidth, articleHeight, columns, rows, takenAreas, margin)) {
      continue;
    }

    // Place the anchored article
    appendArticle(colStart, rowStart);
    removeSquaresInArea(colStart, colStart + articleWidth, rowStart, rowStart + articleHeight, columns);

    takenAreas.push({
      colStart,
      colEnd: colStart + articleWidth,
      rowStart,
      rowEnd: rowStart + articleHeight
    });

    placed = true;
    break;
  }

  if (!placed) {
    console.warn('Could not place anchored vertical article');
    return;
  }

  // Place the remaining two articles beneath with one square separation
  let lastArea = takenAreas[takenAreas.length - 1];

  for (let i = 0; i < totalArticles - 1; i++) {
    placed = false;
    const maxAttempts = 50;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Allow horizontal randomness
      const colStart = randomInt(0, columns - articleWidth + 1);
      const rowStart = lastArea.rowEnd + separation;

      if (rowStart + articleHeight > rows) continue;

      if (!isValidPlacement(colStart, rowStart, articleWidth, articleHeight, columns, rows, takenAreas, margin)) {
        continue;
      }

      // Place the article
      appendArticle(colStart, rowStart);
      removeSquaresInArea(colStart, colStart + articleWidth, rowStart, rowStart + articleHeight, columns);

      takenAreas.push({
        colStart,
        colEnd: colStart + articleWidth,
        rowStart,
        rowEnd: rowStart + articleHeight
      });

      lastArea = takenAreas[takenAreas.length - 1];
      placed = true;
      break;
    }

    if (!placed) {
      console.warn(`Could not place vertical article ${i + 2}`);
    }
  }
}

/** VERTICAL layout for <=11 columns:
 * - Three articles stacked vertically with three square separation.
 * - Centered horizontally if possible.
 */
function createVerticalArticlesSmall(columns, rows) {
  const articleWidth = 5;
  const articleHeight = 7;
  const margin = 1;
  const separation = 3;

  const totalArticles = 3;
  const takenAreas = [];

  // Center horizontally if possible
  let colStart = Math.floor((columns - articleWidth) / 2);
  if (colStart < 0) colStart = 0;
  if (colStart + articleWidth > columns) colStart = columns - articleWidth;
  colStart = Math.max(0, colStart); // Ensure non-negative

  // Anchor the first article at row 5 or 6 (0-based index: 4 or 5)
  const anchorRows = [4, 5];
  const anchorRow = anchorRows[randomInt(0, anchorRows.length)];

  let placed = false;

  for (let attempt = 0; attempt < 50; attempt++) {
    const rowStart = anchorRow + attempt;

    if (rowStart + articleHeight > rows) break;

    if (!isValidPlacement(colStart, rowStart, articleWidth, articleHeight, columns, rows, takenAreas, margin)) {
      continue;
    }

    // Place the first article
    appendArticle(colStart, rowStart);
    removeSquaresInArea(colStart, colStart + articleWidth, rowStart, rowStart + articleHeight, columns);

    takenAreas.push({
      colStart,
      colEnd: colStart + articleWidth,
      rowStart,
      rowEnd: rowStart + articleHeight
    });

    placed = true;
    break;
  }

  if (!placed) {
    console.warn('Could not place first vertical article (small layout)');
    return;
  }

  // Place the remaining two articles with three square separation
  let lastArea = takenAreas[takenAreas.length - 1];

  for (let i = 0; i < totalArticles - 1; i++) {
    placed = false;

    for (let rowStart = lastArea.rowEnd + separation; rowStart < rows - articleHeight; rowStart++) {
      if (!isValidPlacement(colStart, rowStart, articleWidth, articleHeight, columns, rows, takenAreas, margin)) {
        continue;
      }

      // Place the article
      appendArticle(colStart, rowStart);
      removeSquaresInArea(colStart, colStart + articleWidth, rowStart, rowStart + articleHeight, columns);

      takenAreas.push({
        colStart,
        colEnd: colStart + articleWidth,
        rowStart,
        rowEnd: rowStart + articleHeight
      });

      lastArea = takenAreas[takenAreas.length - 1];
      placed = true;
      break;
    }

    if (!placed) {
      console.warn(`Could not place vertical article ${i + 2} (small layout)`);
      break;
    }
  }
}

/** Check if a placement is valid based on existing taken areas and margins. */
function isValidPlacement(colStart, rowStart, w, h, columns, rows, takenAreas, margin) {
  const colEnd = colStart + w;
  const rowEnd = rowStart + h;
  if (colEnd > columns || rowEnd > rows) return false;

  // Skip top 2 rows
  if (rowStart < 2) return false;

  // Skip row=2 and col<6 area
  const intersectsRow2 = (rowStart <= 2 && rowEnd > 2);
  const intersectsCols0to5 = (colStart < 6);
  if (intersectsRow2 && intersectsCols0to5) return false;

  // Check margin-based overlaps
  return !overlapsAnyAreaWithMargin(
    colStart, colEnd,
    rowStart, rowEnd,
    takenAreas,
    margin,
    columns,
    rows
  );
}

/** Check if the new area overlaps with any taken area considering the margin. */
function overlapsAnyAreaWithMargin(
  colStart, colEnd,
  rowStart, rowEnd,
  takenAreas,
  margin,
  columns,
  rows
) {
  for (const area of takenAreas) {
    let aColStart = area.colStart - margin;
    let aColEnd = area.colEnd + margin;
    let aRowStart = area.rowStart - margin;
    let aRowEnd = area.rowEnd + margin;

    // Clamp to grid boundaries
    aColStart = Math.max(0, aColStart);
    aRowStart = Math.max(0, aRowStart);
    aColEnd = Math.min(columns, aColEnd);
    aRowEnd = Math.min(rows, aRowEnd);

    const horizontalOverlap = (colStart < aColEnd) && (colEnd > aColStart);
    const verticalOverlap = (rowStart < aRowEnd) && (rowEnd > aRowStart);
    if (horizontalOverlap && verticalOverlap) {
      return true;
    }
  }
  return false;
}

/** Hide squares within the specified area. */
function removeSquaresInArea(colStart, colEnd, rowStart, rowEnd, columns) {
  for (let r = rowStart; r < rowEnd; r++) {
    for (let c = colStart; c < colEnd; c++) {
      const index = r * columns + c;
      const square = container.children[index];
      if (square) {
        square.style.display = 'none';
      }
    }
  }
}

/** Actually inserts the 5×7 bounding box for the article into the grid. */
function appendArticle(colStart, rowStart) {
  // Top 5×5 => .article-image
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('article-image');
  imageDiv.style.gridColumn = `${colStart + 1} / ${colStart + 6}`;
  imageDiv.style.gridRow = `${rowStart + 1} / ${rowStart + 6}`;

  // Bottom 3×2 => .article-text (left-aligned)
  const textDiv = document.createElement('div');
  textDiv.classList.add('article-text');
  textDiv.textContent = 'Some text here';
  textDiv.style.gridColumn = `${colStart + 1} / ${colStart + 4}`;
  textDiv.style.gridRow = `${rowStart + 6} / ${rowStart + 8}`;

  container.appendChild(imageDiv);
  container.appendChild(textDiv);
}

/** Utility: Returns a random integer between min (inclusive) and max (exclusive). */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/** Shuffle array in-place. */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Listen for resize and initialize
window.addEventListener('resize', updateGrid);
updateGrid();
