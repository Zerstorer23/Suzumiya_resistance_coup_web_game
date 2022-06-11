import React, { useState } from "react";
import { w3cwebsocket } from "websocket";

let client: w3cwebsocket;

export async function connect() {
  client = new w3cwebsocket("wss://127.0.0.1:9917/");
  client.onopen = () => {
    console.log("connected to server");
  };
}

//const [chatMessage, setChatMessage] = useState("");

export async function sendToPort(msg: string) {
  if (client.readyState === w3cwebsocket.CLOSED) {
    //infinite loop?
    return;
  } else if (client.readyState === w3cwebsocket.OPEN) {
    client.send(msg);
  }
}

export default sendToPort;
