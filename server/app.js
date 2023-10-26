require('dotenv').config()

const express = require('express');
const app = express();
const port = 4000;
const PontoControle = require("./PontoControle/PontoControle");

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000/ponto-de-controle");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });

app.get('/ponto-de-controle', (req, res) => {
  PontoControle().then(json => {
    res.send(json)
  }).catch(err => {
    console.log(err)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
