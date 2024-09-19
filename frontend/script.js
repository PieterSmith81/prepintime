// Function to get interview advice
async function getInterviewAdvice() {
  const jobSpec = document.getElementById("jobSpecInput").value;

  if (!jobSpec) {
    alert("Please paste a job description!");
    return;
  }

  try {
    // Make the POST request to the backend API
    const response = await fetch("http://localhost:3000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: jobSpec }),
    });

    const data = await response.json();

    // Display the advice in the output div
    document.getElementById("adviceOutput").innerText = data.advice;
  } catch (error) {
    console.error("Error fetching interview advice:", error);
    document.getElementById("adviceOutput").innerText =
      "An error occurred while fetching advice.";
  }
}
