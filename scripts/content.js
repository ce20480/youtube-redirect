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
let isEnabled = true; // Default state

// Load initial state from storage
chrome.storage.local.get("isEnabled", (data) => {
  isEnabled = data.isEnabled ?? true;
});

// Listen for state updates from the popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.hasOwnProperty("isEnabled")) {
    isEnabled = message.isEnabled;
    console.log("Extension state updated:", isEnabled);
  }
});

// Intercept video clicks only if enabled
document.addEventListener("mouseover", (e) => {
  const videoElement = e.target.closest("video");

  if (videoElement && !videoElement.dataset.intercepted) {
    videoElement.dataset.intercepted = "true";

    videoElement.addEventListener("click", (clickEvent) => {
      if (!isEnabled) return; // Do nothing if disabled

      clickEvent.preventDefault();
      const videoSrc =
        videoElement.currentSrc || videoElement.getAttribute("src");

      if (videoSrc) {
        chrome.runtime.sendMessage({ videoUrl: videoSrc });
        alert(
          "Redirecting to a productivity survey before watching the video!"
        );
      }
    });
  }
});
