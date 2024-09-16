const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const readline = require('readline');
require("dotenv").config();


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const genAI = new GoogleGenerativeAI(process.env.KEY);

const Text2Text = async () => {
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

    const result = await chat.sendMessage(" Answer without any bold charcters"+prompt)
    const response = await result.response;
    const text = response.text();

    console.log(text+"\n\n");
    console.log(history)
  })

  rl.on('close', () => {
    console.log('Input stream closed.');
    return
  });

  return
}

Text2Text();