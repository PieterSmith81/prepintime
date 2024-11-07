/*
Helper functions
*/

function disableButton(button, updatedButtonText = "") {
  button.disabled = true;
  button.classList.add("disabled");

  if (updatedButtonText) {
    button.innerText = updatedButtonText;
  }
}

function enableButton(button, updatedButtonText = "") {
  button.disabled = false;
  button.classList.remove("disabled");

  if (updatedButtonText) {
    button.innerText = updatedButtonText;
  }
}

function focusOnFirstInput() {
  const elementToFocusOn = document.getElementById("jobSpecQuestionInput");
  elementToFocusOn.focus();
}

function clearInputs() {
  const jobSpecQuestionElement = document.getElementById(
    "jobSpecQuestionInput"
  );
  jobSpecQuestionElement.value = "";

  const companyKnowledgeElement = document.getElementById(
    "companyKnowledgeInput"
  );
  companyKnowledgeElement.value = "";

  const skillsElement = document.getElementById("skillsInput");
  skillsElement.value = "";
}

function showElement(element) {
  element.classList.remove("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

/*
Main functions
*/

// Function to get interview advice
async function getInterviewAdvice() {
  const jobSpecQuestionValue = document.getElementById(
    "jobSpecQuestionInput"
  ).value;

  if (!jobSpecQuestionValue.trim()) {
    alert(
      `Please paste a job spec into the "Job Spec or Question" box. This is required to submit.`
    );
    return;
  }

  const companyKnowledgeValue = document.getElementById(
    "companyKnowledgeInput"
  ).value;
  const skillsValue = document.getElementById("skillsInput").value;
  const submitButton = document.getElementById("submitButton");
  const resetButton = document.getElementById("resetButton");

  try {
    // Disable the submit and reset buttons while the request is being made
    disableButton(submitButton, "Fetching advice... Please wait");
    hideElement(resetButton);

    // Hide the result output element while the request is being made
    hideElement(document.getElementById("resultOutput"));

    // Make the POST request to the backend API
    // const response = await fetch("https://localhost:3000/message", {
    const response = await fetch("/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobSpecQuestion: jobSpecQuestionValue,
        companyKnowledge: companyKnowledgeValue,
        skills: skillsValue,
      }),
    });

    const data = await response.json();

    // Display the advice in the output div
    const resultOutputElement = document.getElementById("resultOutput");
    resultOutputElement.innerHTML = data.message;

    // Show the result output element
    showElement(resultOutputElement);

    // Re-enable the submit and reset buttons
    enableButton(submitButton, "Get Interview Advice");
    showElement(resetButton);

    // Scroll to the first input element's title
    document
      .getElementById("submitButton")
      .scrollIntoView({ behavior: "smooth" });

    // Focus on the first input element
    focusOnFirstInput();
  } catch (error) {
    // Re-enable the submit and reset buttons if something goes wrong
    enableButton(submitButton, "Get Interview Advice");
    showElement(resetButton);

    // Show the result output element if something goes wrong
    showElement(document.getElementById("resultOutput"));

    // Display an error message if something goes wrong
    document.getElementById(
      "resultOutput"
    ).innerText = `An error occurred while fetching advice.

    Error details:
    ${error.message}`;
  }
}

// Function to reset the chatbot state (i.e., clear the chatbot's history and context, and begin a new conversation)
async function resetChatbotState() {
  const resetButton = document.getElementById("resetButton");

  try {
    // Make the POST request to the backend API
    // const response = await fetch("http://localhost:3000/reset", {
    const response = await fetch("/reset", {
      method: "POST",
    });

    const data = await response.json();

    // Display the response message in the output div
    const resultOutputElement = document.getElementById("resultOutput");
    resultOutputElement.innerText = data.message;

    // Show the result output element
    showElement(resultOutputElement);

    // clear the inputs after the chatbot state is reset
    clearInputs();

    // Focus on the first input element after the chatbot state is reset
    focusOnFirstInput();
  } catch (error) {
    // Show the result output element if something goes wrong
    showElement(document.getElementById("resultOutput"));

    // Display an error message if something goes wrong
    document.getElementById(
      "resultOutput"
    ).innerText = `An error occurred while resetting the chatbot state.

    Error details:
    ${error.message}`;
  }
}

/*
Event listeners
*/

document
  .getElementById("jobSpecQuestionInput")
  .addEventListener("keydown", function (event) {
    // Enter will "submit" the prompt, while Shift + Enter will add a new line in the prompt input element (similar to ChatGPT's web interface)
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      getInterviewAdvice();
    }
  });

document
  .getElementById("companyKnowledgeInput")
  .addEventListener("keydown", function (event) {
    // Enter will "submit" the prompt, while Shift + Enter will add a new line in the prompt input element (similar to ChatGPT's web interface)
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      getInterviewAdvice();
    }
  });

document
  .getElementById("skillsInput")
  .addEventListener("keydown", function (event) {
    // Enter will "submit" the prompt, while Shift + Enter will add a new line in the prompt input element (similar to ChatGPT's web interface)
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      getInterviewAdvice();
    }
  });
