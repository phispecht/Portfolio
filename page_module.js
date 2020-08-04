const fs = require("fs");
const filePath = __dirname + "/projects";

exports.linksTo = function () {
    let link = "";
    const dir = fs.readdirSync(filePath);
    for (let i = 0; i < dir.length; i++) {
        link +=
            "<a style='font-size: 24px; text-decoration:none; color: purple; background: lightblue'; href='http://localhost:8080/" +
            dir[i] +
            "'>" +
            dir[i] +
            " Project" +
            "</a></br></br>";
    }
    return link;
};
