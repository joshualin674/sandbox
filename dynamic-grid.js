// Select the grid container
const container = document.querySelector('.grid-container');

/**
 * Jumping Fix:
 * Track lastWidth so we only call updateGrid() if the width actually changes
 * (ignoring minor vertical changes on mobile).
 */
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) {
    lastWidth = window.innerWidth;
    updateGrid();
  }
});

// ====== 1) Article Texts: Add or change them here ======
const articleTexts = {
  1: "Article 1 content goes here...by Whomever Wrote Article 1",
  2: "Hi from Article 2...by Article 2 Writer",
  3: "Article 3 content...by Whomever Wrote It",
  // ... add more articles as needed ...
};
// Initial call
updateGrid();

function updateGrid() {
  container.innerHTML = '';

  const containerWidth = container.offsetWidth;
  const squareSize = 50;
  const columns = Math.floor(containerWidth / squareSize);

  // We have 444 total squares to place (432 base + 12 extra)
  const totalBaseSquares = 444;

  // 1) Determine number of rows
  let baseRows;
  if (columns > 20) {
    baseRows = Math.ceil(totalBaseSquares / columns);
  } else if (columns <= 11) {
    baseRows = 36 + Math.ceil(12 / columns) + 4;
    baseRows = Math.max(0, baseRows - 7);
  } else {
    baseRows = 30 + 4;
  }

  const totalSquares = baseRows * columns;
  const rows = baseRows;

  container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

  // 2) Create base squares + random backgrounds
  for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-square');

    // Random background from white_sand1..9
    const randImgIndex = randomInt(1, 4); // 1..9
    square.style.backgroundImage = `url("./blue_sand_opacity${randImgIndex}.png")`;
    square.style.backgroundSize = 'cover';
    square.style.backgroundRepeat = 'no-repeat';
    square.style.backgroundPosition = 'center';

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
      triangle.style.backgroundColor = '#00AEEF';
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

  // 3) Decide article layout
  if (columns >= 20) {
    createHorizontalArticles(columns, rows);
  } else {
    createVerticalArticlesSmall(columns, rows);
  }
}

/** Horizontal layout for columns >= 20 */
function createHorizontalArticles(columns, rows) {
  const articleWidth = 5;
  const articleHeight = 7;
  const totalArticles = 3;

  if (columns < 19) {
    console.warn('Not enough columns for horizontal layout with spacing.');
    return;
  }

  // Distribute leftover among 4 gaps
  let gapLeft = 1,
    gapBetween1 = 1,
    gapBetween2 = 1,
    gapRight = 1;
  let leftover = columns - 3 * articleWidth - (gapLeft + gapBetween1 + gapBetween2 + gapRight);
  const gaps = [gapLeft, gapBetween1, gapBetween2, gapRight];
  while (leftover > 0) {
    const idx = randomInt(0, gaps.length);
    gaps[idx]++;
    leftover--;
  }
  [gapLeft, gapBetween1, gapBetween2, gapRight] = gaps;

  const col1 = gapLeft;
  const col2 = col1 + articleWidth + gapBetween1;
  const col3 = col2 + articleWidth + gapBetween2;

  let rowStart1 = randomInt(4, 8);
  if (rowStart1 + articleHeight > rows) {
    rowStart1 = Math.max(4, rows - articleHeight);
  }

  let row2Min = 2;
  let row2Max = Math.max(row2Min, rows - articleHeight);
  let rowStart2 = randomInt(row2Min, row2Max + 1);

  let row3Min = 2;
  let row3Max = Math.max(row3Min, rows - articleHeight);
  let rowStart3 = randomInt(row3Min, row3Max + 1);

  // Article #1 => some-article1.html
  removeSquaresInArea(col1, col1 + articleWidth, rowStart1, rowStart1 + articleHeight, columns);
  appendArticle(col1, rowStart1, 1, './some-article1.html');

  // Article #2 => some-article2.html
  removeSquaresInArea(col2, col2 + articleWidth, rowStart2, rowStart2 + articleHeight, columns);
  appendArticle(col2, rowStart2, 2, './some-article2.html');

  // Article #3 => some-article3.html
  removeSquaresInArea(col3, col3 + articleWidth, rowStart3, rowStart3 + articleHeight, columns);
  appendArticle(col3, rowStart3, 3, './some-article3.html');
}

