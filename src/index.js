import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/country'

const DEBOUNCE_DELAY = 300;
const refs ={
    searchField : document.querySelector('#search-box'),
    countryList : document.querySelector(".country-list"),
    countryInfo : document.querySelector(".country-info")
}
// const searchField = document.querySelector('#search-box');
// const countryList = document.querySelector(".country-list");
// const countryInfo = document.querySelector(".country-info")

refs.searchField.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
	const countryName = e.target.value.trim();

	fetchCountries(countryName)
		.then(countries => {
			clearInfo();


            if (!countries) {
				throw new Error();
			}
			if (countryName === '') {
				return;
			}


			if (countries.length > 10) {
				return Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`, { position: "center-top" })
			}


			if (countries.length >= 2 && countries.length <= 10) {
				renderCountrylist(countries);
				return;
			}

			
			renderCountryInfo(countries)

		})
		.catch(() => Notiflix.Notify.failure(`Oops, there is no country with that name`, { position: "center-top" }))

}

function renderCountryInfo(countries) {
	const murkap = countries.map(country => {
		return `	<div class="country-info__item"><h2 class="country-info__title"> <img class="country-info__img" src="${country.flags.svg}" alt="${country.name.official}" width="30" height="30" /> 
		${country.name.official}</h2><p class="country-info__data"><span class="country-info__subtitle">Capital: </span>${country.capital}</p>
		<p class="country-info__data"><span class="country-info__subtitle">Population: </span>${country.population}</p>
		<p class="country-info__data"><span class="country-info__subtitle">Languages: </span>${Object.values(country.languages)}</p>
	</div>`
	}).join('');
	refs.countryInfo.insertAdjacentHTML('beforeend', murkap)
}


function renderCountrylist(countries) {
	const murkap = countries.map(country => {
		return `<li class="country-list__item"><img src="${country.flags.svg}" alt="${country.name.official}" width="30" height="30"/>
		<h2 class="country-list__title">${country.name.official}</h2></li>`
	}).join('');

	refs.countryList.insertAdjacentHTML('beforeend', murkap)
}

function clearInfo() {
	refs.countryList.innerHTML = '';
	refs.countryInfo.innerHTML = '';
}