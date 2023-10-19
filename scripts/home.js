import { getSectors, searchForSector } from "./requests.js"

const buttonLogin = document.querySelector('.login-button-menu')
const buttonRegister = document.querySelector('.register-button-menu')
function buttonsHead(){
    buttonLogin.addEventListener('click', () =>{
        window.location.href = '/pages/login/login.html'
    })
    buttonRegister.addEventListener('click', () =>{
        window.location.href = '/pages/cadastro/register.html'
    })
}
buttonsHead()
// renderiza setores no select 
const selectSector = document.querySelector('.select')
async function selectSectors(){
        const sectors = await getSectors()
        sectors.forEach(element => {
            selectSector.insertAdjacentHTML('beforeend', `
            <option value="${element.description}">${element.description}</option>
            `)
        });     
}
selectSectors()

const ul = document.querySelector('.interprise-list')
async function selectEvent(){   
selectSector.addEventListener('change', (e) =>{
    let value = e.target.value 
    ul.innerHTML = ""
    renderCompanies(value)
})
}
selectEvent()

// renderiza empresas na ul
async function renderCompanies(value){
    searchForSector()
    const array = await searchForSector(value)
    await array.forEach(element => {
        ul.insertAdjacentHTML('beforeend', `
        <li class="interprise-li">
            <h2 class="interprise-name">${element.name}</h2>
            <p class="interprise-hour">${element.opening_hours}</p>
            <button class="setor-button">${element.sectors.description}</button>
        </li>
        `)
    });
}





