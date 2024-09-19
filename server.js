// Node.js package imports
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";

// Express app creation
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// OpenAI v3 API setup
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Initial empty messages (a.k.a. prompts) array definition and initialization (will eventually contain an array of multiple message objects, i.e., multiple prompts)
let messages = [];

// Express routes
app.post("/message", (req, res) => {
  // Get the body message (a.k.a. prompt) from the posted HTTP request's body
  const message = req.body.message;

  /* Then push (i.e. add) it to your messages array.
  If it's the first message, add a some default job spec context to the message (a.k.a. prompt).
  Or else, just add the message as is.
  This is done below using the JavaScript ternary (?) operator (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) */
  messages.push({
    role: "user",
    content: messages.length
      ? message
      : `Given the following job spec, provide personalized interview advice. ${message}`,
  });

  // Send your message array (so all prompts submitted so far) to the OpenAI API and get a response back
  const response = openai.createChatCompletion({
    model: "gpt-4o",
    messages,
  });

  // Then add that response to the messages array and send it back the the client (i.e., to our frontend, Postman, etc.)
  response
    .then((result) => {
      // Add the response to the messages array
      messages.push({
        role: "assistant",
        content: result.data.choices[0].message.content,
      });

      // Send the response back to the client as JSON
      res.json({ advice: result.data.choices[0].message.content });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Spin up the Express server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
