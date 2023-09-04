const express = require("express");

const app = express();

app.use(express.static(__dirname + "/www"));

app.get("*", async function (req, res) {
    res.sendFile(__dirname + "/www/index.html");
});

app.listen(process.env.PORT || 8080);