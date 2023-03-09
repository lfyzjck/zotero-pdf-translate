import { TranslateTask, TranslateTaskProcessor } from "../../utils/translate";

export const openai_chatgpt = <TranslateTaskProcessor>async function (data) {
  return await chatgpt("https://api.openai.com/v1/chat/completions", data);
};


async function chatgpt(url: string, data: Required<TranslateTask>) {
  const langfrom = data.langfrom.split("-")[0] .toUpperCase()
  const langto = data.langto.split("-")[0] .toUpperCase()
  const prompts = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
        {
            role: "system",
            content: `act as a translator, please translate the following content from ${langfrom} to ${langto}:\n`
        },
        {
            role: "user",
            content: data.raw
        }
    ]
  })
  const xhr = await Zotero.HTTP.request("POST", url, {
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.secret}`,
    },
    body: prompts,
  });
  if (xhr?.status !== 200) {
    throw `Request error: ${xhr?.status}`;
  }
  data.result = xhr.response.choices["0"].message.content;
}
