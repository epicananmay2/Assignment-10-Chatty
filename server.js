/* 
 Name: Ananmay Rajan
 Class: CSC 337
 Description: server.js shows the different server requests using express & mongoose DB for the simple chatty web app.
 Date: 03/08/2023
*/
const express = require("express");
const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  time: Number,
  alias: String,
  message: String,
});

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

const port = process.env.PORT || 5000;
const dbURL = "mongodb://127.0.0.1:27017/chatty";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/chats", async (req, res) => {
  try {
    const msgs = await ChatMessage.find({}).sort({ time: -1 }).exec();
    return res.json({ ok: true, data: msgs });
  } catch (e) {
    return res.json({ ok: false, message: "Server error" });
  }
});

app.post("/chats/post", async (req, res) => {
  const { alias, message } = req.body;
  const msg = { alias, message, time: new Date().getTime() };
  try {
    const newMsg = await ChatMessage.create(msg);
    newMsg.save();
    return res.json({ ok: true });
  } catch (e) {
    return res.json({ ok: false, message: "Server error" });
  }
});

mongoose
  .connect(dbURL)
  .then(() => console.log("Connected to Database"))
  .catch(() => console.log("Error connecting to Database"));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
