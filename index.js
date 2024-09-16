const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const readline = require('readline');
require("dotenv").config();


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const genAI = new GoogleGenerativeAI(process.env.KEY);

//Text to Text

async function Text2Text() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  let history = []

  const chat = model.startChat({
    history:history
  })

  rl.on('line', async (prompt) => {
    if (prompt.trim().toLowerCase() === 'stop') {
      console.log("Terminating...");
      rl.close();
      return;
    }

    console.log(prompt)

    //const prompt = "INFJ & INTJ compatibility";

    //const result = await model.generateContent(prompt);

    const result = await chat.sendMessage(" Answer without any bold charcters"+prompt)
    const response = await result.response;
    const text = response.text();

    // history.push({
    //   role:"user",
    //   parts:[
    //     {text:prompt}
    //   ]
    // })

    // history.push({
    //   role:"model",
    //   parts:[{text:text}]
    // })

    console.log(text+"\n\n");
    console.log(history)
  })

  rl.on('close', () => {
    console.log('Input stream closed.');
    return
  });

  return
}

//Img/Text to Text

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function Text_Img2Text() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt =
    "Explain about the dude who draw this. Also brief about the painting itself";

  const imageParts = [fileToGenerativePart("img1.jpeg", "image/jpeg")];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

//Text to Chat

async function Text2Chat() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          { text: "Hello, I am demisexual and sapiosexual. I am also an INFJ" },
        ],
      },
      {
        role: "model",
        parts: [{ text: "God God God God" }],
      },
    ],
  });

  const msg = "What are the traits in an INFJ which'd influence it?";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

Text2Text();
//Text_Img2Text();
//Text2Chat();
