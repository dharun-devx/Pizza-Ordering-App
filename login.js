/**
 * Ember & Crust Pizzeria - Authentication & Interactive Logic
 * Handles Login, Sign-up, Password Validation, Toggles & Redirection.
 */

// ==========================================
// 1. TAB SWITCHING (Login <-> Sign Up)
// ==========================================
function switchTab(tab) {
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");
    const formLogin = document.getElementById("loginForm");
    const formSignup = document.getElementById("signupForm");

    // Clear any previous error messages
    clearAllErrors();

    if (tab === "login") {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        formLogin.classList.remove("hidden");
        formSignup.classList.add("hidden");
    } else {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        formSignup.classList.remove("hidden");
        formLogin.classList.add("hidden");
    }
}

// ==========================================
// 2. TOGGLE PASSWORD VISIBILITY
// ==========================================
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const isPassword = input.getAttribute("type") === "password";
    input.setAttribute("type", isPassword ? "text" : "password");

    // Toggle icon appearance
    if (isPassword) {
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
        btn.setAttribute("title", "Hide password");
    } else {
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
        btn.setAttribute("title", "Show password");
    }
}

// ==========================================
// 3. PASSWORD STRENGTH CHECKER
// ==========================================
function checkPasswordStrength(password) {
    const bar = document.getElementById("strength-bar");
    const label = document.getElementById("strength-label");
    if (!bar || !label) return;

    if (!password) {
        bar.style.width = "0%";
        bar.style.backgroundColor = "transparent";
        label.innerText = "Password strength";
        label.style.color = "var(--text-muted)";
        return;
    }

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 9) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
        bar.style.width = "33%";
        bar.style.backgroundColor = "#e63946";
        label.innerText = "Weak (add letters, numbers & symbols)";
        label.style.color = "#e63946";
    } else if (score === 3 || score === 4) {
        bar.style.width = "66%";
        bar.style.backgroundColor = "#f4a261";
        label.innerText = "Medium (good password)";
        label.style.color = "#d97706";
    } else {
        bar.style.width = "100%";
        bar.style.backgroundColor = "#2a9d8f";
        label.innerText = "Strong password! 💪";
        label.style.color = "#2a9d8f";
    }
}

// ==========================================
// 4. QUICK DEMO CREDENTIALS AUTOFILL
// ==========================================
function fillDemoCredentials() {
    document.getElementById("login-email").value = "pizzafan@emberandcrust.com";
    document.getElementById("login-password").value = "PizzaLover2026!";
    clearAllErrors();
    showToast("Filled", "Demo credentials filled in! Click Sign In.", "info");
}

// ==========================================
// 5. LOGIN HANDLER
// ==========================================
function handleLogin(event) {
    event.preventDefault();
    clearAllErrors();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const btn = document.getElementById("login-btn");
    const emailErr = document.getElementById("login-email-error");
    const passErr = document.getElementById("login-password-error");

    let isValid = true;

    // Validate Email
    if (!validateEmail(email)) {
        showFieldError("login-email", emailErr, "Please enter a valid email address");
        isValid = false;
    }

    // Validate Password
    if (!password || password.length < 5) {
        showFieldError("login-password", passErr, "Password must be at least 5 characters long");
        isValid = false;
    }

    if (!isValid) {
        shakeElement(document.getElementById("loginForm"));
        return;
    }

    // Loading State
    setButtonLoading(btn, true, "Signing in...");

    // Simulate API Auth delay
    setTimeout(() => {
        setButtonLoading(btn, false, "Sign In 🍕");

        // Save session in localStorage
        const userName = email.split("@")[0];
        localStorage.setItem("ember_user", JSON.stringify({
            email: email,
            name: userName.charAt(0).toUpperCase() + userName.slice(1),
            loggedIn: true,
            loginTime: new Date().toISOString()
        }));

        showToast("Success", "Welcome back, " + userName + "! Redirecting to pizza menu...", "success");

        // Redirect to Pizza menu page
        setTimeout(() => {
            window.location.href = "pizza.html";
        }, 1200);

    }, 1000);
}

