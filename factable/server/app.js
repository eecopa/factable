import http from "http";
import url from "url";
import path from "path";
import fs from "fs";
import mime from "mime";
import WebSocket from "ws";
import { RunMode } from "./types";

const IS_DEV = process.env.NODE_ENV !== RunMode.PROD;
const IS_TEST = process.env.NODE_ENV === RunMode.TEST;

const resolvePath = (p) => path.resolve(__dirname, p);

const fileExists = (path) => {
  return new Promise((resolve, reject) => {
    console.log("LOOKING FOR: ", path);
    fs.access(path, (err) => {
      if (err) {
        console.log("NO EXISTE: ", path);
        // reject(err);
        resolve({ exists: false, path, isDir: false });
        return;
      }

      const isDir = fs.statSync(path).isDirectory();

      resolve({ exists: true, path, isDir });
    });
  });
};

const pageTitle = "Factable Admin";

const getHTML = ({
  title,
  styleTags = "",
  bundles = [],
  linkTags = "",
  scriptElements = [],
  includeScripts = true,
  rootId = "root",
  basePath = false,
  bundlesPath = "/",
}) => {
  const _title_ = title;
  const bundleTags = bundles.map(
    (bundle) => `<script src="${bundlesPath}${bundle}" defer></script>`
  );

  const _bundle_tags_ = includeScripts ? bundleTags.join("\n") : ``;

  const _script_elements_ = includeScripts ? scriptElements.join("\n") : ``;

  return `
    <html>
      <head>
          <title>${_title_}</title>
          ${basePath ? `<base href="${basePath}">` : ""}
          ${styleTags}
          ${includeScripts ? linkTags : ""}
      </head>
      <body>
        <div id="${rootId}">loading..</div>
        ${_bundle_tags_}
        ${_script_elements_}
      </body>
    </html>
  `;
};

const createHttpServer = () => {
  return http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname;
    const filePath = resolvePath(`../client/${uri}`);

    console.log("NEW REQUEST: ");
    console.log("uri: ", uri);
    console.log("filename: ", filePath);

    if (uri === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(getHTML({ title: pageTitle }));
      res.end();
      return;
    }

    fileExists(filePath)
      .then(({ exists, path, isDir }) => {
        console.log("PETE: ", path, exists);
        if (!exists) {
          throw new Error("NOT FOUND!!");
        }
        if (isDir) {
          return fileExists(`${path}/index.html`);
        }
        return { exists, path, isDir };
      })
      .then(({ exists, path, isDir }) => {
        if (!exists) {
          throw new Error("NOT FOUND!!");
        }
        return { exists, path, isDir };
      })
      .then(({ exists, path, isDir }) => {
        // if (fs.statSync(path).isDirectory()) path += "/index.html";

        fs.readFile(path, "binary", (err, file) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write(err + "\n");
            res.end();
            return;
          }

          res.writeHead(200, { "Content-Type": mime.getType(path) });
          res.write(file, "binary");
          res.end();
        });
      })
      .catch((err) => {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found\n");
        res.write(`ERROR: ${err}`);
        res.end();
        return;
      });
  });
};

const App = (done) => {
  const httpServer = createHttpServer();
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
      console.log("received: %s", message);
    });

    ws.send("something");
  });

  const doneInternal = (from) => () => {
    if (typeof done === "function") {
      done(from, httpServer)();
    }
  };

  console.log("app.js", {
    "process.env.NODE_ENV": process.env.NODE_ENV,
    DEV: IS_DEV,
    TEST: IS_TEST,
  });

  if (IS_DEV && !IS_TEST) {
    console.log("app.js", "STARTING APP!!");
    doneInternal("DEV")();
  } else {
    doneInternal("PROD")();
  }

  return httpServer;
};

export default App;
