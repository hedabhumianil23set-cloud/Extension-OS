let selectedModels = [];

/* Sidebar Toggle */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

/* Model Selection */
function toggleModel(model) {
  const btn = document.getElementById(model);

  if (selectedModels.includes(model)) {
    selectedModels = selectedModels.filter(m => m !== model);
    btn.classList.remove("active");
  } else {
    selectedModels.push(model);
    btn.classList.add("active");
  }
}

/* 🔥 BETTER RESPONSE GENERATOR */
function generateResponse(prompt, model) {
  const p = prompt.toLowerCase();

  if (p.includes("sky") && p.includes("blue")) {
    return model === "chatgpt"
      ? "The sky appears blue due to Rayleigh scattering. Shorter wavelengths like blue scatter more."
      : model === "gemini"
      ? "Think of sunlight hitting air particles — blue light spreads everywhere, making the sky look blue."
      : "Steps:\n1. Sunlight enters\n2. Blue scatters more\n3. Eyes detect blue light";
  }

  if (p.includes("code") || p.includes("javascript")) {
    return model === "chatgpt"
      ? "function greet(){ console.log('Hello World'); }"
      : model === "gemini"
      ? "let msg = 'Hello'; console.log(msg);"
      : "Steps:\n1. Write code\n2. Execute\n3. Get output";
  }

  if (p.match(/\d/)) {
    return model === "chatgpt"
      ? "Break the problem into steps and solve logically."
      : model === "gemini"
      ? "Try visualizing the numbers for easier solving."
      : "Steps:\n1. Identify values\n2. Apply formula\n3. Solve";
  }

  return model === "chatgpt"
    ? `Logical explanation for "${prompt}"`
    : model === "gemini"
    ? `Creative perspective on "${prompt}"`
    : `Structured breakdown of "${prompt}"`;
}

/* ⭐ SMART SUGGESTION SYSTEM */
function getBestModel(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes("code") || p.includes("program")) return "chatgpt";
  if (p.includes("idea") || p.includes("creative")) return "gemini";
  if (p.includes("explain") || p.includes("why") || p.includes("steps")) return "claude";

  // random fallback (so it's not always same)
  const models = ["chatgpt", "gemini", "claude"];
  return models[Math.floor(Math.random() * models.length)];
}

/* Typing Effect */
function typeText(element, text) {
  let i = 0;
  element.innerHTML = "";

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, 10);
    }
  }

  typing();
}

/* ⭐ Highlight Best Card */
function highlightBest(model) {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("best");
  });

  const el = document.getElementById(model + "-res");
  if (el) {
    el.parentElement.classList.add("best");
  }
}

/* Main Function */
function sendPrompt() {
  const prompt = document.getElementById("prompt").value;

  if (!prompt) {
    alert("Enter something...");
    return;
  }

  if (selectedModels.length === 0) {
    alert("Select at least one AI model");
    return;
  }

  selectedModels.forEach(m => {
    document.getElementById(m + "-res").innerText = "Thinking...";
  });

  setTimeout(() => {
    selectedModels.forEach(m => {
      const response = generateResponse(prompt, m);
      typeText(document.getElementById(m + "-res"), response);
    });

    /* 👉 Suggestion Logic */
    let best = getBestModel(prompt);

    // ensure suggested model is selected
    if (!selectedModels.includes(best)) {
      best = selectedModels[0];
    }

    // remove old suggestion
    const old = document.getElementById("suggestion");
    if (old) old.remove();

    // create suggestion UI
    const sug = document.createElement("div");
    sug.id = "suggestion";
    sug.innerText = "⭐ Suggestion: " + best.toUpperCase();
    sug.style.marginTop = "10px";
    sug.style.fontWeight = "bold";
    sug.style.color = "#00f5ff";

    document.querySelector(".main").appendChild(sug);

    // highlight best card
    highlightBest(best);

  }, 600);
}

/* 🔥 CONNECT BUTTONS */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("menu-btn")
    .addEventListener("click", toggleSidebar);

  document.getElementById("chatgpt")
    .addEventListener("click", () => toggleModel("chatgpt"));

  document.getElementById("gemini")
    .addEventListener("click", () => toggleModel("gemini"));

  document.getElementById("claude")
    .addEventListener("click", () => toggleModel("claude"));

  document.getElementById("generate-btn")
    .addEventListener("click", sendPrompt);
});