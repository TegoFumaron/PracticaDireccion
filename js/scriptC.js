/* ================================
   VARIABLES Y ELEMENTOS
================================ */
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

const mirrorLeft = document.querySelector(".mirror-left");
const mirrorCenter = document.querySelector(".mirror-center");
const mirrorRight = document.querySelector(".mirror-right");

const triangle = document.querySelector(".center-shape");
const header = document.querySelector(".training-header p");

let expectedDirection = null;     // left o right
let currentSequence = [];         // secuencia de espejos activa
let sequenceRunning = false;
let timeoutList = [];

/* ================================
   SECUENCIAS POSIBLES (A y B)
================================ */

// MODO A — Giro final: contrario → centro → propio
const seqA_left  = [mirrorRight, mirrorCenter, mirrorLeft];
const seqA_right = [mirrorLeft,  mirrorCenter, mirrorRight];

// MODO B — Primer movimiento: propio → centro → contrario
const seqB_left  = [mirrorLeft,  mirrorCenter, mirrorRight];
const seqB_right = [mirrorRight, mirrorCenter, mirrorLeft];

/* ================================
   TIPOS DE INSTRUCCIÓN
================================ */

const instructions = [
  { text: "Gira a la derecha", dir: "right", type: "A" },
  { text: "Gira a la izquierda", dir: "left", type: "A" },
  { text: "Intermitente derecha", dir: "right", type: "B" },
  { text: "Intermitente izquierda", dir: "left", type: "B" }
];

/* ================================
   UTILIDADES
================================ */

function clearAllTimeouts() {
  timeoutList.forEach(t => clearTimeout(t));
  timeoutList = [];
}

function resetAll() {
  clearAllTimeouts();
  sequenceRunning = false;

  arrowLeft.classList.remove("blink", "error");
  arrowRight.classList.remove("blink", "error");

  [mirrorLeft, mirrorCenter, mirrorRight].forEach(m => {
    m.classList.remove("highlight", "step-1", "step-2", "step-3");
  });

  triangle.style.background = "#2a2929";
}

/* ================================
   NUEVA INSTRUCCIÓN ALEATORIA
================================ */

function newInstruction() {
  resetAll();

  // Selección completamente aleatoria
  const inst = instructions[Math.floor(Math.random() * instructions.length)];

  expectedDirection = inst.dir;
  header.textContent = inst.text;

  // Selección de secuencia según A o B
  if (inst.type === "A") {
    currentSequence = inst.dir === "left" ? seqA_left : seqA_right;
  } else {
    currentSequence = inst.dir === "left" ? seqB_left : seqB_right;
  }
}

/* ================================
   EJECUCIÓN DE LA SECUENCIA
================================ */

function startSequence(direction) {
  sequenceRunning = true;
  resetAll();

  const arrow = direction === "left" ? arrowLeft : arrowRight;
  arrow.classList.add("blink");

  // PASO 1 (espejo 1)
  timeoutList.push(setTimeout(() => {
    currentSequence[0].classList.add("highlight", "step-1");
  }, 1000));

  // PASO 2 (espejo 2)
  timeoutList.push(setTimeout(() => {
    currentSequence[1].classList.add("highlight", "step-2");
  }, 2500));

  // PASO 3 (espejo 3)
  timeoutList.push(setTimeout(() => {
    currentSequence[2].classList.add("highlight", "step-3");
  }, 4000));

  // Reinicio de instrucción
  timeoutList.push(setTimeout(() => {
    newInstruction();
  }, 5500));
}

/* ================================
   ERROR
================================ */

function showError(key) {
  triangle.style.background = "red";

  if (key === "q") arrowLeft.classList.add("error");
  if (key === "e") arrowRight.classList.add("error");

  setTimeout(() => newInstruction(), 900);
}

/* ================================
   TECLADO
================================ */

document.addEventListener("keydown", e => {
  if (sequenceRunning) return;

  const key = e.key.toLowerCase();
  if (key !== "q" && key !== "e") return;

  if (key === "q" && expectedDirection === "left") startSequence("left");
  else if (key === "e" && expectedDirection === "right") startSequence("right");
  else showError(key);
});

/* ================================
   CLICK EN FLECHAS
================================ */

arrowLeft.addEventListener("click", () => {
  if (!sequenceRunning) {
    if (expectedDirection === "left") startSequence("left");
    else showError("q");
  }
});

arrowRight.addEventListener("click", () => {
  if (!sequenceRunning) {
    if (expectedDirection === "right") startSequence("right");
    else showError("e");
  }
});

/* ================================
   INICIO
================================ */

newInstruction();
