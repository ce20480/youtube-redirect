// document.addEventListener("click", (e) => {
//   const anchor = e.target.closest("a");
//   if (anchor && anchor.href.includes("/watch?v=")) {
//     e.preventDefault(); // Stop the default link behavior
//     chrome.runtime.sendMessage({ videoUrl: anchor.href });
//   }
// });

// document.addEventListener("mouseover", (e) => {
//   const videoElement = e.target.closest("video");

//   // Add a custom event listener for clicks if it's a valid video element
//   if (videoElement && !videoElement.dataset.intercepted) {
//     videoElement.dataset.intercepted = "true"; // Mark to avoid duplicate listeners

//     videoElement.addEventListener("click", (clickEvent) => {
//       clickEvent.preventDefault(); // Prevent the default playback or redirection

//       const videoSrc =
//         videoElement.currentSrc || videoElement.getAttribute("src");
//       if (videoSrc) {
//         // Send the video source to the background script
//         chrome.runtime.sendMessage({ videoUrl: videoSrc });

//         // Optionally, show a notification or feedback
//         alert(
//           "Redirecting to a productivity survey before watching the video!"
//         );
//       }
//     });
//   }
// });

// let isEnabled = true; // Default state

// // Load initial state from storage
// chrome.storage.local.get("isEnabled", (data) => {
//   isEnabled = data.isEnabled ?? true;
// });

// // Listen for state updates from the popup
// chrome.runtime.onMessage.addListener((message) => {
//   if (message.hasOwnProperty("isEnabled")) {
//     isEnabled = message.isEnabled;
//     console.log("Extension state updated:", isEnabled);
//   }
// });

// // Intercept video clicks only if enabled
// document.addEventListener("mouseover", (e) => {
//   const videoElement = e.target.closest("video");

//   if (videoElement && !videoElement.dataset.intercepted) {
//     videoElement.dataset.intercepted = "true"; // Avoid duplicate listeners

//     videoElement.addEventListener("click", (clickEvent) => {
//       if (!isEnabled) return; // Do nothing if disabled

//       clickEvent.preventDefault();
//       const videoSrc =
//         videoElement.currentSrc || videoElement.getAttribute("src");

//       console.log("The video source is: ", videoSrc);

//       if (videoSrc) {
//         // Redirect to survey, store and alert original URL
//         window.location.href = "https://www.youtube.com"; // Go to YouTube homepage or any fallback
//         chrome.runtime.sendMessage({ videoUrl: videoSrc });
//         alert(
//           "Redirecting to a productivity survey before watching the video!"
//         );
//       }
//     });
//   }
// });

// if (document.location.href.includes("watch?v=")) {
//   // Locate the grandparent div of the video element
//   //   const videoGrandParent = document.querySelector(
//   //     "div#movie_player.html5-video-player"
//   //   );
//   //   console.log("Video grandparent element:", videoGrandParent);
//   //   if (videoGrandParent) {
//   //     // Add the "paused-mode" class to pause the video
//   //     videoGrandParent.classList.remove("playing-mode");
//   //     videoGrandParent.classList.add("paused-mode");
//   //     console.log("Video paused by adding 'paused-mode' class.");
//   //   }
//   //   const playPauseButton = document.querySelector("button.ytp-play-button"); // Play/Pause button
//   //   if (playPauseButton) {
//   //     playPauseButton.click(); // Pause the video
//   //     console.log("Video paused by clicking the Play/Pause button.");
//   //   }
//
//   // Overlay a blocking message
//   //   const overlay = document.createElement("div");
//   //   overlay.style.position = "absolute";
//   //   overlay.style.top = "0";
//   //   overlay.style.left = "0";
//   //   overlay.style.width = "100%";
//   //   overlay.style.height = "100%";
//   //   overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
//   //   overlay.style.color = "white";
//   //   overlay.style.display = "flex";
//   //   overlay.style.justifyContent = "center";
//   //   overlay.style.alignItems = "center";
//   //   overlay.style.fontSize = "20px";
//   //   overlay.style.zIndex = "1000";
//   //   overlay.textContent =
//   //     "Complete the survey in the other tab to resume watching.";
//   //   document.body.appendChild(overlay);
//
//   const videoUrl = document.baseURI; // Get the true video URL
//
//   // Store the video URL in local storage
//   chrome.storage.local.set({ originalVideoUrl: videoUrl }, () => {
//     // Redirect to the survey
//     setTimeout(() => {
//       chrome.storage.local.get("surveyUrl", (data) => {
//         const surveyUrl =
//           data.surveyUrl ||
//           "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform";
//         window.location.href = surveyUrl;
//       });
//     }, 1000); // Delay to ensure the pause takes effect
//   });
// }

// if (document.location.href.includes("watch?v=")) {
//   const videoUrl = document.baseURI; // Get the video URL
//   const videoTitleElement = document.querySelector("ytd-watch-metadata yt-formatted-string");
//   const videoTitle = videoTitleElement ? videoTitleElement.textContent.trim() : "Unknown Title";
//
//   chrome.storage.local.set(
//     { originalVideoUrl: videoUrl, videoTitle: videoTitle },
//     () => {
//       console.log("Stored video URL and title:", videoUrl, videoTitle);
//
//       // Redirect to survey
//       setTimeout(() => {
//         chrome.storage.local.get("surveyUrl", (data) => {
//           const surveyUrl =
//             data.surveyUrl ||
//             "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform";
//           window.location.href = surveyUrl;
//         });
//       }, 1000);
//     }
//   );
// }
//

// Listen for messages from the service worker
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "getVideoTitle") {
//     // Extract the video title from the DOM
//     // const titleElement = document.querySelector(
//     //   "ytd-watch-metadata h1 > yt-formatted-string",
//     // );
//     const titleElement = document.querySelector(
//       "ytd-watch-metadata #title > h1 > yt-formatted-string",
//     );
//     const videoTitle = titleElement
//       ? titleElement.textContent.trim()
//       : "unknown title";
//     sendResponse({ videoTitle }); // Send back the title
//   }
// });

// content.js

// 1. Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getVideoTitle") {
    // 2. Extract the video title from the DOM
    const titleElement = document.querySelector(
      "ytd-watch-metadata #title > h1 > yt-formatted-string",
    );

    // If that selector doesn't work for you, adjust as needed
    const videoTitle = titleElement
      ? titleElement.textContent.trim()
      : "unknown title";

    // 3. Send back the title
    sendResponse({ videoTitle });
  }

  // Let Chrome know we'll do async sendResponse if needed (not strictly required here)
  return true;
});
