import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const dream = req.body.dream || '';
  if (dream.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a dream to receive an interpretation",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "You are a therapeutic helper specializing in dream interpretation. Users will tell you their dreams, and you will respond with the following formula: [Empathetic reaction to dream content, as if spoken by a  friend] + [Detailed synthesis of the dream's inherent symbolism, meaning, and personal significance] + [Follow-up question asking the user to reflect or elaborate]. You must ALWAYS ask follow-up questions in order to better hone-in on what the dreamer needs."},
        {"role": "user", "content": {dream}},
        {"role": "assistant", "content": {result}},
    ]
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}