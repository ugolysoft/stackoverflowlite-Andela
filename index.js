var app = require("./server");

var port = process.env.PORT || 3000;
const client = require("./db");

app.listen(port, function() {
  console.log(`server up: http://localhost:${port}`);
  client.userTB();
});
