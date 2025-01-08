chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.videoUrl) {
    const surveyUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSeJ7uD_DhqQUjwUwrqg3tPnzuD5FkONkjvEPXCvjsUtBYk_6A/viewform?usp=header";
    chrome.storage.local.set({ originalVideoUrl: message.videoUrl }, () => {
      chrome.tabs.update(sender.tab.id, { url: surveyUrl });
    });
  }
});
