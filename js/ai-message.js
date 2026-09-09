const AI_MESSAGE_WEBHOOK_URL =
    "https://n8n-1-111-0-g3nd.onrender.com/webhook/ai-lead-message";

const aiMessageForm = document.getElementById("aiMessageForm");
const aiSubmitButton = document.getElementById("aiSubmitButton");
const aiFormStatus = document.getElementById("aiFormStatus");

let aiFormStatusTimeout;

function showAiFormStatus(message, isError) {
    clearTimeout(aiFormStatusTimeout);

    aiFormStatus.textContent = message;
    aiFormStatus.classList.toggle("is-error", isError);
    aiFormStatus.setAttribute("role", isError ? "alert" : "status");
    aiFormStatus.style.display = "block";

    if (!isError) {
        aiFormStatusTimeout = setTimeout(() => {
            aiFormStatus.style.display = "none";
        }, 5000);
    }
}

aiMessageForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const payload = {
        name: document.getElementById("ai_name").value.trim(),
        phone: document.getElementById("ai_phone").value.trim(),
        message: document.getElementById("ai_message").value.trim()
    };

    aiSubmitButton.disabled = true;
    aiSubmitButton.textContent = "Sending...";
    aiFormStatus.style.display = "none";

    try {
        const response = await fetch(AI_MESSAGE_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Webhook returned ${response.status}`);
        }

        aiMessageForm.reset();
        showAiFormStatus("Thanks. Your message has been sent to our team.", false);

        aiSubmitButton.disabled = false;
        aiSubmitButton.textContent = "Send Message";

    } catch (error) {
        console.error("AI message submission error:", error);
        showAiFormStatus("Unable to send your message right now. Please try again.", true);

        aiSubmitButton.disabled = false;
        aiSubmitButton.textContent = "Try Again";
    }
});
