/* =======================================
   MODO E – SIMULADOR DE EXAMEN COMPLETO
   ======================================= */

// ELEMENTOS BÁSICOS
const arrowLeft  = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

const mirrorLeft   = document.querySelector(".mirror-left");
const mirrorCenter = document.querySelector(".mirror-center");
const mirrorRight  = document.querySelector(".mirror-right");

const triangle = document.querySelector(".center-shape");
const header   = document.querySelector(".training-header p");

// ELEMENTOS DEL EXAMEN
const examStepEl    = document.getElementById("exam-step");
const examFaultsEl  = document.getElementById("exam-faults");
const examResultTitle   = document.getElementById("exam-result-title");
const examResultSummary = document.getElementById("exam-result-summary");
const examRestartBtn    = document.getElementById("exam-restart");
const examModalOverlay  = document.getElementById("exam-modal");

// CONFIG EXAMEN
const TOTAL_STEPS = 10; // nº de ejercicios por examen

// ESTADO
let currentStep = 0;
let leves = 0;
let graves = 0;

let expectedDirection = null; // "left" o "right"
let expectedType = null;      // "A" (giro final) o "B" (intermitente)
let correctSequence = [];     // [mirror, mirror, mirror]

let playerDirection = null;   // dirección señalizada por el alumno
let playerSequence  = [];     // espejos activados por el alumno

let examFinished = false;


/* ===========================
   SECUENCIAS A Y B 
   =========================== */

// A → Giro final: contrario → centro → propio
const seqA_left  = [mirrorRight, mirrorCenter, mirrorLeft];
const seqA_right = [mirrorLeft,  mirrorCenter, mirrorRight];

// B → Intermitente: propio → centro → contrario
const seqB_left  = [mirrorLeft,  mirrorCenter, mirrorRight];
const seqB_right = [mirrorRight, mirrorCenter, mirrorLeft];

/* ===========================
   INSTRUCCIONES DEL EXAMEN
   =========================== */

const instructions = [
  { text: "Gira a la derecha",        dir: "right", type: "A" },
  { text: "Gira a la izquierda",      dir: "left",  type: "A" },
  { text: "Intermitente derecha",     dir: "right", type: "B" },
  { text: "Intermitente izquierda",   dir: "left",  type: "B" },
];


/* ===========================
   RESET / UI
   =========================== */

function resetMirrors() {
  [mirrorLeft, mirrorCenter, mirrorRight].forEach(m => {
    m.classList.remove("highlight", "step-1", "step-2", "step-3");
  });
}

function resetArrows() {
  arrowLeft.classList.remove("blink", "error");
  arrowRight.classList.remove("blink", "error");
}

function fullResetVisual() {
  resetMirrors();
  resetArrows();
  triangle.style.background = "#2a2929";
}

function resetPlayer() {
  playerDirection = null;
  playerSequence = [];
}


/* ===========================
   INICIO Y NUEVA INSTRUCCIÓN
   =========================== */

function startExam() {
  currentStep = 0;
  leves = 0;
  graves = 0;
  examFinished = false;

  // Cerrar modal por si estuviera abierto
  examModalOverlay.style.display = "none";

  updateStatus();
  newInstruction();
}

function updateStatus() {
  examStepEl.textContent   = `Ejercicio: ${currentStep} / ${TOTAL_STEPS}`;
  examFaultsEl.textContent = `Leves: ${leves} | Graves: ${graves}`;
}

function newInstruction() {
  fullResetVisual();
  resetPlayer();

  if (examFinished) return;

  // Fin de examen por nº de pasos o 3 graves
  if (currentStep >= TOTAL_STEPS || graves >= 3) {
    finishExam();
    return;
  }

  currentStep++;
  updateStatus();

  // Elegir instrucción aleatoria
  const inst = instructions[Math.floor(Math.random() * instructions.length)];
  expectedDirection = inst.dir;
  expectedType      = inst.type;

  header.textContent =
    `Ejercicio ${currentStep} de ${TOTAL_STEPS} – ${inst.text} (Q/E para señalizar, 1-2-3 para espejos)`;

  // Secuencia correcta según tipo A/B y dirección
  if (expectedType === "A") {
    correctSequence = expectedDirection === "left" ? seqA_left : seqA_right;
  } else {
    correctSequence = expectedDirection === "left" ? seqB_left : seqB_right;
  }
}


