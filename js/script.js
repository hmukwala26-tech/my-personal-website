/* ICT251 Activity 3 - js/script.js
   Works with the existing page: it finds the elements already in index.html
   (contact form, photo figures, learning section) and builds the extra
   controls it needs (theme button, gallery buttons, calculator, preview).

   Features:
   1. Contact form validation and preview (compulsory)
   2. Gallery viewer (Previous / Next)
   3. Theme switch (light / dark)
   4. Study hours calculator
*/

/* ---------- Helpers ---------- */

// Shortcut for getting an element by its id.
function $(id) {
  return document.getElementById(id);
}

// Creates an element with attributes and optional text (textContent only).
function make(tag, attrs, text) {
  const el = document.createElement(tag);
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  if (text) el.textContent = text;
  return el;
}

// Returns true if the email has a sensible format, e.g. name@example.com.
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Shows an error message under a field and marks the field as invalid.
function showFieldError(input, errorBox, message) {
  errorBox.textContent = message;
  input.setAttribute("aria-invalid", "true");
}

// Clears the error message and invalid state of a field.
function clearFieldError(input, errorBox) {
  errorBox.textContent = "";
  input.removeAttribute("aria-invalid");
}

// Finds (or creates) the error message span that sits under an input.
function ensureErrorSpan(input) {
  const id = input.id + "-error";
  let span = $(id);
  if (!span) {
    span = make("span", { id: id, class: "error-text" });
    input.insertAdjacentElement("afterend", span);
  }
  return span;
}

/* ---------- Styles for the new controls ---------- */

// Adds CSS for the new controls and the dark theme, unless styles.css
// already provides them (it does if it defines the --bg variable).
function addFallbackStyles() {
  const hasThemeCss = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() !== "";
  if (hasThemeCss || $("js-styles")) return;

  const css = `
    :focus-visible { outline: 3px solid #ffb703; outline-offset: 2px; }
    button:disabled { background-color: #6b7280; cursor: not-allowed; }
    button { margin-right: 5px; }
    #theme-toggle { margin-top: 10px; border: 2px solid white; background-color: rgba(0,0,0,0.35); }
    #theme-toggle:hover { background-color: white; color: #182848; }
    .error-text { display: block; color: #b00020; font-size: 0.9rem; min-height: 1.2em; }
    .feedback { margin-top: 15px; font-weight: bold; }
    .feedback.error { color: #b00020; }
    .feedback.success { color: #146c2e; }
    input[aria-invalid="true"], textarea[aria-invalid="true"] { border: 2px solid #b00020; }
    #preview { margin-top: 20px; padding: 15px 20px; background-color: #f8f9ff; border: 2px solid #4b6cb7; border-radius: 8px; overflow-wrap: anywhere; }
    #preview[hidden], figure[hidden] { display: none; }
    #preview h3 { margin-top: 0; }
    .calculator { margin-top: 25px; }
    .photo-gallery.gallery-viewer { justify-content: center; }
    .photo-gallery.gallery-viewer figure { width: 100%; max-width: 500px; }
    #photo-counter { text-align: center; margin-bottom: 0; }
    .gallery-controls { display: flex; justify-content: center; gap: 15px; }

    :root[data-theme="dark"] body { background-color: #121212; color: #eeeeee; }
    :root[data-theme="dark"] .content-section { background-color: #1e1e1e; border-color: #3a3a3a; }
    :root[data-theme="dark"] .content-section h2,
    :root[data-theme="dark"] .content-section h3 { color: #a9bff5; }
    :root[data-theme="dark"] .content-section a { color: #a9bff5; }
    :root[data-theme="dark"] nav, :root[data-theme="dark"] footer { background-color: #0b0b0b; }
    :root[data-theme="dark"] form, :root[data-theme="dark"] #preview { background-color: #252b3a; }
    :root[data-theme="dark"] input, :root[data-theme="dark"] select, :root[data-theme="dark"] textarea {
      background-color: #14181f; color: #eeeeee; border-color: #6b7280; }
    :root[data-theme="dark"] th { background-color: #2c3e75; }
    :root[data-theme="dark"] th, :root[data-theme="dark"] td { border-color: #555555; }
    :root[data-theme="dark"] button { background-color: #4b6cb7; }
    :root[data-theme="dark"] button:hover { background-color: #3a56a0; }
    :root[data-theme="dark"] button:disabled { background-color: #6b7280; }
    :root[data-theme="dark"] .error-text, :root[data-theme="dark"] .feedback.error { color: #ff8a80; }
    :root[data-theme="dark"] .feedback.success { color: #7ee2a0; }
  `;
  const style = make("style", { id: "js-styles" });
  style.textContent = css;
  document.head.appendChild(style);
}

