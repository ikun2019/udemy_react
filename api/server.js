const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json(), express.urlencoded({ extended: false }), cors());

app.get('/', (req, res) => {
  res.send({
    message: 'Hello World'
  });
});

app.listen({ port: 8080 }, () => {
  console.log('Server is running!');
});