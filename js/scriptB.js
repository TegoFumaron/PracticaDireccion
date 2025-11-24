// =====================
// MODO B – ADELANTAMIENTO
// =====================

const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

const mirrorLeft = document.querySelector(".mirror-left");
const mirrorCenter = document.querySelector(".mirror-center");
const mirrorRight = document.querySelector(".mirror-right");

const triangle = document.querySelector(".center-shape");
const header = document.querySelector(".training-header p");

let phase = 1; // 1 = ir al carril izquierdo, 2 = volver al carril derecho
let expectedDirection = null;
let sequenceRunning = false;
let timeoutList = [];

// UTILIDAD
function clearTimeouts() {
  timeoutList.forEach(t => clearTimeout(t));
  timeoutList = [];
}

function resetAll() {
  clearTimeouts();
  sequenceRunning = false;

  arrowLeft.classList.remove("blink", "error");
  arrowRight.classList.remove("blink", "error");

  [mirrorLeft, mirrorCenter, mirrorRight].forEach(m => {
    m.classList.remove("highlight", "step-1", "step-2", "step-3");
  });

  triangle.style.background = "#000";
}

// NUEVA INSTRUCCIÓN
function newInstruction() {
  resetAll();

  if (phase === 1) {
    expectedDirection = "left";
    header.textContent = "Fase 1: Adelantar → Gira a la IZQUIERDA (Q)";
  } else {
    expectedDirection = "right";
    header.textContent = "Fase 2: Volver al carril → Gira a la DERECHA (E)";
  }
}

// SECUENCIA DE ESPEJOS (semáforo)
function startSequence(direction) {
  sequenceRunning = true;
  resetAll();

  const arrow = direction === "left" ? arrowLeft : arrowRight;
  arrow.classList.add("blink");

  let order;

  if (direction === "left") {
    order = [mirrorLeft, mirrorCenter, mirrorRight];
  } else {
    order = [mirrorRight, mirrorCenter, mirrorLeft];
  }

  // semáforo 1 → esmeralda
  timeoutList.push(setTimeout(() => {
    order[0].classList.add("highlight", "step-1");
  }, 900));

  // semáforo 2 → amarillo
  timeoutList.push(setTimeout(() => {
    order[1].classList.add("highlight", "step-2");
  }, 2400));

  // semáforo 3 → verde
  timeoutList.push(setTimeout(() => {
    order[2].classList.add("highlight", "step-3");
  }, 4000));

  // finalizar fase
  timeoutList.push(setTimeout(() => {
    phase = phase === 1 ? 2 : 1;
    newInstruction();
  }, 5500));
}

// ERROR
function showError(key) {
  triangle.style.background = "red";

  if (key === "q") arrowLeft.classList.add("error");
  if (key === "e") arrowRight.classList.add("error");

  setTimeout(() => {
    newInstruction();
  }, 900);
}

// TECLAS
document.addEventListener("keydown", (e) => {
  if (sequenceRunning) return;

  const key = e.key.toLowerCase();
  if (key !== "q" && key !== "e") return;

  if (key === "q" && expectedDirection === "left") {
    startSequence("left");
  } else if (key === "e" && expectedDirection === "right") {
    startSequence("right");
  } else {
    showError(key);
  }
});

// ====== CLICK EN FLECHAS ======
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


// INICIO
newInstruction();
