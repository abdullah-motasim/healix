/* Healix — minimal vanilla JS
   - Site contact config (set once, fills every page)
   - Mobile nav toggle
   - Footer year
   - Contact form -> Web3Forms submission with confirmation state
   No dependencies. */
(function () {
  "use strict";

  /* ============================================================
     SITE CONFIG — edit these values once.
     They apply automatically on every page.

     phone / email   : fill in [data-phone] / [data-email] spots.
                       Leave "" to keep the placeholder text.
     formAccessKey   : your Web3Forms access key. Get a free key at
                       https://web3forms.com (just enter your email).
                       While this is "", the contact form only shows
                       the confirmation state and does NOT send email.
     ============================================================ */
  var SITE = {
    phone: "",
    email: "hello@healix.example",
    formAccessKey: ""   // e.g. "a1b2c3d4-....." from web3forms.com
  };

  var WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

  // ---- Fill phone everywhere ----
  if (SITE.phone) {
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      el.textContent = SITE.phone;
    });
  }

  // ---- Fill email everywhere ----
  if (SITE.email) {
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.textContent = SITE.email;
      if (el.tagName === "A") {
        el.setAttribute("href", "mailto:" + SITE.email);
      }
    });
  }

  // ---- Footer year ----
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  // ---- Contact form ----
  var form = document.getElementById("booking-form");
  var confirmBox = document.getElementById("form-confirm");
  var errorBox = document.getElementById("form-error");
  if (!form || !confirmBox) {
    return;
  }

  function showError(msg) {
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.hidden = false;
    }
  }

  function clearError() {
    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = "";
    }
  }

  function showConfirmation() {
    var nameField = form.querySelector("#name");
    var name = nameField && nameField.value ? nameField.value.trim() : "";
    var nameSpan = document.getElementById("confirm-name");
    if (nameSpan) {
      nameSpan.textContent = name ? ", " + name : "";
    }
    form.hidden = true;
    confirmBox.hidden = false;
    confirmBox.setAttribute("tabindex", "-1");
    confirmBox.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // No key configured yet -> keep the stub behavior (no send).
    if (!SITE.formAccessKey) {
      showConfirmation();
      return;
    }

    // Build the payload from the form fields.
    var formData = new FormData(form);
    var payload = {};
    formData.forEach(function (value, key) {
      payload[key] = value;
    });
    payload.access_key = SITE.formAccessKey;
    payload.subject = "New consult request from the Healix website";
    payload.from_name = "Healix website";

    var submitBtn = form.querySelector("button[type='submit']");
    var originalText = submitBtn ? submitBtn.textContent : "Send";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        if (data && data.success) {
          showConfirmation();
        } else {
          showError("Something went wrong sending your message. Please email us directly at " + SITE.email + ".");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
      })
      .catch(function () {
        showError("We couldn't reach the server. Please check your connection, or email us directly at " + SITE.email + ".");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
  });
})();
