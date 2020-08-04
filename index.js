const http = require("http");
const fs = require("fs");
const path = require("path");
const pm = require("./page_module");

const extObj = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
};

http.createServer((req, res) => {
    if (req.method !== "GET") {
        res.statusCode = 405; // method not allowed!!
        return res.end();
    }

    const filePath = __dirname + "/projects" + req.url;

    if (!path.normalize(filePath).startsWith(__dirname + "/projects")) {
        res.statusCode = 403;
        console.log("INTRUDER ALERT!");
        return res.end();
    }

    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.log("error in fs.stat: ", err);

            res.statusCode = 404;
            return res.end();
        }
        console.log("filePath: ", filePath);
        if (stats.isFile()) {
            console.log("its a file!");

            const extension = path.extname(filePath);

            for (var format in extObj) {
                if (format == extension) {
                    res.setHeader("content-type", extObj[format]);
                }
            }

            const readStreamHtml = fs.createReadStream(filePath);
            readStreamHtml.pipe(res);
        } else {
            console.log("its a directory!");

            if (req.url.endsWith("/")) {
                const readStreamHtml = fs.createReadStream(
                    filePath + "/index.html"
                );

                fs.stat(filePath + "/index.html", function (err) {
                    if (!err) {
                        readStreamHtml.pipe(res);
                    } else {
                        res.statusCode = 404;
                    }
                });

                readStreamHtml.on("error", (err) => {
                    console.log(err);
                    res.statusCode = 500;
                    res.end();
                });
            } else {
                res.statusCode = 302;
                res.setHeader("Location", req.url + "/");
                res.end();
            }
        }
        if (req.url == "/") {
            res.setHeader("content-type", "text/html");
            let links = pm.linksTo();
            res.write(links);
            res.end();
        }
    });
}).listen(8080, () => console.log("portfolio up and running!"));
