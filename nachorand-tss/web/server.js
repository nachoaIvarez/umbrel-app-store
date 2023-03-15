const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const serverHost = process.env.SERVER_HOST || "localhost";
const port = process.env.PORT || 8326;
const logsPath = "/logs";

app.get("/", async (req, res) => {
  const logs = await getLogs();
  const privilegeKey = logs.match(/token=(\S+)/)[1];

  fs.readFile("index.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    const html = data.replace("${PRIVILEGE_KEY}", privilegeKey);
    res.send(html);
  });
});

function getLogs() {
  return new Promise(async (resolve, reject) => {
    const checkLogs = setInterval(async () => {
      try {
        const logFiles = await fs.promises.readdir(logsPath);
        const logs = [];
        for (const logFile of logFiles) {
          const logData = await fs.promises.readFile(
            path.join(logsPath, logFile),
            "utf8"
          );
          logs.push(logData);
          if (logData.includes("token=")) {
            clearInterval(checkLogs);
            resolve(logs.join("\n"));
            return;
          }
        }
      } catch (err) {
        if (err.code !== "ENOENT") {
          clearInterval(checkLogs);
          reject(err);
        }
      }
    }, 1000);
  });
}

app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});
