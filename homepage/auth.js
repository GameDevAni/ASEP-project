const POCKETBASE_URL = "http://127.0.0.1:8090"; // PocketBase API URL
let isLogin = true;

const formTitle = document.getElementById("form-title");
const authForm = document.getElementById("auth-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleText = document.getElementById("toggle-text");
const toggleLink = document.getElementById("toggle-link");

toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;

    formTitle.innerText = isLogin ? "Login" : "Register";
    nameInput.style.display = isLogin ? "none" : "block"; 
    toggleText.innerHTML = isLogin
        ? `Don't have an account? <a href="#" id="toggle-link">Register</a>`
        : `Already have an account? <a href="#" id="toggle-link">Login</a>`;

    attachToggleEvent(); // Reattach event listener
});

function attachToggleEvent() {
    document.getElementById("toggle-link").addEventListener("click", (e) => {
        e.preventDefault();
        isLogin = !isLogin;

        formTitle.innerText = isLogin ? "Login" : "Register";
        nameInput.style.display = isLogin ? "none" : "block";
        toggleText.innerHTML = isLogin
            ? `Don't have an account? <a href="#" id="toggle-link">Register</a>`
            : `Already have an account? <a href="#" id="toggle-link">Login</a>`;

        attachToggleEvent(); // Ensure event listener is properly reattached
    });
}

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        if (isLogin) {
            // LOGIN REQUEST
            const response = await fetch(`${POCKETBASE_URL}/api/collections/users/auth-with-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identity: email, password }),
            });

            if (!response.ok) throw new Error("Login failed. Check credentials.");

            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.record.id);
            alert("Login successful!");
            window.location.href = "homepage.html";
        } else {
            // REGISTER REQUEST
            if (!name) {
                alert("Please enter your name.");
                return;
            }

            const response = await fetch(`${POCKETBASE_URL}/api/collections/users/records`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    passwordConfirm: password,
                    name,
                }),
            });

            if (!response.ok) throw new Error("Registration failed. Try again.");

            alert("Registration successful! Please log in.");
            isLogin = true;
            formTitle.innerText = "Login";
            nameInput.style.display = "none";
            attachToggleEvent();
        }
    } catch (error) {
        alert(error.message);
    }
});