/* ---------- Feature 1: Contact form validation and preview ---------- */

// Builds the hidden preview box that shows validated form data.
function buildPreview(form) {
  const box = make("div", { id: "preview", hidden: "" });
  box.appendChild(make("h3", {}, "Preview (validated locally)"));
  const rows = [["Name: ", "preview-name"], ["Email: ", "preview-email"], ["Message: ", "preview-message"]];
  rows.forEach(function (row) {
    const p = document.createElement("p");
    p.appendChild(make("strong", {}, row[0]));
    p.appendChild(make("span", { id: row[1] }));
    box.appendChild(p);
  });
  form.insertAdjacentElement("afterend", box);
  return box;
}

// Sets up validation and the local preview for the contact form.
function setupContactForm() {
  const form = $("contact-form") || document.querySelector("#contact form");
  if (!form) return;

  form.id = "contact-form";
  form.noValidate = true; // we show our own messages

  const nameInput = $("name");
  const emailInput = $("email");
  const messageInput = $("message");
  if (!nameInput || !emailInput || !messageInput) return;

  // Label the form as a demonstration (required by the activity).
  if (!$("demo-note")) {
    const note = make("p", { id: "demo-note" });
    note.appendChild(make("strong", {}, "Browser demonstration only \u2014 no message is sent."));
    form.insertAdjacentElement("beforebegin", note);
  }

  // Buttons: Preview (submit) and Clear (reset).
  let submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) {
    submitBtn = make("button", { type: "submit" }, "Preview");
    form.appendChild(submitBtn);
  }
  submitBtn.textContent = "Preview";
  if (!form.querySelector('button[type="reset"]')) {
    submitBtn.insertAdjacentElement("afterend", make("button", { type: "reset" }, "Clear"));
  }

  const nameError = ensureErrorSpan(nameInput);
  const emailError = ensureErrorSpan(emailInput);
  const messageError = ensureErrorSpan(messageInput);

  let feedback = $("form-feedback");
  if (!feedback) {
    feedback = make("p", { id: "form-feedback", class: "feedback", role: "status" });
    form.appendChild(feedback);
  }

  const preview = $("preview") || buildPreview(form);

  // Validates all three fields and returns true only if all are valid.
  function validateForm() {
    let valid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (name === "") {
      showFieldError(nameInput, nameError, "Please enter your name (spaces only is not allowed).");
      valid = false;
    } else {
      clearFieldError(nameInput, nameError);
    }

    if (email === "") {
      showFieldError(emailInput, emailError, "Please enter your email address.");
      valid = false;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, emailError, "Please enter a valid email, e.g. name@example.com.");
      valid = false;
    } else {
      clearFieldError(emailInput, emailError);
    }

    if (message === "") {
      showFieldError(messageInput, messageError, "Please enter a message (spaces only is not allowed).");
      valid = false;
    } else {
      clearFieldError(messageInput, messageError);
    }

    return valid;
  }

  // On submit: validate, then show a local preview (nothing is sent).
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // keep everything local, no page reload

    if (!validateForm()) {
      feedback.textContent = "Please fix the errors above and try again.";
      feedback.className = "feedback error";
      preview.hidden = true;
      return;
    }

    feedback.textContent = "Form data validated successfully. This is a browser demonstration only; no message was sent.";
    feedback.className = "feedback success";

    // textContent is used so user text is never treated as HTML.
    $("preview-name").textContent = nameInput.value.trim();
    $("preview-email").textContent = emailInput.value.trim();
    $("preview-message").textContent = messageInput.value.trim();
    preview.hidden = false;
  });

  // Clear errors and preview when the form is reset.
  form.addEventListener("reset", function () {
    clearFieldError(nameInput, nameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(messageInput, messageError);
    feedback.textContent = "";
    feedback.className = "feedback";
    preview.hidden = true;
  });
}

/* ---------- Feature 2: Gallery viewer ---------- */

