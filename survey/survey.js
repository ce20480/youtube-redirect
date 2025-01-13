// scripts/survey.js

document.addEventListener("DOMContentLoaded", async () => {
  const submitBtn = document.getElementById("submitBtn");
  const reasonTextarea = document.getElementById("reason");

  // 1. Parse the videoId from the URL query
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("videoId");

  if (!videoId) {
    alert("No videoId found in URL. Cannot continue.");
    return;
  }

  // 2. Retrieve stored info about this pending video
  const { pendingVideoUrl, pendingVideoTitle } = await loadPendingData();

  if (!pendingVideoUrl) {
    console.warn(
      "No pendingVideoUrl found. Possibly an error in background logic.",
    );
  }

  console.log("Video ID:", videoId);
  console.log("Pending video URL:", pendingVideoUrl);
  console.log("Pending video title:", pendingVideoTitle);

  // 3. On Submit, call your LLM
  submitBtn.addEventListener("click", async () => {
    const userReason = reasonTextarea.value.trim();

    if (!userReason) {
      alert("Please provide a reason.");
      return;
    }

    try {
      // Call your local LLM server
      const payload = {
        survey_response: userReason,
        video_title: pendingVideoTitle || "Untitled",
      };
      const response = await sendToLLM(payload);

      // Here we expect something like { decision: 'True'/'False', evaluation: 'some text' }
      if (response.decision === "True") {
        // Mark as approved in background
        console.log(response.evaluation);
        chrome.runtime.sendMessage(
          { action: "approveVideo", videoId },
          (res) => {
            console.log("approveVideo response:", res);
            // Now redirect back to the pending video
            if (pendingVideoUrl) {
              window.location.href = pendingVideoUrl;
            } else {
              alert(
                "No pending video URL found. Please open YouTube manually.",
              );
            }
          },
        );
      } else {
        console.log(response.evaluation);
        alert("LLM did not approve your reason. Please try again.");
      }
    } catch (err) {
      console.error("Error calling LLM:", err);
      alert("An error occurred. Please try again later.");
    }
  });
});

/**
 * Load the pendingVideoUrl and pendingVideoTitle from chrome.storage
 */
function loadPendingData() {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      ["pendingVideoUrl", "pendingVideoTitle"],
      (data) => {
        resolve({
          pendingVideoUrl: data.pendingVideoUrl,
          pendingVideoTitle: data.pendingVideoTitle,
        });
      },
    );
  });
}

/**
 * Example function to call your local LLM server
 * Adjust the URL/endpoint as needed (e.g., "http://localhost:5000/evaluate")
 */
async function sendToLLM(payload) {
  const response = await fetch("http://127.0.0.1:5000/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("LLM server returned an error status: " + response.status);
  }
  return response.json();
}
