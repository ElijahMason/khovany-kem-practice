// Empty on purpose. A mailto link is added only when this is an address.
const CONTACT_EMAIL = "";

(function () {
  const toggle = document.querySelector("[data-stations-toggle]");
  const stations = document.querySelector("[data-stations]");

  if (toggle && stations) {
    toggle.addEventListener("click", function () {
      const open = stations.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const first = stations.querySelector("a");
        if (first) first.focus();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && stations.classList.contains("is-open")) {
        stations.classList.remove("is-open");
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
    const name = String(data.get("name") || "").trim();
    const work = String(data.get("work") || "").trim();
    const decision = String(data.get("decision") || "").trim();
    const blockage = String(data.get("blockage") || "").trim();
    const text = [
      "Brief for Khovany Kem",
      "A process you can walk.",
      "",
      "Name: " + name,
      "Work: " + work,
      "Decision needed: " + decision,
      "In the way: " + blockage
    ].join("\n");

    const out = document.querySelector("[data-brief-out]");
    const shown = document.querySelector("[data-brief-text]");
    const status = document.querySelector("[data-brief-status]");
    const mail = document.querySelector("[data-brief-mail]");
    shown.textContent = text;
    out.hidden = false;

    if (mail) {
      mail.replaceChildren();
      const address = CONTACT_EMAIL.trim();
      if (address && address.indexOf("@") !== -1) {
        const link = document.createElement("a");
        link.href = "mailto:" + address
          + "?subject=" + encodeURIComponent("Brief for Khovany Kem")
          + "&body=" + encodeURIComponent(text);
        link.textContent = "Send this brief";
        mail.appendChild(link);
      }
    }

    const finish = function (copied) {
      status.textContent = copied
        ? "Copied. The same words are below."
        : "The brief is below. Select it and copy it from this block.";
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
