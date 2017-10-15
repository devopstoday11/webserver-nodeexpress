const yargs = require('yargs');
const axios = require('axios');
const fs = require('fs');
const { weather_key } = require('./SECRET_KEYS');

const argv = yargs
  .options({
    a: {
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    },
    d: {
      alias: 'default',
      describe: 'Flag to save the address as default',
      boolean: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

function main() {
  const defaultJsonPath = 'defaultAddress.json';
  const defaultExists = fs.existsSync(defaultJsonPath);
  let address = argv.address;
  const loadDefault = !address && defaultExists;  

  if (loadDefault) {
    address = JSON.parse(fs.readFileSync(defaultJsonPath)).default;
    console.log('using default address...');
  } else if (!address) {
    console.log('No address passed in and no default address exists');
    return false;
  }
  
  if (argv.default && address) {
    console.log(`Default address saved: ${address}`)    
    fs.writeFileSync(defaultJsonPath, JSON.stringify({default: address}));
  }
  const encodedAddress = encodeURIComponent(address);
  const geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
  
  axios.get(geocodeUrl)
    .then(response => {
      if (response.data.status === 'ZERO_RESULTS') throw new Error('Unable to find that address.');
      const { lat, lng } = response.data.results[0].geometry.location;
      console.log(response.data.results[0].formatted_address);
      const weatherUrl = `https://api.darksky.net/forecast/${weather_key}/${lat},${lng}`;    
      return axios.get(weatherUrl);
    })
    .then(response => {
      const { temperature, apparentTemperature, summary } = response.data.currently;
      console.log(`Weather is: ${summary}. It is ${temperature} and feels like ${apparentTemperature}`);
    })
    .catch(e => {
      if (e.code=== 'ENOTFOUND') console.log('Unable to connect to server');
      console.log(e.message);
    });
}

main();