// ==========================================
// 6. SIGN UP HANDLER
// ==========================================
function handleSignup(event) {
    event.preventDefault();
    clearAllErrors();

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const password = document.getElementById("signup-password").value;
    const btn = document.getElementById("signup-btn");

    let isValid = true;

    if (!name || name.length < 2) {
        showFieldError("signup-name", document.getElementById("signup-name-error"), "Please enter your name");
        isValid = false;
    }

    if (!validateEmail(email)) {
        showFieldError("signup-email", document.getElementById("signup-email-error"), "Please enter a valid email");
        isValid = false;
    }

    if (!phone || phone.length < 7) {
        showFieldError("signup-phone", document.getElementById("signup-phone-error"), "Enter a valid phone number");
        isValid = false;
    }

    if (!password || password.length < 6) {
        showFieldError("signup-password", document.getElementById("signup-password-error"), "Password must be at least 6 characters");
        isValid = false;
    }

    if (!isValid) {
        shakeElement(document.getElementById("signupForm"));
        return;
    }

    setButtonLoading(btn, true, "Creating Account...");

    setTimeout(() => {
        setButtonLoading(btn, false, "Create Account & Claim 20% OFF 🎁");

        // Store user in local storage
        localStorage.setItem("ember_user", JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            loggedIn: true,
            discountClaimed: true
        }));

        showToast("Welcome!", `Account created for ${name}! Discount activated. Redirecting...`, "success");

        setTimeout(() => {
            window.location.href = "pizza.html";
        }, 1400);

    }, 1200);
}

// ==========================================
// 7. SOCIAL LOGIN (Google / Apple)
// ==========================================
function socialLogin(provider) {
    showToast("Connecting", `Connecting to ${provider}...`, "info");
    setTimeout(() => {
        localStorage.setItem("ember_user", JSON.stringify({
            name: `${provider} Foodie`,
            email: `user@${provider.toLowerCase()}.com`,
            loggedIn: true
        }));
        showToast("Success", `Logged in via ${provider}! Redirecting...`, "success");
        setTimeout(() => {
            window.location.href = "pizza.html";
        }, 1200);
    }, 1000);
}

// ==========================================
// 8. FORGOT PASSWORD MODAL
// ==========================================
function openForgotModal() {
    document.getElementById("forgotModal").classList.add("open");
}

function closeForgotModal() {
    document.getElementById("forgotModal").classList.remove("open");
}

function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById("reset-email").value.trim();
    if (!validateEmail(email)) {
        showToast("Error", "Please enter a valid email", "error");
        return;
    }
    closeForgotModal();
    showToast("Email Sent", `Password reset instructions sent to ${email}`, "success");
}

// Close modal on background click
window.addEventListener("click", (e) => {
    const modal = document.getElementById("forgotModal");
    if (e.target === modal) {
        closeForgotModal();
    }
});

// ==========================================
// 9. HELPER FUNCTIONS & TOAST
// ==========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFieldError(inputId, errorEl, message) {
    const input = document.getElementById(inputId);
    if (input && input.parentElement) {
        input.parentElement.classList.add("error");
    }
    if (errorEl) {
        errorEl.innerText = message;
    }
}

function clearAllErrors() {
    document.querySelectorAll(".input-wrapper").forEach(wrapper => {
        wrapper.classList.remove("error");
    });
    document.querySelectorAll(".field-error").forEach(el => {
        el.innerText = "";
    });
}

function shakeElement(el) {
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth; // trigger reflow
    el.classList.add("shake");
}

function setButtonLoading(btn, isLoading, text) {
    const textSpan = btn.querySelector(".btn-text");
    const spinner = btn.querySelector(".btn-spinner");

    if (isLoading) {
        btn.disabled = true;
        if (textSpan) textSpan.innerText = text;
        if (spinner) spinner.style.display = "inline-block";
    } else {
        btn.disabled = false;
        if (textSpan) textSpan.innerText = text;
        if (spinner) spinner.style.display = "none";
    }
}

function showToast(title, message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "🔔";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";
    if (type === "info") icon = "ℹ️";

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-msg">
            <strong>${title}</strong>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Animation in
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Auto dismiss after 3.5s
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}