/* ===========================
   MANEJO DE ENTRADAS
   =========================== */

// Señalizar dirección (Q/E o click flecha)
function setPlayerDirection(dir) {
  if (examFinished) return;

  if (!playerDirection) {
    playerDirection = dir;

    if (dir === "left") {
      arrowLeft.classList.add("blink");
      arrowRight.classList.remove("blink");
    } else {
      arrowRight.classList.add("blink");
      arrowLeft.classList.remove("blink");
    }
  }
}

// Activar espejo por número (1-2-3)
function activateMirrorByNumber(num) {
  if (examFinished) return;

  let mirror = null;
  if (num === 1) mirror = mirrorLeft;
  if (num === 2) mirror = mirrorCenter;
  if (num === 3) mirror = mirrorRight;
  if (!mirror) return;

  // Evitar seleccionar el mismo espejo dos veces
  if (playerSequence.includes(mirror)) {
    triangle.style.background = "red";
    leves++;
    updateStatus();
    setTimeout(newInstruction, 800);
    return;
  }

  const stepNumber = playerSequence.length + 1;
  mirror.classList.add("highlight", `step-${stepNumber}`);
  playerSequence.push(mirror);

  if (playerSequence.length === 3) {
    evaluateStep();
  }
}


/* ===========================
   EVALUACIÓN
   =========================== */

function evaluateStep() {
  let stepGrave = false;
  let stepLeve  = false;

  // Dirección incorrecta = grave
  if (!playerDirection) {
    stepGrave = true;
  } else if (playerDirection !== expectedDirection) {
    stepGrave = true;
  }

  // Secuencia de espejos
  let mismatches = 0;
  for (let i = 0; i < 3; i++) {
    if (playerSequence[i] !== correctSequence[i]) mismatches++;
  }

  if (mismatches === 0) {
    // perfecto
  }
  else if (mismatches === 1 && !stepGrave) {
    stepLeve = true;
  }
  else {
    stepGrave = true;
  }

  if (stepGrave) graves++;
  else if (stepLeve) leves++;

  // feedback visual
  if (stepGrave) triangle.style.background = "red";
  else if (stepLeve) triangle.style.background = "#c084f0";
  else triangle.style.background = "green";

  updateStatus();

  setTimeout(() => {
    if (graves >= 3 || currentStep >= TOTAL_STEPS) finishExam();
    else newInstruction();
  }, 1000);
}


/* ===========================
   FIN DE EXAMEN (MODAL)
   =========================== */

function finishExam() {
  examFinished = true;
  fullResetVisual();

  const puntos = leves * 1 + graves * 5;

  let estado = "APTO";
  if (graves >= 3 || puntos >= 10) estado = "NO APTO";
  else if (puntos >= 5) estado = "APTO con advertencias";

  examResultTitle.textContent = `Resultado: ${estado}`;
  examResultSummary.textContent =
    `Ejercicios completados: ${currentStep} / ${TOTAL_STEPS} · Leves: ${leves} · Graves: ${graves} · Puntos: ${puntos}`;

  // Mostrar modal
  examModalOverlay.style.display = "flex";
}


/* ===========================
   EVENTOS
   =========================== */

document.addEventListener("keydown", (e) => {
  if (examFinished) return;

  const key = e.key.toLowerCase();

  if (key === "q") setPlayerDirection("left");
  if (key === "e") setPlayerDirection("right");

  if (key === "1") activateMirrorByNumber(1);
  if (key === "2") activateMirrorByNumber(2);
  if (key === "3") activateMirrorByNumber(3);
});

// Click en flechas
arrowLeft.onclick  = () => { if (!examFinished) setPlayerDirection("left"); };
arrowRight.onclick = () => { if (!examFinished) setPlayerDirection("right"); };

// Reiniciar examen
examRestartBtn.onclick = () => {
  examModalOverlay.style.display = "none";
  startExam();
};


/* ===========================
   INICIO
   =========================== */

startExam();
