# PrepInTime

An AI-powered, personalised job interview advice chatbot.

## Live Demo Website

### https://prepintime.onrender.com

## Tech Stack

OpenAI GPT-4o mini LLM, OpenAI API, custom AI prompts, Node, Express, JavaScript, HTML, CSS.

## Overview

PrepInTime is a tailored job interview advice chatbot that delivers personalised guidance based on job specifications, company research, and technical skills. Powered by OpenAI’s GPT-4o mini LLM, it utilises custom prompts for reliability and safety.

## Usage

#### General Usage

1. Access the chatbot using the live website link above, or install and run it locally using the installation instructions below.
2. Then copy and paste any job spec text into the PrepInTime chatbot's "Job Spec or Question" box.
3. Optionally, enter your knowledge about the company and your current skills into the relevant sections, too.
4. Hit `<Enter>`, and PrepInTime will give you tailored advice to help you ace your interview!

Need more info on the company or have technical or behavioural questions?  
Just ask, we've got you covered (use the "Job Spec or Question" box for follow-up questions).

#### Usage Tips

- Hit `<Enter>` in any input box to get your interview advice.
- Or hit `<Shift+Enter>` in any of the input boxes for a new line (similar to ChatGPT).
- **Then, scroll down to see your interview advice.**
- For optimal advice and a complete gap analysis, make sure you fill out the "Company Knowledge" and "Skills" sections.

## Installation

1. Clone the GitHub repository to your local machine.

2. After cloning the GitHub repository, create a `.env` file in the root of your local Git repository folder. Then copy and paste the following line into your local .env file and save it.
   OPENAI_API_KEY=`YOUR_OPENAI_API_KEY_GOES_HERE`

3. Run `npm install` in your terminal to install all project dependencies.

4. Run `npm run dev` in your terminal to start an automatically restarting express server (implemented using nodemon). Alternatively, run `npm start` to start the express server in production mode (in production mode, the express server won't restart automatically on code changes).

5. Navigate to http://localhost:3000 in your browser to view the PrepInTime frontend website and get your interview advice.
