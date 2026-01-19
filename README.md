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
- Enter the API for Gemini and ChatGPT if using.
- Code editor, I used Visual Studio Code (VS Code).
- Compatible browser like Chrome, Firefox and etc.
- Poppler is installed on your machine: https://poppler.freedesktop.org/

# How it works and looks:

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

6. As long as the models you have installed and models in the frontend match, with the correct capabilities (vision or non-vision) it should work.
