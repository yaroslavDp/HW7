const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");

  const templatePath = path.join(__dirname, process.argv[2]);
  const dataPath = path.join(__dirname, process.argv[3]);

  fs.readFile(templatePath, "utf-8", (err, HTMLtemplate) => {
    if (err) {
      console.error(`Error reading template file: ${err}`);
      res.end("Error reading template file");
      return;
    }
    fs.readFile(dataPath, "utf-8", (err, data) => {
      if (err) {
        console.error(`Error reading data file: ${err}`);
        res.end("Error reading data file");
        return;
      }

      try {
        const dataObj = JSON.parse(data);
        const renderedTemplate = HTMLtemplate.replace(/{{\s*(\w+(\.\w+)*)\s*}}/g, (match, p1) => {
            const [prop1, prop2] = p1.split('.');
            let val = dataObj;
            if (!val.hasOwnProperty(prop1)) {
              return '';
            }
            if(prop2){
              let nestedObj = dataObj[prop1];
              return nestedObj[prop2];
            }
            else {
              return val[prop1];
            }
            
          }
        );

        res.end(renderedTemplate);
      } catch (err) {
        console.error(`Error parsing data file: ${err}`);
        res.end("Error parsing data file");
        return;
      }
    });
  });
});

server.listen(3000, () => {
  console.log("Server started at http://localhost:3000/");
});
