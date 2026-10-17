// Empty on purpose. A mailto link is added only when this is an address.
const CONTACT_EMAIL = "";

(function () {
  const toggle = document.querySelector("[data-sheets-toggle]");
  const sheets = document.querySelector("[data-sheets]");

  if (toggle && sheets) {
    toggle.addEventListener("click", function () {
      const open = sheets.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const first = sheets.querySelector("a");
        if (first) first.focus();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && sheets.classList.contains("is-open")) {
        sheets.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  const form = document.querySelector("[data-brief]");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const text = [
      "SHEET KK-04",
      "ENGAGEMENT BRIEF",
      "Khovany Kem",
      "A process you can walk.",
      "",
      "Request owner: " + String(data.get("name") || "").trim(),
      "Work: " + String(data.get("work") || "").trim(),
      "Decision required: " + String(data.get("decision") || "").trim(),
      "In the way: " + String(data.get("blockage") || "").trim()
    ].join("\n");

    const out = document.querySelector("[data-brief-out]");
    const shown = document.querySelector("[data-brief-text]");
    const status = document.querySelector("[data-brief-status]");
    const mail = document.querySelector("[data-brief-mail]");
    shown.textContent = text;
    out.hidden = false;
    mail.replaceChildren();

    const address = CONTACT_EMAIL.trim();
    if (address && address.indexOf("@") !== -1) {
      const link = document.createElement("a");
      link.href = "mailto:" + address
        + "?subject=" + encodeURIComponent("Sheet KK-04 for Khovany Kem")
        + "&body=" + encodeURIComponent(text);
      link.textContent = "Send this brief";
      mail.appendChild(link);
    }

    const finish = function (copied) {
      status.textContent = copied
        ? "Copied. The same words are on the sheet below."
        : "The brief is on the sheet below. Select it and copy it from this block.";
      out.focus();
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        finish(true);
      }).catch(function () {
        finish(false);
      });
    } else {
      finish(false);
    }
  });
})();
