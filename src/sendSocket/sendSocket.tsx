import React from "react";
import {DS} from "system/Debugger/DS";

let client: WebSocket;

export async function connect() {
    if (!DS.useSocket) return;
    console.log("connect called");
    client = new WebSocket("ws://127.0.0.1:9917");
    client.addEventListener("open", function (event) {
        console.log("hello");
    });
}

export async function sendToPort(msg: string) {
    if (!DS.useSocket) return;
    if (client.readyState !== WebSocket.OPEN)
        return;
    client.send(msg);
}

export default sendToPort;
