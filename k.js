// ===== Accessibility Tools =====
let size = 17;

function setSize(newSize) {
  size = Math.min(26, Math.max(13, newSize));
  document.documentElement.style.setProperty("--base", size + "px");
}

document.getElementById("fontUp")?.addEventListener("click", () => {
  setSize(size + 2);
});

document.getElementById("fontDown")?.addEventListener("click", () => {
  setSize(size - 2);
});

document.getElementById("contrastBtn")?.addEventListener("click", () => {
  document.body.classList.toggle("contrast");
});

// ===== Simple Notes =====
document.getElementById("simpleBtn")?.addEventListener("click", (e) => {
  const notes = document.getElementById("simpleNotes");

  notes.hidden = !notes.hidden;

  e.target.textContent = notes.hidden
    ? "Show simple notes"
    : "Hide simple notes";
});

// ===== Download Notes =====
document.getElementById("downloadBtn")?.addEventListener("click", () => {
  const text = `
ACTIVE AND PASSIVE VOICE

ACTIVE:
The subject performs the action.

PASSIVE:
The subject receives the action.

Example:
The learner wrote the essay.
The essay was written by the learner.

Steps:
1. Move the object to the front.
2. Add the correct form of "to be".
3. Use the past participle.
4. Add "by + doer" if needed.
`;

  const blob = new Blob([text], { type: "text/plain" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "active-passive-notes.txt";
  link.click();
});

// ===== Sort Activity =====
const bank = document.getElementById("bank");
const boxes = document.querySelectorAll(".sortbox");

let dragged = null;
let selected = null;

function place(chip, zone) {
  zone.appendChild(chip);
  chip.style.background = "";
}

document.querySelectorAll(".chip").forEach(chip => {

  chip.addEventListener("dragstart", () => {
    dragged = chip;
  });

  chip.addEventListener("click", (e) => {
    e.stopPropagation();

    if (selected) {
      selected.classList.remove("selected");
    }

    selected = chip;
    chip.classList.add("selected");
  });

});

[...boxes, bank].forEach(zone => {

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();

    if (dragged) {
      place(dragged, zone);
    }
  });

  zone.addEventListener("click", () => {
    if (selected) {
      place(selected, zone);
      selected.classList.remove("selected");
      selected = null;
    }
  });

});

document.getElementById("checkSort")?.addEventListener("click", () => {

  let correct = 0;
  const total = document.querySelectorAll(".chip").length;

  boxes.forEach(box => {

    box.querySelectorAll(".chip").forEach(chip => {

      const ok = chip.dataset.type === box.dataset.accept;

      chip.style.background = ok
        ? "var(--ok)"
        : "var(--bad)";

      if (ok) correct++;

    });

  });

  document.getElementById("sortFeedback").textContent =
    `${correct} of ${total} correct`;

});

document.getElementById("resetSort")?.addEventListener("click", () => {

  document.querySelectorAll(".chip").forEach(chip => {
    bank.appendChild(chip);
    chip.style.background = "";
  });

  document.getElementById("sortFeedback").textContent = "";

});

// ===== Rewrite Activity =====
const rewriteItems = [
  {
    active: "The learners clean the classroom.",
    answers: ["the classroom is cleaned by the learners."]
  },
  {
    active: "Tom broke the window.",
    answers: ["the window was broken by tom."]
  },
  {
    active: "The principal will announce the results.",
    answers: ["the results will be announced by the principal."]
  },
  {
    active: "Someone has stolen my bag.",
    answers: [
      "my bag has been stolen.",
      "my bag has been stolen by someone."
    ]
  }
];

const rewriteDiv = document.getElementById("rewrite");

rewriteItems.forEach((item, i) => {

  rewriteDiv.insertAdjacentHTML("beforeend", `
    <fieldset id="rw${i}">
      <legend>${i + 1}. ${item.active}</legend>

      <input
        id="rwIn${i}"
        type="text"
        style="width:100%;padding:.5rem;"
      >
    </fieldset>
  `);

});

function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

document.getElementById("checkRewrite")?.addEventListener("click", () => {

  let correct = 0;

  rewriteItems.forEach((item, i) => {

    const value =
      normalize(document.getElementById(`rwIn${i}`).value);

    if (item.answers.includes(value)) {
      correct++;
    }

  });

  document.getElementById("rewriteFeedback").textContent =
    `You got ${correct} of ${rewriteItems.length} correct.`;

});

// ===== Quiz =====
const answers = {
  q1: "b",
  q2: "a",
  q3: "c",
  q4: "b",
  q5: "b",
  q6: "a"
};

document.getElementById("quizForm")?.addEventListener("submit", (e) => {

  e.preventDefault();

  let score = 0;

  Object.keys(answers).forEach(question => {

    const selected =
      document.querySelector(
        `input[name="${question}"]:checked`
      );

    if (selected && selected.value === answers[question]) {
      score++;
    }

  });

  document.getElementById("quizResult").textContent =
    `Your score: ${score}/6`;

});