/** Vertical layout for columns < 20 */
function createVerticalArticlesSmall(columns, rows) {
  const articleWidth = 5;
  const articleHeight = 7;
  const margin = 1;
  const separation = 3;
  const totalArticles = 3;
  const takenAreas = [];

  function getRandomColStart() {
    const minCol = 1;
    const maxCol = columns - articleWidth - 1;
    if (maxCol < minCol) {
      return -1;
    }
    return randomInt(minCol, maxCol + 1);
  }

  // columns < 11 => pinned row=4
  if (columns < 11) {
    let colStart = Math.floor((columns - articleWidth) / 2);
    if (colStart < 0) colStart = 0;
    if (colStart + articleWidth > columns) {
      colStart = columns - articleWidth;
    }
    colStart = Math.max(0, colStart);

    let rowStart = 4;
    for (let i = 0; i < totalArticles; i++) {
      if (rowStart + articleHeight > rows) {
        console.warn(`Not enough rows for article #${i + 1} at row ${rowStart}.`);
        break;
      }
      const linkTarget = `./some-article${i + 1}.html`;
      appendArticle(colStart, rowStart, i + 1, linkTarget);
      removeSquaresInArea(colStart, colStart + articleWidth, rowStart, rowStart + articleHeight, columns);
      rowStart += articleHeight + separation;
    }
    return;
  }

  // 11..19 columns => stacked vertically, random horizontal offsets
  const anchorRows = [4, 5];
  const anchorRow = anchorRows[randomInt(0, anchorRows.length)];

  let placedFirst = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    const rowStart = anchorRow + attempt;
    if (rowStart + articleHeight > rows) break;

    const colStart = getRandomColStart();
    if (colStart < 1) break;

    if (!isValidPlacement(colStart, rowStart, articleWidth, articleHeight, columns, rows, takenAreas, margin)) {
      continue;
    }
    appendArticle(colStart, rowStart, 1, './some-article1.html');
    removeSquaresInArea(colStart, colStart + articleWidth, rowStart, rowStart + articleHeight, columns);

    takenAreas.push({
      colStart,
      colEnd: colStart + articleWidth,
      rowStart,
      rowEnd: rowStart + articleHeight
    });

    placedFirst = true;
    break;
  }

  if (!placedFirst) {
    console.warn('Could not place first vertical article (columns 11–19).');
    return;
  }

  let lastArea = takenAreas[takenAreas.length - 1];
  for (let i = 0; i < totalArticles - 1; i++) {
    let placed = false;
    const rowStart = lastArea.rowEnd + separation;
    if (rowStart + articleHeight > rows) {
      console.warn(`Not enough vertical space for article #${i + 2}`);
      break;
    }

    for (let attempt = 0; attempt < 50; attempt++) {
      const colStart = getRandomColStart();
      if (colStart < 1) break;

      if (!isValidPlacement(colStart, rowStart, articleWidth, articleHeight, columns, rows, takenAreas, margin)) {
        continue;
      }
      const articleIndex = i + 2;
      const linkTarget = `./some-article${articleIndex}.html`;
      appendArticle(colStart, rowStart, articleIndex, linkTarget);
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
      console.warn(`Could not place vertical article #${i + 2} (columns 11–19).`);
      break;
    }
  }
}

/** Check if a placement is valid */
function isValidPlacement(colStart, rowStart, w, h, columns, rows, takenAreas, margin) {
  const colEnd = colStart + w;
  const rowEnd = rowStart + h;
  if (colEnd > columns || rowEnd > rows) return false;
  if (rowStart < 2) return false;

  const intersectsRow2 = (rowStart <= 2 && rowEnd > 2);
  const intersectsCols0to5 = (colStart < 6);
  if (intersectsRow2 && intersectsCols0to5) return false;

  return !overlapsAnyAreaWithMargin(colStart, colEnd, rowStart, rowEnd, takenAreas, margin, columns, rows);
}

