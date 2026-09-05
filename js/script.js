const N8N_WEBHOOK_URL =
    "https://n8n-1-111-0-g3nd.onrender.com/webhook/mortgage-lead";

const leadForm = document.getElementById("leadForm");
const submitButton = document.getElementById("submitButton");
const successMessage = document.getElementById("success");

leadForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const lead = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        service: document.getElementById("service").value,
        note: document.getElementById("note").value.trim()
    };

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    successMessage.style.display = "none";

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lead)
        });

        if (!response.ok) {
            throw new Error(`Webhook returned ${response.status}`);
        }

        leadForm.reset();

        successMessage.style.display = "block";
        successMessage.textContent =
            "Thanks. Your request has been received. A mortgage professional will review your information and follow up with you.";

        successMessage.style.background = "";
        successMessage.style.borderColor = "";
        successMessage.style.color = "";

        submitButton.disabled = false;
        submitButton.textContent = "Submit Another Request";

        setTimeout(() => {
            successMessage.style.display = "none";
        }, 5000);

    } catch (error) {
        console.error("Lead submission error:", error);

        successMessage.style.display = "block";
        successMessage.textContent =
            "Unable to connect to the automation workflow. Please try again.";

        successMessage.style.background = "#fff4f0";
        successMessage.style.borderColor = "#f0c9bd";
        successMessage.style.color = "#7a3b2c";

        submitButton.disabled = false;
        submitButton.textContent = "Try Again";
    }
});
