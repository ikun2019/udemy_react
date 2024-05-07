const HttpError = require('../models/http-error');

const axios = require('axios');

async function getCoordsForAddress(address) {
  const uri = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(address)}&inputtype=textquery&fields=geometry&key=${process.env.API_KEY}`
  const response = await axios.get(uri);
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("住所が見つかりません", 422);
    throw error;
  }

  const coordinates = data.candidates[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;