function overlapsAnyAreaWithMargin(colStart, colEnd, rowStart, rowEnd, takenAreas, margin, columns, rows) {
  for (const area of takenAreas) {
    let aColStart = Math.max(0, area.colStart - margin);
    let aColEnd = Math.min(columns, area.colEnd + margin);
    let aRowStart = Math.max(0, area.rowStart - margin);
    let aRowEnd = Math.min(rows, area.rowEnd + margin);

    const horizontalOverlap = (colStart < aColEnd) && (colEnd > aColStart);
    const verticalOverlap = (rowStart < aRowEnd) && (rowEnd > aRowStart);
    if (horizontalOverlap && verticalOverlap) {
      return true;
    }
  }
  return false;
}

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

/**
 * Insert the 5×7 bounding box for the article,
 * and fetch custom text from articleTexts[articleIndex].
 */
function appendArticle(colStart, rowStart, articleIndex, linkHref) {
  const articleWidth = 5;
  const articleHeight = 7;

  // The anchor covers 5 columns × 7 rows in the main grid
  const articleLink = document.createElement('a');
  articleLink.href = linkHref || '#';
  articleLink.classList.add('article-link');

  // Position in the parent grid
  articleLink.style.gridColumn = `${colStart + 1} / ${colStart + 1 + articleWidth}`;
  articleLink.style.gridRow = `${rowStart + 1} / ${rowStart + 1 + articleHeight}`;

  // Top 5×5 => .article-image
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('article-image');

  // Insert your image
  const imgElement = document.createElement('img');
  imgElement.src = `./img_article${articleIndex}.png`;
  imgElement.style.width = '100%';
  imgElement.style.height = '100%';
  imgElement.style.objectFit = 'cover';
  imageDiv.appendChild(imgElement);

  // Bottom 3×2 => .article-text
  const textDiv = document.createElement('div');
  textDiv.classList.add('article-text');

  // ====== 2) Grab the text from our articleTexts object ======
  // If the index doesn't exist, fallback to a default string
  const customText = articleTexts[articleIndex] || `Article #${articleIndex}: (No text set)`;
  textDiv.textContent = customText;

  // Add them to the link
  articleLink.appendChild(imageDiv);
  articleLink.appendChild(textDiv);

  // Add link to the container
  container.appendChild(articleLink);
}

/** Utility: random integer in [min, max). */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/** Utility: style big letters (s, a, n, d, b, o, x). */
function styleBigLetter(elem, size) {
  elem.style.color = '#00AEEF';
  elem.style.textAlign = 'center';
  elem.style.fontSize = '33px';
  elem.style.lineHeight = `${size}px`;
}

/* ----- Custom Cursor Functionality ----- */

document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.custom-cursor');
  const grid = document.querySelector('.grid-container');

  if (!cursor || !grid) {
    console.warn('Custom cursor or grid container not found.');
    return;
  }

  // Function to update cursor position
  const moveCursor = (e) => {
    const gridRect = grid.getBoundingClientRect();
    const isInsideGrid = (
      e.clientX >= gridRect.left &&
      e.clientX <= gridRect.right &&
      e.clientY >= gridRect.top &&
      e.clientY <= gridRect.bottom
    );

    if (isInsideGrid) {
      cursor.style.display = 'block';
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    } else {
      cursor.style.display = 'none';
    }
  };

  // Attach mousemove event to document
  document.addEventListener('mousemove', moveCursor);

  // Select all article links
  const articleLinks = document.querySelectorAll('.article-link');

  // Function to enlarge cursor
  const enlargeCursor = () => {
    cursor.classList.add('enlarged');
  };

  // Function to reset cursor size
  const resetCursor = () => {
    cursor.classList.remove('enlarged');
  };

  // Attach hover events to each article link
  articleLinks.forEach(link => {
    link.addEventListener('mouseenter', enlargeCursor);
    link.addEventListener('mouseleave', resetCursor);
  });

  // Hide default cursor when inside the grid
  grid.addEventListener('mouseenter', () => {
    document.body.style.cursor = 'none';
  });

  grid.addEventListener('mouseleave', () => {
    document.body.style.cursor = 'default';
  });
});

