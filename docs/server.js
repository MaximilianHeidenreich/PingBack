const express = require("express")
const app = express()
const port = process.env.PORT || 8080;

app.use("/", express.static("bundled"));

app.listen(port, () => { console.log(`Docs app listening on port ${port}`)});