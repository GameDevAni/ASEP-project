const POCKETBASE_URL = "http://127.0.0.1:8090"; // Change this if needed
const COLLECTION_NAME = "help_requests";
const submissionsContainer = document.getElementById("submissions-container");

// Initialize PocketBase client
const pb = new PocketBase(POCKETBASE_URL);

async function fetchSubmissions() {
    try {
        const records = await pb.collection(COLLECTION_NAME).getFullList({ sort: "-created" });
        renderSubmissions(records);
    } catch (error) {
        console.error("Error fetching submissions:", error);
    }
}

// Render submissions to dashboard
function renderSubmissions(submissions) {
    submissionsContainer.innerHTML = ""; // Clear existing data

    submissions.forEach(sub => {
        if (!sub.image) return; // Ensure image exists

        const card = document.createElement("div");
        card.classList.add("submission-card");

        const imageUrl = `${POCKETBASE_URL}/api/files/${COLLECTION_NAME}/${sub.id}/${sub.image}`;

        card.innerHTML = `
            <img src="${imageUrl}" alt="Submitted Image">
            <div class="submission-info">
                <h2>Location: ${sub.location}</h2>
                <p><strong>Phone:</strong> ${sub.phone}</p>
                <p><strong>Message:</strong> ${sub.message}</p>
            </div>
        `;

        submissionsContainer.appendChild(card);
    });
}


// Subscribe to real-time updates
async function subscribeToUpdates() {
    pb.collection(COLLECTION_NAME).subscribe("*", async (e) => {
        console.log("Real-time update received!", e);
        await fetchSubmissions();
    });
}

// Run functions
fetchSubmissions();
subscribeToUpdates();
