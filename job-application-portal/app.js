/*
 * Job Application Portal — front-end demo.
 *
 * SECURITY NOTE: This is a client-side demonstration only. The "authentication"
 * below compares against a hard-coded demo credential in the browser, which is
 * NOT secure and must never be used for a real login. In production, auth must
 * happen server-side over HTTPS with hashed passwords (Argon2id/bcrypt),
 * sessions/tokens, rate limiting and MFA. Submitted applications are kept in
 * memory for this page session only and are never transmitted anywhere.
 */
(function () {
  "use strict";

  // Demo-only credential. Replace with real server-side auth before any real use.
  var DEMO_USER = "applicant";
  var DEMO_PASS = "Demo-Pass-2026";

  var applications = []; // in-memory only; cleared on reload

  // --- Elements ---
  var views = {
    login: document.getElementById("loginView"),
    app: document.getElementById("appView"),
    success: document.getElementById("successView")
  };
  var loginForm = document.getElementById("loginForm");
  var loginError = document.getElementById("loginError");
  var appForm = document.getElementById("applicationForm");
  var formError = document.getElementById("formError");
  var logoutBtn = document.getElementById("logoutBtn");
  var appList = document.getElementById("applicationList");
  var emptyState = document.getElementById("emptyState");
  var successDetail = document.getElementById("successDetail");

  // --- View switching ---
  function showView(name) {
    Object.keys(views).forEach(function (key) {
      views[key].hidden = key !== name;
    });
    logoutBtn.hidden = name === "login";
    // Move focus to the new view's heading region for screen-reader users.
    var main = document.getElementById("main");
    main.focus();
  }

  // --- Helpers for inline errors ---
  function setFieldError(input, errEl, message) {
    var field = input.closest(".field");
    if (message) {
      errEl.textContent = message;
      errEl.hidden = false;
      input.setAttribute("aria-invalid", "true");
      if (field) field.classList.add("field--invalid");
    } else {
      errEl.textContent = "";
      errEl.hidden = true;
      input.removeAttribute("aria-invalid");
      if (field) field.classList.remove("field--invalid");
    }
  }

  function showSummary(el, message) {
    if (message) {
      el.textContent = message;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ============ LOGIN ============
  var togglePassword = document.getElementById("togglePassword");
  var passwordInput = document.getElementById("password");
  togglePassword.addEventListener("click", function () {
    var show = passwordInput.type === "password";
    passwordInput.type = show ? "text" : "password";
    togglePassword.textContent = show ? "Hide" : "Show";
    togglePassword.setAttribute("aria-pressed", String(show));
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var username = document.getElementById("username");
    var usernameErr = document.getElementById("usernameErr");
    var passwordErr = document.getElementById("passwordErr");

    var firstInvalid = null;
    showSummary(loginError, "");

    if (!username.value.trim()) {
      setFieldError(username, usernameErr, "Enter your username.");
      firstInvalid = firstInvalid || username;
    } else {
      setFieldError(username, usernameErr, "");
    }
    if (!passwordInput.value) {
      setFieldError(passwordInput, passwordErr, "Enter your password.");
      firstInvalid = firstInvalid || passwordInput;
    } else {
      setFieldError(passwordInput, passwordErr, "");
    }

    if (firstInvalid) { firstInvalid.focus(); return; }

    // Generic failure message — never reveals which field was wrong.
    if (username.value.trim() !== DEMO_USER || passwordInput.value !== DEMO_PASS) {
      showSummary(loginError, "The username or password is incorrect. Try the demo credentials shown above.");
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    loginForm.reset();
    setFieldError(username, usernameErr, "");
    setFieldError(passwordInput, passwordErr, "");
    showView("app");
  });

  // ============ LOGOUT ============
  logoutBtn.addEventListener("click", function () {
    showView("login");
    document.getElementById("username").focus();
  });

  // ============ APPLICATION FORM ============
  function validateApplication() {
    var checks = [
      { id: "fullName", err: "fullNameErr", test: function (v) { return v.trim().length > 0; },
        msg: "Enter your full name." },
      { id: "email", err: "emailErr",
        test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
        msg: "Enter a valid email address, for example name@example.com." },
      { id: "position", err: "positionErr", test: function (v) { return v !== ""; },
        msg: "Select a position." },
      { id: "experience", err: "experienceErr",
        test: function (v) { var n = Number(v); return v !== "" && !isNaN(n) && n >= 0 && n <= 60; },
        msg: "Enter years of experience between 0 and 60." },
      { id: "consent", err: "consentErr", test: null, msg: "You must agree before submitting." }
    ];

    var firstInvalid = null;
    checks.forEach(function (c) {
      var input = document.getElementById(c.id);
      var errEl = document.getElementById(c.err);
      var ok;
      if (c.id === "consent") {
        ok = input.checked;
      } else {
        ok = c.test(input.value);
      }
      setFieldError(input, errEl, ok ? "" : c.msg);
      if (!ok && !firstInvalid) firstInvalid = input;
    });
    return firstInvalid;
  }

  appForm.addEventListener("submit", function (e) {
    e.preventDefault();
    showSummary(formError, "");
    var firstInvalid = validateApplication();

    if (firstInvalid) {
      showSummary(formError, "Please fix the highlighted fields and submit again.");
      firstInvalid.focus();
      return;
    }

    var record = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      position: document.getElementById("position").value,
      experience: document.getElementById("experience").value,
      start: document.getElementById("start").value,
      cover: document.getElementById("cover").value.trim(),
      submittedAt: new Date()
    };
    applications.push(record);
    renderList();

    appForm.reset();
    successDetail.textContent =
      "Thanks, " + record.fullName + ". Your application for " + record.position +
      " has been registered.";
    showView("success");
  });

  // Clear a field's error as the user fixes it (on input/change).
  appForm.addEventListener("input", function (e) {
    var t = e.target;
    if (t.getAttribute("aria-invalid") === "true") {
      var errEl = document.getElementById(t.id + "Err");
      if (errEl) setFieldError(t, errEl, "");
    }
  });

  document.getElementById("anotherBtn").addEventListener("click", function () {
    showView("app");
    document.getElementById("fullName").focus();
  });

  // ============ LIST RENDERING ============
  function renderList() {
    appList.innerHTML = "";
    emptyState.hidden = applications.length > 0;
    applications.forEach(function (a) {
      var li = document.createElement("li");
      var when = a.submittedAt.toLocaleString();
      li.innerHTML =
        '<div class="app-list__role">' + escapeHtml(a.position) + "</div>" +
        '<div class="app-list__meta">' + escapeHtml(a.fullName) + " · " +
        escapeHtml(a.email) + " · " + escapeHtml(a.experience) + " yr · " +
        escapeHtml(when) + "</div>";
      appList.appendChild(li);
    });
  }

  // ============ SECURITY NOTE ============
  document.getElementById("securityNoteLink").addEventListener("click", function (e) {
    e.preventDefault();
    window.alert(
      "Security & privacy note\n\n" +
      "This is a front-end demo. Login is checked in the browser against a demo " +
      "credential, which is not secure. Real authentication must be server-side " +
      "over HTTPS with hashed passwords, sessions and rate limiting.\n\n" +
      "Applications you submit are stored only in this browser tab's memory and " +
      "are discarded when you reload or close the page. Nothing is sent anywhere."
    );
  });

  // Start on the login view.
  showView("login");
})();
