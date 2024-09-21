
let session;

const createPromptSession = async () => {
  const { available } = await ai.assistant.capabilities();

  if (available !== "no") {
    if (!session) {
      console.log('## Create session ##');

      session = await ai.assistant.create({
        systemPrompt: "you're an English teacher",
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        }
      });

      return session;
    }

    return session;
  }

  console.error('# Error - assistant is not available');
  return undefined;
}

const sendTextToAssistant = async (sentence) => {
  try {
    const promptSession = await createPromptSession();
    const clonedSession = await promptSession.clone();

    // Prompt the model and wait for the whole result to come back.
    // const result = await clonedSession.prompt(`Can you provide feedback on the following English sentence. Sentence: ${sentence}`);
    // const streaming = await clonedSession.promptStreaming(`My english on the following sentence is good? Sentence: ${sentence}`);
    // const streaming = await clonedSession.promptStreaming(`What should I improve on the following sentence in English. Sentence: ${sentence}`);
    const streaming = await clonedSession.promptStreaming(`Give me feedback about the grammar on the following sentence in English. Sentence: ${sentence}`);
    return streaming;
  } catch (error) {
    console.error(error);
  }
};

export default sendTextToAssistant;
