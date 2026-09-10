const N8N_WEBHOOK_URL =
    "https://n8n-1-111-0-g3nd.onrender.com/webhook/mortgage-lead";

const leadForm = document.getElementById("leadForm");
const submitButton = document.getElementById("submitButton");
const successMessage = document.getElementById("success");

const TOTAL_STEPS = 9;

const wizardSteps = Array.from(leadForm.querySelectorAll(".form-step"));
const progressFill = document.getElementById("wizardProgressFill");
const progressLabel = document.getElementById("wizardProgressLabel");
const noteField = document.getElementById("note");
const baseNote = noteField.value.trim();

let propertyTypeAnswer = "";
let buyerSituationAnswer = "";

document.querySelectorAll(".choice-card").forEach(function (card) {
    card.setAttribute("aria-pressed", "false");
});

function updateNoteField() {
    const lines = [];
    if (propertyTypeAnswer) lines.push(`Property Type: ${propertyTypeAnswer}`);
    if (buyerSituationAnswer) lines.push(`Buyer Situation: ${buyerSituationAnswer}`);

    const structured = lines.length
        ? `Mortgage consultation details:\n${lines.join("\n")}`
        : "";

    noteField.value = [baseNote, structured].filter(Boolean).join("\n\n");
}

function showStep(stepNumber, options) {
    const shouldFocus = Boolean(options && options.focus);

    wizardSteps.forEach(function (step) {
        const isActive = Number(step.dataset.step) === stepNumber;
        step.hidden = !isActive;
        step.classList.toggle("is-active", isActive);
    });

    progressFill.style.width = ((stepNumber / TOTAL_STEPS) * 100) + "%";
    progressLabel.textContent = "Step " + stepNumber + " of " + TOTAL_STEPS;

    if (shouldFocus) {
        const activeStep = leadForm.querySelector('.form-step[data-step="' + stepNumber + '"]');
        const heading = activeStep.querySelector(".step-question");
        if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: false });
        }
    }
}

function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > TOTAL_STEPS) {
        return;
    }
    showStep(stepNumber, { focus: true });
}

leadForm.querySelectorAll(".choice-grid").forEach(function (grid) {
    const field = grid.dataset.field;
    const cards = Array.from(grid.querySelectorAll(".choice-card"));

    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            cards.forEach(function (c) {
                c.classList.remove("is-selected");
                c.setAttribute("aria-pressed", "false");
            });
            card.classList.add("is-selected");
            card.setAttribute("aria-pressed", "true");

            const value = card.dataset.value;

            if (field === "propertyType") {
                propertyTypeAnswer = card.textContent.trim();
                updateNoteField();
            } else if (field === "first_time_buyer") {
                buyerSituationAnswer = card.textContent.trim();
                document.getElementById("first_time_buyer").value = value;
                updateNoteField();
            } else {
                const target = document.getElementById(field);
                if (target) {
                    target.value = value;
                }
            }

            const stepEl = grid.closest(".form-step");
            const continueBtn = stepEl.querySelector(".btn-continue");
            if (continueBtn) {
                continueBtn.disabled = false;
            }
        });
    });
});

const addressInput = document.getElementById("address");
const addressUnknownBtn = leadForm.querySelector("[data-address-unknown]");
const addressContinueBtn = leadForm.querySelector('[data-step-continue="8"]');

function updateAddressContinueState() {
    addressContinueBtn.disabled = addressInput.value.trim() === "";
}

addressInput.addEventListener("input", function () {
    addressUnknownBtn.classList.remove("is-selected");
    addressUnknownBtn.setAttribute("aria-pressed", "false");
    updateAddressContinueState();
});

addressUnknownBtn.addEventListener("click", function () {
    addressInput.value = "Address not yet determined";
    addressUnknownBtn.classList.add("is-selected");
    addressUnknownBtn.setAttribute("aria-pressed", "true");
    updateAddressContinueState();
});

leadForm.querySelectorAll("[data-step-continue]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        goToStep(Number(btn.dataset.stepContinue) + 1);
    });
});

leadForm.querySelectorAll("[data-step-back]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        goToStep(Number(btn.dataset.stepBack) - 1);
    });
});

showStep(1, { focus: false });

leadForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const lead = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        service: document.getElementById("service").value,
        note: document.getElementById("note").value.trim(),
        estimated_property_value: document.getElementById("estimated_property_value").value,
        down_payment_range: document.getElementById("down_payment_range").value,
        employment_status: document.getElementById("employment_status").value,
        first_time_buyer: document.getElementById("first_time_buyer").value,
        desired_timeline: document.getElementById("desired_timeline").value,
        contact_phone: document.getElementById("contact_phone").value.trim(),
        preferred_contact_method: document.getElementById("preferred_contact_method").value,
        best_time_to_contact: document.getElementById("best_time_to_contact").value
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
