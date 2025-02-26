var imageInput = document.getElementById("image-input");
var previewImage = document.getElementById("preview-image");
imageInput.addEventListener("change", function(event){
  if(event.target.files.length == 0){
    return;
  }
  var tempUrL = URL.createObjectURL(event.target.files[0]);
  previewImage.setAttribute("src", tempUrL);
});

document.getElementById("contactform").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    let phone = document.querySelector("input[name='phone']").value;
    let location = document.querySelector("input[name='Location']").value;
    let message = document.querySelector("textarea[name='message']").value;
    let imageFile = document.querySelector("#image-input").files[0];

    let formData = new FormData();
    formData.append("phone", phone);
    formData.append("location", location);
    formData.append("message", message);
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        let response = await fetch("http://127.0.0.1:8090/api/collections/help_requests/records", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("Form submitted successfully!");
            document.getElementById("contactform").reset();
        } else {
            alert("Failed to submit the form.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error submitting form.");
    }
});

function toggleDropdown() {
    let dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Hide dropdown when clicking outside
document.addEventListener("click", function (event) {
    let dropdown = document.getElementById("dropdown-menu");
    let profileTab = document.querySelector(".profile-tab");

    if (!profileTab.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

function logout() {
    alert("Logging out...");
    // Add logout functionality (e.g., clear session, redirect)
}

document.addEventListener("DOMContentLoaded", async () => {
    const profilePic = document.getElementById("profile-pic");
    const profileDropdown = document.getElementById("profile-dropdown");
    const profileName = document.getElementById("profile-name");
    const logoutButton = document.getElementById("logout");

    const POCKETBASE_URL = "http://127.0.0.1:8090"; // Change this if needed

    // Fetch the currently authenticated user from PocketBase
    async function fetchCurrentUser() {
        try {
            const response = await fetch(`${POCKETBASE_URL}/api/collections/users/auth-refresh`, {
                method: "POST",
                credentials: "include" // Ensure the user's session is used
            });

            if (!response.ok) throw new Error("User not authenticated.");

            const userData = await response.json();
            profileName.textContent = userData.record.name || "User"; // Display name
        } catch (error) {
            console.error("Error fetching user:", error);
            profileName.textContent = "Guest";
        }
    }

    await fetchCurrentUser(); // Fetch and display the logged-in user's name

    // Toggle dropdown on profile click
    profilePic.addEventListener("click", () => {
        profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
    });

    // Logout function
    logoutButton.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!profilePic.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.style.display = "none";
        }
    });
});

