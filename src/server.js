const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer')
const fs  = require('fs')
const upload = multer({ dest: './uploads/' });

const getPlates = require('./getPlates');

const app = express();
const PORT = 3000;

let vehiclesInside = [];

app.use(bodyParser.json());

app.post('/image', upload.single('image'), async (req, res) => {
  res.end();
  const { file: { path } } = req;

  console.log("Got image, processing...");

  const plates = await getPlates(path);
  console.log(`${plates.results.length} cars found: ${plates.results.map(({ plate }) => plate).join(', ')}`);

  fs.unlink(path, () => {});
})

app.post('/count', upload.single('image'), async (req, res) => {
  res.end();
  const { file: { path } } = req;

  console.log("Got image, processing...");

  const { plate } = (await getPlates(path)).results[0];

  if (plate) {
    if (vehiclesInside.indexOf(plate) >= 0) {
      vehiclesInside = vehiclesInside.filter(p => p !== plate);
    } else {
      vehiclesInside.push(plate);
    }
  }

  console.log(`Cars inside: ${vehiclesInside.join(', ')}`);

  fs.unlink(path, () => {});
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})
