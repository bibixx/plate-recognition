const path = require('path');
const fs = require('fs');
const request = require('request');

const {
  API_HOST,
  SECRET_KEY
} = require('./config');

const getPlates = (imagePath) => new Promise((resolve, reject) => {
  const formData = {
    image: fs.createReadStream(imagePath),
  };

  request.post({
    url: `${API_HOST}/v2/recognize?secret_key=${SECRET_KEY}&country=eu&topn=1`,
    formData: formData
  }, (err, httpResponse, body) => {
    if (err) {
      return console.error('Error: ', err);
    }

    try {
      const json = JSON.parse(body);

      resolve(json);
    } catch (e) {
      reject(e);
    }
  });
})

module.exports = getPlates;
