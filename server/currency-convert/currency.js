const axios = require('axios');
const getExchangeRate = async (from, to) => {
  try {
    const res = await axios.get(`http://api.fixer.io/latest?base=${from}`);
    const rate = res.data.rates[to];
    if (!rate) throw new Error();
    return rate;
  } catch(e) {
    throw new Error(`unable to get exhange rate for ${from} and ${to}`)
  }

}

const getCountries = async (currency) => {
  try {
    const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${currency}`);
    return res.data.map(country => country.name);
  } catch(e) {
    throw new Error(`unable to get countries with code ${currency}`)
  }

}

const convertCurrency = async (from, to, amount) => {
  const countries = await getCountries(to);
  const rate = await getExchangeRate(from, to);
  const exchangedAmount = amount * rate;
  const usedInMsg = `\n---\n${to} can be used in the following countries: ${countries.join(', ')}`;
  return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${usedInMsg}`;
}

convertCurrency('USD', 'EUR', 100).then(status => console.log(status)).catch(e => console.log(e.message))
