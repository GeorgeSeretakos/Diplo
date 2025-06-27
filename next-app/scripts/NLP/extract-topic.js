import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";
import buildTopicClassificationPrompt from "./prompts/topic_extraction_prompt.js";

dotenv.config({ path: "../../.env" });

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function classifySpeech(speech) {
  const prompt = buildTopicClassificationPrompt(speech);

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 150,
      temperature: 0.2,
      messages: [
        { role: "user", content: prompt },
      ]
    }),
  });

  const response = await client.send(command);
  const decoded = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(decoded);
  const response_message = parsed.content?.[0]?.text ?? "";
  return response_message.trim();
}

const exampleSpeech = `
Κυρίες και κύριοι συνάδελφοι, Θα ήθελα να αφιερώσω λίγο χρόνο για να μιλήσω για την αξία της ευγένειας στον πολιτικό λόγο. Σε μια εποχή όπου ο δημόσιος διάλογος συχνά κυριαρχείται από αντιπαραθέσεις και εντάσεις, είναι σημαντικό να υπενθυμίζουμε στον εαυτό μας την ανάγκη για σεβασμό και κόσμιο ύφος. Ο πολιτικός μας πολιτισμός είναι δείκτης της ποιότητας της δημοκρατίας μας.
`;

classifySpeech(exampleSpeech)
  .then((topics) => {
    console.log(topics);
  })
  .catch(console.error);
