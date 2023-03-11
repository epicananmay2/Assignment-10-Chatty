/* 
 Name: Ananmay Rajan
 Class: CSC 337
 Description: script.js shows the different case requests for the simple chatty web app.
 Date: 03/08/2023
*/
const form = document.querySelector("form");
const aliasEl = document.getElementById("alias");
const messageEl = document.getElementById("message");
const chatContainer = document.querySelector(".chat-container");
const getURL = "/chats";
const postURL = "/chats/post";
let interval;
let scroll = true;

function getMessages() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", getURL);
  xhr.onload = () => {
    if (xhr.status != 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      console.log("result", xhr.response);
      const res = JSON.parse(xhr.responseText);
      const msgs = res.data;
      msgs.reverse();
      let chatsHtml = "";
      msgs.forEach((msg) => {
        chatsHtml += `<p class="message"><b>${msg.alias}:</b> ${msg.message}</p>`;
      });
      chatContainer.innerHTML = chatsHtml;
      if (scroll) {
        scroll = false;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  };

  xhr.onerror = () => console.log("Request failed");
  xhr.send();
}

function sendMessage(e) {
  e.preventDefault();
  const alias = aliasEl.value;
  const message = messageEl.value;
  const data = {
    alias,
    message,
  };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", postURL);
  xhr.onload = () => {
    if (xhr.status != 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      console.log("result", xhr.response);
      messageEl.value = "";
      scroll = true;
    }
  };

  xhr.onerror = () => console.log("Request failed");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}

form.addEventListener("submit", sendMessage);

getMessages();
interval = setInterval(getMessages, 1000);
