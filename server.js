/*
Node.js package imports
*/
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import markdownit from "markdown-it"; // https://github.com/markdown-it/markdown-it
import "dotenv/config";

/*
Global variable definitions and initializations
*/
// Initial empty messages (a.k.a. prompts) array definition and initialization (will eventually contain an array of multiple message objects, i.e., multiple prompts)
let messages = [];
// Prompt prefixes (including guardrails, etc.)
const promptPrefix = `You are a chatbot that only gives job interview, company, technical, and behavioural-related responses and nothing else!

Based on the provided job specification, give me personalised interview advice to ace the job interview. Or answer my follow-up question regarding the job spec.
  
Here is the job spec or follow-up question:`;
let previousCompanyKnowledge = "";
let previousSkills = "";

/*
Express app creation
*/
const app = express();

/*
Middleware setup
*/
app.use(cors());
app.use(bodyParser.json());

/*
OpenAI v3 API setup
*/
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

/*
Express routes
*/
// Post route to handle the user's prompts (i.e., prompt) and return the chatbot's response
app.post("/message", (req, res) => {
  // Get the body (so, the user's prompts) from the posted HTTP request's body
  const { jobSpecQuestion, companyKnowledge, skills } = req.body;

  // Create a prompt modifier based on the user's company knowledge and skills, and whether they are specified in the first place or have changed since the last submit.
  let promptSuffix = "";

  if (
    companyKnowledge &&
    skills &&
    (companyKnowledge !== previousCompanyKnowledge || skills !== previousSkills)
  ) {
    promptSuffix += `
After giving me personalised interview advice or answering my follow-up question regarding the job spec, also do the following...
Do a gap fit analysis between what I know and what the job spec requires.
Next, tell me how much time I need to spend preparing for the interview in hours, based on the above criteria, and up to a maximum of 10 hours.
Then, give a rounded overall rating out of 10 on how well prepared I am for the interview based on what I know about the company and my current skill set.`;
  }

  if (companyKnowledge && companyKnowledge !== previousCompanyKnowledge) {
    promptSuffix += `
    
Take what I know about the company and its culture into account for your response, which is:
${companyKnowledge}.`;
  }

  if (skills && skills !== previousSkills) {
    promptSuffix += `
    
Take my current skill set into account for your response, which is:
${skills}.`;
  }

  previousCompanyKnowledge = companyKnowledge;
  previousSkills = skills;

  // Create the final prompt by combining the prompt prefix, the user's input, and the prompt suffix
  const finalPrompt = `${promptPrefix}

    ${jobSpecQuestion}

    ${promptSuffix}`;

  // console.log(finalPrompt); // Debug code

  // Then push (i.e. add) the final prompt to the messages array
  messages.push({
    role: "user",
    content: finalPrompt,
  });

  // Make the request to the OpenAI API to get the chatbot's response
  const response = openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: messages,
  });

  // Then add that response to the messages array and send it back the the client (i.e., to our frontend, Postman, etc.)
  response
    .then((result) => {
      // Add the chatbot's response to the messages array
      messages.push({
        role: "assistant",
        content: result.data.choices[0].message.content,
      });

      // Parse the markdown in the chatbot's response to HTML using markdown-it
      const md = markdownit();
      const parsedMarkdown = md.render(result.data.choices[0].message.content);

      // Send the response back to the client as JSON
      res.json({ advice: parsedMarkdown });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Post route to reset the chatbot's state (i.e., to clear the messages array)
app.post("/reset", (req, res) => {
  // Reset the messages array
  messages = [];

  // Send a response back to the client
  res.json({ message: "Chatbot history and context cleared." });
});

/*
Express server spin up
*/
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
