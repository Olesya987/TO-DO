const express = require('express')
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/fullName', (req, res) => {
  // YOUR CODE
});

app.post('/newArray', (req, res) => {
  // YOUR CODE
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});