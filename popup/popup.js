// document.addEventListener("DOMContentLoaded", () => {
//   const toggleButton = document.getElementById("toggle");

//   // Check current state from storage
//   chrome.storage.local.get("isEnabled", (data) => {
//     toggleButton.textContent = data.isEnabled ? "Disable" : "Enable";
//   });

//   // Toggle enable/disable
//   toggleButton.addEventListener("click", () => {
//     chrome.storage.local.get("isEnabled", (data) => {
//       const newState = !data.isEnabled;
//       chrome.storage.local.set({ isEnabled: newState }, () => {
//         toggleButton.textContent = newState ? "Disable" : "Enable";
//         console.log("Extension state changed:", newState);
//       });
//     });
//   });
// });
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggle");

  // Load initial state
  chrome.storage.local.get("isEnabled", (data) => {
    const isEnabled = data.isEnabled ?? true; // Default to enabled
    toggleButton.textContent = isEnabled ? "Disable" : "Enable";
  });

  // Handle toggle button click
  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get("isEnabled", (data) => {
      const newState = !(data.isEnabled ?? true);
      chrome.storage.local.set({ isEnabled: newState }, () => {
        toggleButton.textContent = newState ? "Disable" : "Enable";

        // Notify the content script of the change
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { isEnabled: newState });
          }
        });
      });
    });
  });
});
