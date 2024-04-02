// External Dependencies
import { OpenAI as openai } from "openai";

const OpenAI = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

export default OpenAI;
