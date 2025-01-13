// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.videoUrl) {
//     const surveyUrl =
//       "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform?usp=header";

//     // Store the original video URL in local storage
//     chrome.storage.local.set({ originalVideoUrl: message.videoUrl }, () => {
//       console.log("Original video URL stored:", message.videoUrl);

//       // Redirect the user to the survey
//       chrome.tabs.update(sender.tab.id, { url: surveyUrl });
//     });
//   }
// });

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   if (details.url.includes("watch?v=")) {
//     chrome.scripting.executeScript({
//       target: { tabId: details.tabId },
//       files: ["scripts/content.js"],
//     });
//     console.log("Content script re-injected on dynamic navigation.");
//   }
// });

// Fetch stored values (asynchronous)
// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   // Check if the URL is a YouTube video
//   if (!details.url.includes("watch?v=")) {
//     return; // Ignore non-video URLs
//   }
//
//   // Fetch stored values (handle undefined values for base case)
//   chrome.storage.local.get(["originalVideoUrl", "isApproved"], (data) => {
//     const originalVideoUrl = data.originalVideoUrl || null; // Default to null if not set
//     const isApproved = data.isApproved || false; // Default to false if not set
//
//     console.log("Original Video URL:", originalVideoUrl);
//     console.log("Is Approved:", isApproved);
//
//     // Base case: First video visit or no stored data
//     if (!originalVideoUrl || details.url !== originalVideoUrl) {
//       console.log("Base case or new video detected. Resetting approval state.");
//       chrome.storage.local.set(
//         {
//           originalVideoUrl: details.url,
//           isApproved: false,
//         },
//         () => {
//           console.log("Approval state reset and URL stored.");
//         },
//       );
//
//       // Redirect to survey for new video
//       chrome.tabs.update(details.tabId, {
//         url: "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform",
//       });
//       console.log("Redirected to survey for new video.");
//       return;
//     }
//
//     // If video is already approved, do nothing
//     if (isApproved) {
//       console.log("Video already approved. Skipping redirection.");
//       return;
//     }
//
//     // If not approved and same video, redirect to survey
//     console.log("Video not approved. Redirecting to survey.");
//     chrome.tabs.update(details.tabId, {
//       url: "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform",
//     });
//   });
// });

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   if (!details.url.includes("watch?v=")) return; // Only handle video pages
//
//   chrome.storage.local.get(["originalVideoUrl", "isApproved"], (data) => {
//     const originalVideoUrl = data.originalVideoUrl || null;
//     const isApproved = data.isApproved || false;
//
//     // Reset for a new video
//     if (!originalVideoUrl || details.url !== originalVideoUrl) {
//       console.log("New video detected or base case. Resetting approval state.");
//       chrome.storage.local.set(
//         { originalVideoUrl: details.url, isApproved: false },
//         () => console.log("Approval state reset and URL stored."),
//       );
//
//       // Request the title from content.js
//       chrome.tabs.sendMessage(
//         details.tabId,
//         { action: "getVideoTitle" },
//         (response) => {
//           const videoTitle = response?.title || "Unknown Title";
//           console.log("Video Title:", videoTitle);
//           chrome.storage.local.set({ videoTitle }, () => {});
//
//           setTimeout(() => {
//             // Redirect to survey
//             chrome.tabs.update(details.tabId, {
//               url: "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform",
//             });
//           }, 1000);
//         },
//       );
//       // chrome.tabs.update(details.tabId, {
//       //   url: "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform",
//       // });
//
//       // setTimeout(() => {
//       //   // Redirect to survey
//       //   chrome.tabs.update(details.tabId, {
//       //     url: "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform",
//       //   });
//       // }, 1000);
//       return;
//     }
//
//     // Skip redirection for approved videos
//     if (isApproved) {
//       console.log("Video already approved. Skipping redirection.");
//       return;
//     }
//
//     // Redirect for unapproved videos
//     console.log("Video not approved. Redirecting to survey.");
//     chrome.tabs.update(details.tabId, {
//       url: "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform",
//     });
//   });
// });

// Constants
// const SURVEY_URL =
//   "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform";
//
// // Listener for navigation updates
// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   // Only handle YouTube video pages
//   if (!details.url.includes("watch?v=")) return;
//
//   handleVideoPage(details);
// });
//
// // Function to handle video page logic
// function handleVideoPage(details) {
//   chrome.storage.local.get(["originalVideoUrl", "isApproved"], (data) => {
//     const originalVideoUrl = data.originalVideoUrl || null;
//     const isApproved = data.isApproved || false;
//
//     console.log("Original Video URL:", originalVideoUrl);
//
//     if (isNewVideo(details.url, originalVideoUrl)) {
//       resetApprovalState(details.url);
//       setTimeout(() => fetchAndStoreVideoTitle(details.tabId), 1000);
//       // fetchAndStoreVideoTitle(details.tabId);
//     } else if (isApproved) {
//       console.log("Video already approved. Skipping redirection.");
//       return;
//     } else {
//       redirectToSurvey(details.tabId);
//     }
//   });
// }
//
// // Check if the current video is new
// function isNewVideo(currentUrl, originalVideoUrl) {
//   return !originalVideoUrl || currentUrl !== originalVideoUrl;
// }
//
// // Reset approval state for a new video
// function resetApprovalState(url) {
//   console.log("New video detected. Resetting approval state.");
//   chrome.storage.local.set({ originalVideoUrl: url, isApproved: false }, () =>
//     console.log("Approval state reset and URL stored."),
//   );
// }
//
// // Fetch and store video title
// function fetchAndStoreVideoTitle(tabId) {
//   chrome.tabs.sendMessage(tabId, { action: "getVideoTitle" }, (response) => {
//     if (chrome.runtime.lastError) {
//       console.error(
//         "Error sending message to content script:",
//         chrome.runtime.lastError,
//       );
//       return;
//     }
//
//     const videoTitle = response?.videoTitle || "Unknown Title";
//     console.log("Video Title:", videoTitle);
//
//     chrome.storage.local.set({ videoTitle }, () =>
//       console.log("Video title stored:", videoTitle),
//     );
//
//     // Redirect to survey after storing the title
//     setTimeout(() => redirectToSurvey(tabId), 1000);
//   });
// }
//
// // Redirect to the survey
// function redirectToSurvey(tabId) {
//   console.log("Redirecting to survey.");
//   chrome.tabs.update(tabId, { url: SURVEY_URL });
// }

// scripts/background.js

const SURVEY_PAGE = chrome.runtime.getURL("survey/survey.html");

// 1. Listen for FULL navigations
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (isWatchUrl(details.url)) {
    // handleVideoPage(details.tabId, details.url);
    setTimeout(() => handleVideoPage(details.tabId, details.url), 1000);
  }
});

