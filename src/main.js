// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, BrowserWindow, desktopCapturer } from "electron";
import mouseEvents from "global-mouse-events";

// Special module holding environment variables which you declared in config/env_xxx.json file.
import env from "env";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    frame: false,
    width: 1000,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  if (env.name === "development") mainWindow.openDevTools();

  mouseEvents.on("mousemove", (mousePosition) => {
    moveWindow(mainWindow, mousePosition);
  });

  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      console.log(sources);
      for (const source of sources) {
        if (source.name === "Entire Screen") {
          mainWindow.webContents.send(
            "SET_SOURCE",
            /*source.id*/ "window:264040:0"
          );
          return;
        }
      }
    });
});

const moveWindow = (window, mousePosition) => {
  const { x, y } = mousePosition;
  const [width, height] = window.getSize();
  const positionX = x - width / 2;
  const positionY = y - height / 2;
  //window.setPosition(positionX, positionY);
  window.webContents.send("scroll", { x: positionX, y: positionY + 7 }); // +7 is a fix i dont know why xd
};

app.on("window-all-closed", app.quit);
