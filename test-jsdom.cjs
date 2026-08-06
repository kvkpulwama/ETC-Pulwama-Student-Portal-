const { JSDOM } = require('jsdom');
JSDOM.fromURL("http://localhost:3000", { runScripts: "dangerously", resources: "usable" }).then(dom => {
  dom.window.document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      console.log("BODY:", dom.window.document.body.innerHTML.substring(0, 500));
    }, 2000);
  });
}).catch(console.error);
