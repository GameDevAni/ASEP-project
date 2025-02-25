const POCKETBASE_URL = "http://127.0.0.1:8090"; // Change this if needed
const COLLECTION_NAME = "help_requests";
const submissionsContainer = document.getElementById("submissions-container");
let selectedStatus = "All"; // Default to show all

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

    // Apply filtering based on selected status
    const filteredSubmissions = selectedStatus === "All"
        ? submissions
        : submissions.filter(sub => sub.status === selectedStatus);

    filteredSubmissions.forEach(sub => {
        if (!sub.image) return;

        const card = document.createElement("div");
        card.classList.add("submission-card");

        const imageUrl = `${POCKETBASE_URL}/api/files/${COLLECTION_NAME}/${sub.id}/${sub.image}`;
        const submissionDate = new Date(sub.created).toLocaleString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        card.innerHTML = `
            <img src="${imageUrl}" alt="Submitted Image" class="clickable-image">
            <div class="submission-info">
                <h2>Location: ${sub.location}</h2>
                <p><strong>Phone:</strong> ${sub.phone}</p>
                <p><strong>Message:</strong> ${sub.message}</p>
                <p><strong>Submitted On:</strong> ${submissionDate}</p>
                
                <label for="status-${sub.id}"><strong>Status:</strong></label>
                <select class="status-dropdown" data-id="${sub.id}">
                    <option value="Pending" ${sub.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Help on the way" ${sub.status === "Help on the way" ? "selected" : ""}>Help on the way</option>
                    <option value="Rescued" ${sub.status === "Rescued" ? "selected" : ""}>Rescued</option>
                </select>
            </div>
        `;

        submissionsContainer.appendChild(card);
    });

    // Attach event listeners for status updates
    document.querySelectorAll(".status-dropdown").forEach(select => {
        select.addEventListener("change", async function () {
            const recordId = this.getAttribute("data-id");
            const newStatus = this.value;
            await updateStatus(recordId, newStatus);
        });
    });

    // Enable Image Click for Preview
    document.querySelectorAll(".clickable-image").forEach(img => {
        img.addEventListener("click", function() {
            document.getElementById("imageModal").style.display = "flex";
            document.getElementById("fullImage").src = this.src;
        });
    });
}

document.getElementById("statusFilter").addEventListener("change", function () {
    selectedStatus = this.value;
    fetchSubmissions(); // Refresh submissions with new filter
});


async function updateStatus(recordId, newStatus) {
    try {
        const response = await fetch(`${POCKETBASE_URL}/api/collections/${COLLECTION_NAME}/records/${recordId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error(`Failed to update status: ${response.statusText}`);

        console.log(`Status updated to: ${newStatus}`);
    } catch (error) {
        console.error("Error updating status:", error);
    }
}



// Run functions
fetchSubmissions();
subscribeToUpdates();
