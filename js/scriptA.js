// ELEMENTOS
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

const mirrorLeft = document.querySelector(".mirror-left");
const mirrorCenter = document.querySelector(".mirror-center");
const mirrorRight = document.querySelector(".mirror-right");

const triangle = document.querySelector(".center-shape");
const header = document.querySelector(".training-header p");

// VARIABLES
let expectedDirection = null;
let sequenceRunning = false;
let timeoutList = [];

// FUNCIONES AUXILIARES
function clearTimeouts() {
  timeoutList.forEach(t => clearTimeout(t));
  timeoutList = [];
}

function resetAll() {
  clearTimeouts();
  sequenceRunning = false;

  arrowLeft.classList.remove("active", "blink", "error");
  arrowRight.classList.remove("active", "blink", "error");

  [mirrorLeft, mirrorCenter, mirrorRight].forEach(m => {
    m.classList.remove("highlight", "step-1", "step-2", "step-3");
  });

  triangle.style.background = "#000";
}

// GENERAR NUEVA INSTRUCCIÓN
function newInstruction() {
  resetAll();

  const dir = Math.random() < 0.5 ? "left" : "right";
  expectedDirection = dir;

  if (dir === "left") header.textContent = "Gira a la IZQUIERDA (tecla Q)";
  else header.textContent = "Gira a la DERECHA (tecla E)";
}

// SECUENCIA DE ESPEJOS
function startSequence(direction) {
  sequenceRunning = true;

  resetAll();

  const arrow = direction === "left" ? arrowLeft : arrowRight;
  arrow.classList.add("blink"); // intermitente verde

  if (direction === "left") {
    timeoutList.push(setTimeout(() => {
      mirrorRight.classList.add("highlight", "step-1");
    }, 900));

    timeoutList.push(setTimeout(() => {
      mirrorCenter.classList.add("highlight", "step-2");
    }, 2400));

    timeoutList.push(setTimeout(() => {
      mirrorLeft.classList.add("highlight", "step-3");
    }, 4000));

  } else {
    timeoutList.push(setTimeout(() => {
      mirrorLeft.classList.add("highlight", "step-1");
    }, 900));

    timeoutList.push(setTimeout(() => {
      mirrorCenter.classList.add("highlight", "step-2");
    }, 2400));

    timeoutList.push(setTimeout(() => {
      mirrorRight.classList.add("highlight", "step-3");
    }, 4000));
  }

  // Al terminar → reset y nueva instrucción
  timeoutList.push(setTimeout(() => {
    newInstruction();
  }, 5500));
}

// ERROR
function showError(pressedKey) {
  triangle.style.background = "red";

  // detectar cuál flecha temblar
  if (pressedKey === "q") arrowLeft.classList.add("error");
  if (pressedKey === "e") arrowRight.classList.add("error");

  setTimeout(() => {
    newInstruction();
  }, 900);
}

// EVENTO TECLAS
document.addEventListener("keydown", (e) => {
  if (sequenceRunning) return;

  const key = e.key.toLowerCase();
  if (key !== "q" && key !== "e") return;

  if (key === "q" && expectedDirection === "left") {
    startSequence("left");
  }
  else if (key === "e" && expectedDirection === "right") {
    startSequence("right");
  }
  else {
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


// INICIAR BUCLE
newInstruction();