import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';


const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const list = document.querySelector('.country-list');

searchInput.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY))

function searchCountry(event) {
  const searchValue = event.target.value.trim();
  countryInfo.innerHTML = ''
  list.innerHTML = ''
  if (!searchValue) {
    return
  }
  fetchCountries(searchValue)
    .then(data => {
      console.log(data)
      if (data.length === 1) {
        const markup = countryMarkup(data[0])
        addMarkup(markup, countryInfo)
      }

      if (data.length > 1 && data.length <= 10) {
        const markup = countriesMarkup(data)
        addMarkup(markup, list)
      }
      if (data.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
      };
    })
    .catch(error => Notify.failure(`${error}`))
}



function countryMarkup(data) {
  const { flags, name, capital, languages, population } = data

  return `<div>
            <img src="${flags.svg}" alt="${name.official}"></img>
            <p class="name"><span>${name.common}</span></p>
          </div>
          <p class="capital">capital:<span class="text">${capital}</span></p>
          <p class="languages">languages:<span class="text">${Object.values(languages).join(',')}</span></p>
          <p class="population">population:<span class="text">${population}</span></p>`

}

function countriesMarkup(countries) {
  return countries.reduce((acc, { flags, name }) => acc +
    `<li class="list__item">
            <div class="list__image">
                <img  src="${flags.svg}" alt="flag ${name.official}">
            </div>
            <p class="list__name">${name.common}</p>
         </li>
        `
    , '');
}


function addMarkup(markup, elem) {
  elem.insertAdjacentHTML('beforeend', markup)
}