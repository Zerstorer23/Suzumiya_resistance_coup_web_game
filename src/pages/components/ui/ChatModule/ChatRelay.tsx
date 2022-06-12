import React from "react";
import {DS} from "system/Debugger/DS";

let client: WebSocket;
let lastTime = 0;

export async function connect() {
    if (!DS.useChatRelay) return;
    const elapsedInMills = Date.now() - lastTime;
    if (elapsedInMills <= 10 * 1000) return;
    console.log("중계기 연결시도");
    client = new WebSocket("ws://127.0.0.1:9917/");
    client.addEventListener("open", function (event) {
        console.log("중계기 연결됨");
    });
    client.addEventListener("close", function (event) {
        console.log("중계기 연결끊김");
    });
    /*    client.addEventListener('message', function (event) {
            // console.log('Message from server ', event.data);
        });*/
    lastTime = Date.now();
}

export async function sendToPort(msg: string) {
    if (!DS.useChatRelay) return;
    if (client === undefined || client.readyState !== WebSocket.OPEN) {
        connect();
        return;
    }
    client.send(msg);
}

export default sendToPort;
