import { register } from "./requests.js"

function clickEventsRegister(){
const buttonBackToHome = document.querySelector('.button-return')
const buttonBackToLoginTwo = document.querySelector('.login-button-menu')
    buttonBackToHome.addEventListener('click', ()=>{
        window.location.href = '/index.html'
    })
    buttonBackToLoginTwo.addEventListener('click', ()=>{
        window.location.href = '/pages/login/login.html'
    })

}
clickEventsRegister()

const eventRegister = () => {
    const form = document.querySelector('.form-register')
    const elements = [...form.elements] //buscando elements de form e transformando em array
    const inputUser = document.querySelector('#username')
    const inputEmail = document.querySelector('#email')
    const inputPass = document.querySelector('#password')
    const button = document.querySelector('.button-register')
  
    form.addEventListener('input', () =>{
        if(inputUser.value.length > 0 && inputEmail.value.length > 0 && inputPass.value.length > 0){
            button.removeAttribute('disabled')
        }else{
            button.setAttribute('disabled', 'disabled')
        }
    })

    form.addEventListener('submit', async (e) => { //pegando evento submit do botão do formulário
        e.preventDefault()

        const value = {}

        elements.forEach(element => {
             if((element.tagName == "INPUT" || element.tagName == "SELECT") && (element.value !== "")){ //filtrando inputs para adicionar ao value
                value[element.id] = element.value //capturando value dos inputs
             } 
        });
         const username = value.username
         const email = value.email
         const password = value.password
         const level = value.select

         const body = {
         username: username,
         password: password,
         email: email,
         professional_level: level
         }


        await register(body)
    })
}   

eventRegister()



