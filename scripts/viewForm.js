// Function to capture user input and store it in local storage
function storeSurveyData() {
  const textInputs = document.querySelectorAll("input[type='text']");
  const textQuestions = document.querySelectorAll(".M7eMe");
  const surveyData = {};

  // Collect all text input values
  textInputs.forEach((input, index) => {
    const questionText = textQuestions[index]
      ? textQuestions[index].textContent.trim()
      : `Question ${index + 1}`;
    surveyData[questionText] = input.value;
  });

  // Store the collected data in local storage
  chrome.storage.local.set({ surveyData }, () => {
    console.log("Survey data stored successfully:", surveyData);
  });
}

// Monitor the DOM for changes and attach a listener to the Submit button
const observer = new MutationObserver(() => {
  const submitButton = document.querySelector(
    "div[role='button'][aria-label='Submit']",
  );
  if (submitButton) {
    submitButton.addEventListener("click", () => {
      console.log("Submit button clicked. Storing survey data...");
      storeSurveyData();
    });
    observer.disconnect(); // Stop observing once the button is found
  }
});

// Start observing the document for changes
observer.observe(document.body, { childList: true, subtree: true });
