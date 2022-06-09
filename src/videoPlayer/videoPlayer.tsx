// ts
import React from "react";
import Player from "react-player";

export function VideoPlayer() {
  return (
    <Player
      url="https://www.youtube.com/watch?v=feiToPhrzcI&ab_channel=%E6%B0%B4%E6%9B%9C%E6%97%A5%E3%81%AE%E3%82%AB%E3%83%B3%E3%83%91%E3%83%8D%E3%83%A9"
      controls={false}
      playing={true}
      muted={true}
    />
  );
}