// 2. Listen for SPA (history.pushState) navigations
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (isWatchUrl(details.url)) {
    // handleVideoPage(details.tabId, details.url);
    setTimeout(() => handleVideoPage(details.tabId, details.url), 1000);
  }
});

/**
 * Main logic to handle YouTube watch pages.
 * - Checks if video is already approved.
 * - If not, store pending info and redirect to local survey.
 */
function handleVideoPage(tabId, url) {
  chrome.storage.local.get(["approvedVideos"], (data) => {
    const approvedVideos = data.approvedVideos || {};
    const videoId = extractVideoId(url);

    if (!videoId) {
      console.log("Could not parse videoId from URL, doing nothing.");
      return;
    }

    if (approvedVideos[videoId]) {
      // Already approved: do nothing
      console.log("Video already approved:", videoId);
      return;
    } else {
      // Not approved
      console.log("Unapproved video detected:", videoId);

      // Store as pending
      chrome.storage.local.set(
        {
          pendingVideoUrl: url, // full YouTube URL
          pendingVideoId: videoId, // short ID
        },
        () => {
          console.log("Pending video info stored:", url, videoId);
        },
      );

      // Fetch the title from the content script
      chrome.tabs.sendMessage(
        tabId,
        { action: "getVideoTitle" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn(
              "No response from content script:",
              chrome.runtime.lastError,
            );
            // In case no content script is loaded yet, or some error occurred
            // We can still redirect to the survey, but we won't have the exact title
            redirectToSurvey(tabId, videoId);
            return;
          }
          const videoTitle = response?.videoTitle || "Unknown Title";
          chrome.storage.local.set({ pendingVideoTitle: videoTitle }, () => {
            console.log("Pending video title stored:", videoTitle);
            // Finally redirect to local survey
            redirectToSurvey(tabId, videoId);
          });
        },
      );
    }
  });
}

/**
 * Check if the URL is a YouTube watch page
 */
function isWatchUrl(url) {
  return url.includes("youtube.com/watch?v=");
}

/**
 * Extract the watch?v= parameter value
 */
function extractVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

/**
 * Redirect user to our local survey page, with a query param for the videoId
 */
function redirectToSurvey(tabId, videoId) {
  console.log("Redirecting to local survey for video:", videoId);
  const surveyUrl = `${SURVEY_PAGE}?videoId=${videoId}`;
  chrome.tabs.update(tabId, { url: surveyUrl });
}

/**
 * Listen for a message from survey.js that says "approveVideo"
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "approveVideo" && message.videoId) {
    approveVideo(message.videoId)
      .then(() => {
        sendResponse({ status: "ok" });
      })
      .catch((err) => {
        console.error("Failed to approve video:", err);
        sendResponse({ status: "error", message: err.message });
      });
    // Let Chrome know we'll use sendResponse asynchronously
    return true;
  }
});

/**
 * Mark a video as approved in chrome.storage
 */
async function approveVideo(videoId) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["approvedVideos"], (data) => {
      const approvedVideos = data.approvedVideos || {};
      approvedVideos[videoId] = true;

      chrome.storage.local.set({ approvedVideos }, () => {
        console.log(`Video ${videoId} approved.`);
        resolve();
      });
    });
  });
}
