import "./stylesheets/main.css";
import { ipcRenderer } from "electron";

const videoElement = document.querySelector("video");

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
  console.log(sourceId);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "screen",
          chromeMediaSourceId: sourceId,
          maxFrameRate: 120,
          minFrameRate: 60,
        },
      },
    });

    videoElement.srcObject = stream;
    videoElement.play();
    console.log(stream.getVideoTracks()[0].getSettings());
  } catch (e) {
    console.log("error!");
    //handleError(e);
  }
});

ipcRenderer.on("scroll", async (event, { x, y }) => {
  window.scrollTo(x, y);
});
