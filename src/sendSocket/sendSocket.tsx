import React from "react";

let client: WebSocket;

export async function connect() {
  console.log("connect called");
  client = new WebSocket("wss://127.0.0.1:9917");
  client.addEventListener("open", function (event) {
    console.log("hello");
  });
}

export async function sendToPort(msg: string) {
  if (client.readyState === WebSocket.CLOSED) {
    client = new WebSocket("wss://127.0.0.1:9917");
    return;
  } else if (client.readyState === WebSocket.OPEN) {
    client.send(msg);
  }
}

export default sendToPort;
