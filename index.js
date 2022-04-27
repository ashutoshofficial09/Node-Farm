const fs = require("fs");
const http = require("http");
//routing
const url = require("url");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUNATITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%PRODUCTNUTRIANTS%}/g, product.nutrients);
  output = output.replace(/{%DESCRIPRION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT-ORGANIC%}/g, "not-organic");
  }
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//Create Server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT-CARD%}", cardHtml);
    // console.log(cardHtml);
    res.end(output);
  }

  //Product page
  else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (req.url == "/api") {
    // API
    res.writeHead(200, { "Content-type": "text/json" });
    res.end(data);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server Started on port:8000");
});
