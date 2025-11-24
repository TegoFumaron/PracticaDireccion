/* ================================
   ELEMENTOS
================================ */
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

const mirrorLeft = document.querySelector(".mirror-left");
const mirrorCenter = document.querySelector(".mirror-center");
const mirrorRight = document.querySelector(".mirror-right");

const triangle = document.querySelector(".center-shape");
const header = document.querySelector(".training-header p");

let expectedDirection = null; 
let correctSequence = [];
let playerSequence = [];

/* ================================
   SECUENCIAS DEL CLIENTE (A y B)
================================ */

// A → Giro final: contrario → centro → propio
const seqA_left  = [mirrorRight, mirrorCenter, mirrorLeft];
const seqA_right = [mirrorLeft,  mirrorCenter, mirrorRight];

// B → Intermitente: propio → centro → contrario
const seqB_left  = [mirrorLeft,  mirrorCenter, mirrorRight];
const seqB_right = [mirrorRight, mirrorCenter, mirrorLeft];

/* ================================
   INSTRUCCIONES POSIBLES
================================ */
const instructions = [
  { text: "Gira a la derecha", dir: "right", type: "A" },
  { text: "Gira a la izquierda", dir: "left", type: "A" },
  { text: "Intermitente derecha", dir: "right", type: "B" },
  { text: "Intermitente izquierda", dir: "left", type: "B" }
];

/* ================================
   RESETEAR TODO
================================ */
function resetMirrors() {
  [mirrorLeft, mirrorCenter, mirrorRight].forEach(m => {
    m.classList.remove("highlight","step-1","step-2","step-3");
  });
}

function resetAll() {
  resetMirrors();
  triangle.style.background = "#2a2929";
  arrowLeft.classList.remove("blink","error");
  arrowRight.classList.remove("blink","error");
  playerSequence = [];
}

/* ================================
   NUEVA INSTRUCCIÓN
================================ */
function newInstruction() {
  resetAll();

  const inst = instructions[Math.floor(Math.random() * instructions.length)];
  expectedDirection = inst.dir;
  header.textContent = inst.text;

  // Activamos la flecha correcta en intermitente
  const arrow = inst.dir === "left" ? arrowLeft : arrowRight;
  arrow.classList.add("blink");

  // Determinar secuencia correcta
  if (inst.type === "A") {
    correctSequence = inst.dir === "left" ? seqA_left : seqA_right;
  } else {
    correctSequence = inst.dir === "left" ? seqB_left : seqB_right;
  }
}

/* ================================
   JUGADOR ENCIENDE ESPEJO
================================ */
function activateMirror(num) {
  let mirror = null;

  if (num === 1) mirror = mirrorLeft;
  if (num === 2) mirror = mirrorCenter;
  if (num === 3) mirror = mirrorRight;

  if (!mirror) return;

  // Evitar duplicar entrada
  if (playerSequence.includes(mirror)) {
    triangle.style.background = "red";
    mirror.classList.add("error");
    setTimeout(newInstruction, 800);
    return;
  }

  // activar visualmente
  mirror.classList.add("highlight", `step-${playerSequence.length+1}`);
  playerSequence.push(mirror);

  // si ya puso 3, validar
  if (playerSequence.length === 3) {
    validateSequence();
  }
}

/* ================================
   VALIDAR RESULTADO
================================ */
function validateSequence() {
  let ok = true;

  for (let i = 0; i < 3; i++) {
    if (playerSequence[i] !== correctSequence[i]) ok = false;
  }

  if (ok) {
    triangle.style.background = "green";
  } else {
    triangle.style.background = "red";
  }

  setTimeout(newInstruction, 1000);
}

/* ================================
   EVENTOS DEL TECLADO (1,2,3)
================================ */
document.addEventListener("keydown", (e) => {
  const k = e.key;

  if (k === "1") activateMirror(1);
  if (k === "2") activateMirror(2);
  if (k === "3") activateMirror(3);
});

/* ================================
   EMPEZAR
================================ */
newInstruction();
