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
const promptPrefix = `You are a chatbot that only gives job interview, company, technical and behavioural related responses.
  Given the following job spec, provide personalized interview advice based on job specification.
  Also take what I know about the company culture into account.
  And use my skills to do a gap fit analysis of what I know and what the job spec requires.
  Tell me how much additional time I need to spend preparing for the interview in hours, based on the above criteria, and up to a maximum of 10 hours.
  Finally, give an overall rating out of 10 of how well I am prepared for the interview based on what I know about the company and my current skill set.`;

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
// Post route to handle the user's message (i.e., prompt) and return the chatbot's response
app.post("/message", (req, res) => {
  // Get the body message (so, the user's prompt) from the posted HTTP request's body
  // const message = req.body.message;
  const { companyCulture, skills, message } = req.body;

  /* Then push (i.e. add) it to your messages array.
  If it's the first message, add a some default job spec context to the message (a.k.a. prompt).
  Or else, just add the message as is.
  This is done below using the JavaScript ternary (?) operator (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) */
  messages.push({
    role: "user",
    content: `${promptPrefix}. Data for the response... Job spec or question: ${message}. Current company culture knowledge: ${companyCulture}. Current skill set: ${companyCulture}`,
  });

  // Send your message array, filtered for only user prompts (not for chatbot responses), to the OpenAI API and get a response back
  const userMessages = messages.filter((message) => message.role === "user");

  const response = openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: userMessages,
  });

  // Then add that response to the messages array and send it back the the client (i.e., to our frontend, Postman, etc.)
  response
    .then((result) => {
      // Add the chatbot's response to the messages array
      messages.push({
        role: "chatbot",
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
