// send the survey response to the LLM server
// async function sendToLLM({ survey_response, video_title }) {
//   return fetch("http://127.0.0.1:5000/evaluate", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       survey_response,
//       video_title,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.decision === "approved") {
//         console.log("LLM approved the response.");
//         chrome.storage.local.set({ isApproved: true }, () => {});
//         return { approved: true, evaluation: data.evaluation };
//       } else {
//         console.log("LLM denied the response.");
//         return { approved: false, evaluation: data.evaluation };
//       }
//     })
//     .catch((error) => {
//       console.error("Error communicating with LLM:", error);
//       return { approved: false, evaluation: null };
//     });
// }

async function sendToLLM({ survey_response, video_title }) {
  try {
    // Send POST request to the LLM API
    const response = await fetch("http://127.0.0.1:5000/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        survey_response,
        video_title,
      }),
    });

    // Check for response status
    if (!response.ok) {
      throw new Error(
        `Server responded with ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Check decision from the LLM
    const isApproved = data.decision === "approved";

    // Store approval state in local storage
    await chrome.storage.local.set({ isApproved });

    console.log(
      isApproved ? "LLM approved the response." : "LLM denied the response.",
    );

    return {
      approved: isApproved,
      evaluation: data.evaluation || "No evaluation provided.",
    };
  } catch (error) {
    console.error("Error communicating with LLM:", error);
    return {
      approved: false,
      evaluation: null,
    };
  }
}

// Function to handle LLM evaluation and redirection
async function evaluateAndRedirect() {
  // How many bytes are in use?
  // chrome.storage.local.getBytesInUse((bytesInUse) => {
  //   const maxBytes = 5242880; // 5 MB
  //   if (bytesInUse >= maxBytes * 0.9) {
  //     console.warn("Approaching storage limit!");
  //   } else {
  //     console.log("Storage usage is: ", bytesInUse);
  //   }
  // });

  // Retrieve survey data and video URL from storage
  // chrome.storage.local.get(
  //   ["surveyData", "originalVideoUrl", "videoTitle"],
  //   async (data) => {
  //     const { surveyData, originalVideoUrl, videoTitle } = data;
  //
  //     if (surveyData && videoTitle) {
  //       console.log("Retrieved survey data: ", surveyData);
  //       console.log("Retrieved videoTitle: ", videoTitle);
  //
  //       // Await the result of sendToLLM
  //       const response = await sendToLLM({
  //         survey_data: surveyData,
  //         video_title: videoTitle,
  //       });
  //
  //       chrome.storage.local.get(["isApproved"], ({ isApproved }) => {
  //         console.log("The video got: ", isApproved);
  //       });
  //
  //       if (response.approved) {
  //         console.log("LLM approved.");
  //         if (originalVideoUrl) {
  //           console.log("Retrieved video URL: ", originalVideoUrl);
  //           console.log(response.evaluation);
  //           alert("Your reason was");
  //           setTimeout(() => {
  //             window.location.href = originalVideoUrl; // Redirect to YouTube video
  //           }, 1000);
  //         } else {
  //           console.error("Required data not found in storage.");
  //         }
  //       } else {
  //         console.log(
  //           "LLM disapproved. Displaying message: ",
  //           response.evaluation,
  //         );
  //         alert("Your reason was not approved. Please try again ");
  //         setTimeout(() => {
  //           window.location.href =
  //             "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform";
  //         }, 1000);
  //       }
  //     } else {
  //       console.error("No survey data found.");
  //     }
  //   },
  // );
  chrome.storage.local.get(
    ["surveyData", "originalVideoUrl", "videoTitle", "isApproved"],
    async (data) => {
      const { surveyData, originalVideoUrl, videoTitle, isApproved } = data;

      // Log retrieved data for debugging
      console.log("Retrieved data from storage:", data);

      // Check and handle missing survey data
      if (!surveyData) {
        console.error(
          "Survey data is missing. Redirecting to the survey form.",
        );
        alert("Survey data is missing. Please complete the form again.");
        window.location.href =
          "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform";
        return;
      }

      // Check and handle missing video title
      if (!videoTitle) {
        console.error("Video title is missing.");
        alert("Video title is missing. Please reload the video page.");
        return;
      }

      console.log("Proceeding with evaluation...");

      // Call the LLM service for evaluation
      try {
        const response = await sendToLLM({
          survey_response: surveyData,
          video_title: videoTitle,
        });

        console.log("LLM evaluation response:", response);

        if (response.approved) {
          console.log("LLM approved the survey response.");
          if (originalVideoUrl) {
            console.log(
              "Redirecting to the original video URL:",
              originalVideoUrl,
            );
            alert("Your response was approved. Redirecting to the video.");
            // setTimeout(() => {
            //   window.location.href = originalVideoUrl;
            // }, 1000);
          } else {
            console.error("Original video URL is missing.");
            alert("Original video URL is missing. Unable to redirect.");
          }
        } else {
          console.log("LLM disapproved the survey response.");
          alert("Your reason was not approved. Please try again.");
          // setTimeout(() => {
          //   window.location.href =
          //     "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform";
          // }, 1000);
        }
      } catch (error) {
        console.error("Error during LLM evaluation:", error);
        alert("An error occurred during evaluation. Please try again later.");
      }
    },
  );
}

// if (surveyData && originalVideoUrl) {
//   // Simulate LLM evaluation (abstract placeholder)
//   const llmOutput = true; // Replace with actual LLM integration logic
//
//   if (llmOutput) {
//     console.log("LLM approved. Redirecting to video:", originalVideoUrl);
//     setTimeout(() => {
//       window.location.href = originalVideoUrl; // Redirect to YouTube video
//     }, 1000);
//   } else {
//     console.log("LLM disapproved. Displaying message.");
//     alert("Your reason was not approved. Please try again.");
//   }
// } else {
//   console.error("Required data not found in storage.");
// }
//   });
// }

// Run the evaluation and redirection logic
evaluateAndRedirect();
