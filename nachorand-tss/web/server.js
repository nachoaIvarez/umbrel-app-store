const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const logsDir = "/logs";

async function fetchPrivilegeKey() {
  return new Promise((resolve, reject) => {
    fs.readdir(logsDir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const logFile = path.join(logsDir, files[0]);

      fs.readFile(logFile, "utf8", (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const privilegeKeyMatch = data.match(/token=([a-zA-Z0-9+\/_]+)/);

        if (privilegeKeyMatch) {
          resolve(privilegeKeyMatch[1]);
        } else {
          reject(new Error("Privilege Key not found in logs."));
        }
      });
    });
  });
}

app.get("/", async (req, res) => {
  try {
    const privilegeKey = await fetchPrivilegeKey();
    const indexPath = path.join(__dirname, "index.html");
    fs.readFile(indexPath, "utf8", (err, htmlContent) => {
      if (err) {
        res.status(500).send("Error reading index.html: " + err.message);
        return;
      }

      const interpolatedHtml = htmlContent.replace(
        "${PRIVILEGE_KEY}",
        privilegeKey
      );
      res.send(interpolatedHtml);
    });
  } catch (error) {
    res.status(500).send("Error fetching Privilege Key: " + error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
