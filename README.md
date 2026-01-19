# Scriptalyze - Writing Analyser

Scriptalyze is a writing-analysis tool designed to help users improve their writing without rewriting it for them. Unlike most AI tools that simply rewrite the text or provide a feedback in mono-style format, Scriptalyze focuses on understanding your writing style, identifying strengths and weaknesses, and delivering clear, colour-coded feedback that’s easy to scan and act on.

# Why I created it?

As I worked on improving my own writing, I ran into the same issues repeatedly:

1. AI tools require repetitive prompt

AI writing assistants may output with a “better version” with a list of changes, unless you don’t engineer your prompt each time to give specific feedback.

2. Feedback often becomes a wall of text.

Without structure, colour-coding or visual cues, AI feedback can be difficult to scan. Important details get buried.

3. Sensitive documents shouldn’t be uploaded to external servers.

CVs and personal writing often contain private information. Using cloud-based AI, especially free to use, is a privacy concern.

# Requirements

- Ensure you have node installed.
- Have Ollama and models you want to use ready.
- Enter the API for Gemini if using.
- Code editor, I used Visual Studio Code (VS Code).
- Compatible browser like Chrome, Firefox and etc.
- Poppler is installed on your machine: https://poppler.freedesktop.org/

# How it works and looks:
<img width="1130" height="1227" alt="Screenshot 2025-12-17 180618" src="https://github.com/user-attachments/assets/39c1bfba-46d2-4bca-909a-dc3c02789570" />
<img width="1118" height="1245" alt="Screenshot 2025-12-17 180557" src="https://github.com/user-attachments/assets/ae862be4-0d6a-40c6-9863-1e58179752e4" />
<img width="1118" height="1194" alt="Screenshot 2025-12-17 161032" src="https://github.com/user-attachments/assets/22ca8a4f-9f94-41cc-8cf2-2e7cfed5125a" />
<img width="1122" height="1153" alt="Screenshot 2025-12-17 173203" src="https://github.com/user-attachments/assets/1bf4b886-44b0-4833-a3e1-81d29ac8b40e" />
<img width="1234" height="638" alt="Screenshot 2025-12-17 163343" src="https://github.com/user-attachments/assets/993dd79f-167f-492f-965e-4f278a395bec" />
<img width="1085" height="1226" alt="Screenshot 2025-12-17 160933" src="https://github.com/user-attachments/assets/1d750e5b-624f-4882-b881-ade3b817377b" />
<img width="1059" height="516" alt="Screenshot 2025-12-17 152220" src="https://github.com/user-attachments/assets/81139830-cf7e-486a-98cc-fbd58e5d7f43" />

# How to run it?

1. Clone the project or download all the files.

2. Open the terminal and enter the frontend directory and enter the following command.

```bash
npm i
```

3. Repeat step 2 for the backend directory.

4. Open the ollama app -> Settings -> Toggle ON the "Expose Ollama to the network" so other devices / apps can access Ollama. Double check what port your that you Ollama API is running on, if it is the default

5. The models names, type etc are hard coded, so if some of the models you want to use are missing than add them following the structure in the code. If there is a model you are not using either remove it or mark the field enable as false in home.tsx -> const models to disable the model.

6. Create a `.env` file to save the server port and gemini key to

```env
GEMINI_API_KEY=""
PORT=5001
```

7. Start the backend server, by running:

```bash
nodemon server.js
```

_If the server fails to start, the port may be conflicting in that case, change the port number_

8. Start the frontend, by running:

```bash
npm run dev
```

9. As long as the models you have installed and models in the frontend match, with the correct capabilities (vision or non-vision) the backend will figure out which method to run for the given input.