// Shows one photo at a time with Previous / Next buttons.
function setupGallery() {
  const figures = Array.prototype.slice.call(document.querySelectorAll("#photos figure"));
  if (figures.length < 2) return;

  const container = figures[0].parentElement;
  container.classList.add("gallery-viewer");

  const counter = make("p", { id: "photo-counter", role: "status" });
  const controls = make("div", { class: "gallery-controls" });
  const prevBtn = make("button", { id: "prev-photo", type: "button" }, "Previous");
  const nextBtn = make("button", { id: "next-photo", type: "button" }, "Next");
  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  container.insertAdjacentElement("afterend", counter);
  counter.insertAdjacentElement("afterend", controls);

  let current = 0;

  // Shows the figure at the given index and updates counter and buttons.
  function showPhoto(index) {
    current = index;
    figures.forEach(function (fig, i) {
      fig.hidden = i !== current;
    });
    counter.textContent = "Photo " + (current + 1) + " of " + figures.length;
    // First and last photo: disable the button that cannot go further.
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === figures.length - 1;
  }

  prevBtn.addEventListener("click", function () {
    if (current > 0) showPhoto(current - 1);
  });

  nextBtn.addEventListener("click", function () {
    if (current < figures.length - 1) showPhoto(current + 1);
  });

  showPhoto(0);
}

/* ---------- Feature 3: Theme switch ---------- */

// Adds a light / dark theme button to the header.
function setupThemeSwitch() {
  let button = $("theme-toggle");
  if (!button) {
    const header = document.querySelector("header");
    if (!header) return;
    button = make("button", { id: "theme-toggle", type: "button", "aria-pressed": "false" });
    header.appendChild(button);
  }

  // Applies a theme ("light" or "dark") and updates the button label.
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    button.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }

  // Restore the saved preference if there is one (optional feature).
  let saved = "light";
  try {
    saved = localStorage.getItem("theme") === "dark" ? "dark" : "light";
  } catch (e) {
    // Storage may be unavailable; fall back to light.
  }
  applyTheme(saved);

  button.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // Ignore storage errors.
    }
  });
}

/* ---------- Feature 4: Study hours calculator ---------- */

// Builds the calculator form inside the Learning Plan section.
function buildCalculator() {
  const section = $("learning");
  if (!section) return null;

  const form = make("form", { id: "hours-form", class: "calculator", novalidate: "" });
  form.appendChild(make("h3", {}, "Study Hours Calculator"));
  form.appendChild(make("label", { for: "hours-per-day" }, "Planned hours per day:"));
  form.appendChild(make("input", { type: "text", id: "hours-per-day", name: "hours-per-day", inputmode: "decimal" }));
  form.appendChild(make("label", { for: "days-per-week" }, "Days per week (1 to 7):"));
  form.appendChild(make("input", { type: "text", id: "days-per-week", name: "days-per-week", inputmode: "numeric" }));
  form.appendChild(make("button", { type: "submit" }, "Calculate"));
  form.appendChild(make("p", { id: "hours-result", class: "feedback", role: "status" }));
  section.appendChild(form);
  return form;
}

// Validates hours and days and shows the weekly total or an error message.
function setupHoursCalculator() {
  const form = $("hours-form") || buildCalculator();
  if (!form) return;

  const hoursInput = $("hours-per-day");
  const daysInput = $("days-per-week");
  const result = $("hours-result");

  // Shows an error message in the result area.
  function showError(message) {
    result.textContent = message;
    result.className = "feedback error";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const hoursText = hoursInput.value.trim();
    const daysText = daysInput.value.trim();

    // Blank check first (Number("") would wrongly give 0).
    if (hoursText === "" || daysText === "") {
      showError("Please enter both hours per day and days per week.");
      return;
    }

    const hours = Number(hoursText);
    const days = Number(daysText);

    if (Number.isNaN(hours) || Number.isNaN(days)) {
      showError("Please enter numbers only.");
      return;
    }
    if (hours < 0) {
      showError("Hours per day cannot be negative.");
      return;
    }
    if (hours > 24) {
      showError("Hours per day cannot be more than 24.");
      return;
    }
    if (!Number.isInteger(days) || days < 1 || days > 7) {
      showError("Days per week must be a whole number from 1 to 7.");
      return;
    }

    const total = hours * days;
    result.textContent = "You plan to study " + total + " hours per week (" + hours + " hours x " + days + " days).";
    result.className = "feedback success";
  });
}

/* ---------- Start everything once the page is ready ---------- */

// Runs all the features (waits for the page if the script loaded early).
function init() {
  addFallbackStyles();
  setupThemeSwitch();
  setupContactForm();
  setupGallery();
  setupHoursCalculator();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
