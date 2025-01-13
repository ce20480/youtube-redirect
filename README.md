# YouTube Productivity Redirector

YouTube Productivity Redirector is a Chrome Extension designed to encourage mindful video consumption. Before users watch a YouTube video, they are redirected to a survey page to justify their intent. Responses are validated by an AI-powered Local LLM server, ensuring the video aligns with productive goals.

# ![Demo](images/demo.gif) <!-- Optional: Include a GIF or image of the extension in action -->

---

## Features
- **YouTube Video Detection**: Automatically redirects users attempting to watch YouTube videos.
- **Survey Page**: Users explain why they want to watch the video.
- **AI Validation**: A Local LLM evaluates responses and approves or denies access based on their productivity justification.
- **Seamless Redirection**: Approved users are redirected back to the original YouTube video.

---

## Installation

### Prerequisites
- **Google Chrome** (Version 88 or higher)
- **Python** (Version 3.8 or higher)
- **pip** for Python package installation

### Steps
1. **Clone the Repository**:
   ```
   git clone https://github.com/your-username/youtube-productivity-redirector.git
   cd youtube-productivity-redirector
   ```
2. Load the Extension:

Open Chrome and go to chrome://extensions/.
Enable "Developer Mode" in the top right.
Click "Load unpacked" and select the youtube-productivity-redirector folder.

3. Setup the LLM Server:

Install Python dependencies:
pip install -r requirements.txt
Run the server:
bash
Copy code
python server.py
The server will start at http://127.0.0.1:5000/.

4.Update Survey Logic (Optional):

Modify the evaluation prompt in server.py to better fit your use case.
Start Using the Extension:

5. Navigate to YouTube and try clicking on a video. 

The extension will redirect you to the survey page before playing the video.

6. Usage
When you click on a YouTube video, the extension:
Detects your intent to watch a video.
Redirects you to a survey page (survey.html).
Fill out the survey with your reason for watching.
If approved:
You will be redirected back to the video.
If disapproved:
You’ll see a message asking you to reconsider your reason.

7. Project Structure
youtube-productivity-redirector/
├── manifest.json           # Chrome extension manifest
├── scripts/
│   ├── background.js       # Handles YouTube video detection and redirection
│   ├── content.js          # Injects logic into YouTube pages
│   ├── survey.js           # Handles survey submission and interaction with the LLM
│   └── python/
│       ├── server.py       # Python server to evaluate survey responses
│       └── models/         # Directory to store your LLM model
├── survey/
│   ├── survey.html         # Survey page users see
│   ├── survey.css          # Styling for the survey page
├── images/                 # Images for documentation or demo
├── requirements.txt        # Python dependencies
└── README.md               # Project documentation

8. Requirements
Python Dependencies
Flask: Web framework for the LLM server
llama-cpp-python: Interface for the Local LLM model
Any additional dependencies listed in requirements.txt
Install them with:

pip install -r requirements.txt
Chrome Permissions
The following permissions are required in manifest.json:

"storage": To store temporary data like video URLs and titles.
"webNavigation": To detect navigation events on YouTube.
"scripting": To inject content scripts dynamically.
"activeTab": To interact with the currently active tab.
Contribution Guide
We welcome contributions! Here’s how you can help:

9. Fork the repository on GitHub.
Clone your fork:

git clone https://github.com/your-username/youtube-productivity-redirector.git
cd youtube-productivity-redirector
Create a branch for your feature or fix:

git checkout -b feature-name
Make your changes and test them thoroughly.
Push your branch:

git push origin feature-name
Submit a Pull Request with a detailed description of your changes.

10. Known Issues

CORS Errors:
If the LLM server doesn’t have proper CORS headers, requests from the Chrome extension may fail.
Ensure the @app.after_request method in server.py adds CORS headers.
Performance:
Large LLM models may slow down validation. Use smaller models for faster responses.
Future Enhancements
Hosting Survey Online:
Replace survey.html with a hosted survey for easier collaboration and scalability.
Support for Remote LLMs:
Integrate with APIs like OpenAI or Hugging Face for better accuracy and reliability.
Multi-Browser Support:
Extend compatibility to Firefox and Edge.
License
This project is licensed under the MIT License. See LICENSE for more details.

---

### Final Touches to Ensure Usability

To make your project even more usable for others:
1. **Add a `LICENSE` file**:
   - Include a proper license (e.g., MIT, Apache 2.0) in the repository to clarify usage rights.
2. **Create a Release**:
   - Add a `.zip` file of the unpacked extension for users who don’t want to set it up manually.
3. **Demo Media**:
   - Include a GIF or screenshots in the `images/` folder and link them in the README under "Features."
4. **Interactive Setup Script**:
   - Create a Python or shell script to automate dependency installation and server startup.
