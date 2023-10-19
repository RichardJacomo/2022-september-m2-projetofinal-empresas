import { getLocalStorage } from "./localStorage.js";
import { searchDataUser,
        searchForUnemployedWorkers,
        allCoWorkers, 
        editInfoUser,
        searchUserDepartment
    } 
from "./requests.js";

const verifyPermission = () => {
    const user = getLocalStorage()

    if(user == ""){
        window.location.replace('/index.html')
    }
}
verifyPermission()

const buttonTurnOff = document.querySelector('.logout-button-menu')
buttonTurnOff.addEventListener('click', () =>{
    localStorage.clear();
    window.location.replace('/index.html')
})

// função que renderiza dados do usuário logado
const sectionDataUser = document.querySelector('.user-information')  
async function renderDataUser(){  
const divDataUser = document.querySelector('.div-edit')
    const data = await searchDataUser()
    sectionDataUser.insertAdjacentHTML('beforeend', `
    <h1 class="username-profile">${data.username}</h1>
    <div class="user-data">
        <div class="div-edit">
            <h3 class="user-email">${data.email}</h3>
            <h3 class="user-profession">${data.professional_level}</h3>
            </div>
        <button data-control-modal="modal-edit" class="button-edit"><img src="/assets/img/pen.png" alt=""></button>
    </div> 
    
    `)
    
    if(data.kind_of_work !== null){
      divDataUser.insertAdjacentHTML('beforeend', `
      <h3 class="type-work-user">${data.kind_of_work}</h3>
      `)  
    }
    editUserData()
}
renderDataUser()

// função que renderiza dados de colegas de empresa caso o usuário logado seja contrado
async function renderDataCoWorkers(){
let coWorkers = []  
let array = []  
let arrayWorkers = []
let value = 0;
    const sectionCompanies = document.querySelector('.companies')
    const ulCoWorkers = document.querySelector('.colegues')
    let idDataBase = []
    const userData = await searchDataUser()
    const unemployedWorkers = await searchForUnemployedWorkers()
    let idUser = userData.uuid
    unemployedWorkers.forEach(element => {
          idDataBase.push(element.uuid) 
    });
    const id = idDataBase.find((e) => e == idUser);
    const arr = await searchUserDepartment()
    
    if(id){
        sectionCompanies.innerHTML = ""
        sectionCompanies.insertAdjacentHTML('beforeend', `
            <div class="unemployed-message">
                <h1>Você ainda não foi contrado</h1>
            </div>
        `)
    //    mensagem de desempregado
    }
    else if(!id){
        coWorkers = await allCoWorkers()
        array.push(coWorkers)
        arrayWorkers = array[0][0].users

        sectionCompanies.insertAdjacentHTML('afterbegin', `
        <div class="div-title-companies">
            <h1 class="title-companies">${arr.name} - ${arr.departments[0].name}</h1>
        </div>
        
        `)
        arrayWorkers.forEach(element => {
            ulCoWorkers.insertAdjacentHTML('beforeend', `
            <li class="li-colegues">
                <h3 class="name-colegues">${element.username}</h3>
                <h3 class="profession-colegues">${element.professional_level}</h3>
            </li>
            `)   
        });      
    }
}
renderDataCoWorkers()
allCoWorkers()


// função que abre modal de edição de dados do usuário
async function editUserData(){

const buttonsControllersModal = document.querySelectorAll("[data-control-modal]")
for(let index = 0; index < buttonsControllersModal.length; index++){
    buttonsControllersModal[index].addEventListener("click", ()=>{
        let modalId = buttonsControllersModal[index].getAttribute("data-control-modal")
        document.getElementById(modalId).classList.toggle("show-modal")
        eventEdit()
    })
}    
}

const eventEdit = () => {
    const form = document.querySelector('.form-edit')
    const inputUsername = document.querySelector('#username')
    const inputEmail = document.querySelector('#email')
    const inputPass = document.querySelector('#password')
    const button = document.querySelector('.button-edit-modal')
    const elements = [...form.elements] //buscando elements de form e transformando em array

    form.addEventListener('submit', async (e) => { //pegando evento submit do botão do formulário
        e.preventDefault()
        const value = {}
        elements.forEach(element => {
             if(element.tagName == "INPUT"){ //filtrando inputs para adicionar ao value
                value[element.id] = element.value //capturando value dos inputs 
             } 
        });
         const username = value.username
         const email = value.email
         const password = value.password
         
         const body = {
         username: username,  
         email: email,
         password: password,
         }
         setTimeout(()=>{
            window.location.reload()
         },500)
        await editInfoUser(body) 
    })
}
