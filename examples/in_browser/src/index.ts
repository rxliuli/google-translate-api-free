// setting up cors-anywhere server address
import { Translator } from 'google-translate-api-browser'
import axios from 'axios'

const rInp = document.getElementById('root__input') as HTMLInputElement
const rTra = document.getElementById('translated') as HTMLDivElement
const rBut = document.getElementById('root__button') as HTMLButtonElement

const translator = new Translator(async (url) => {
  return axios.get('http://cors-anywhere.herokuapp.com/' + url)
})

rBut.addEventListener('click', () => {
  rTra.innerHTML = '...'
  translator
    .translate(rInp.value, { to: 'en' })
    .then((res) => {
      rTra.innerHTML = res.text
    })
    .catch((err) => {
      console.error(err)
    })
})
