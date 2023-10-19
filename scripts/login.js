import { login } from "./requests.js";

//função para pegar dados dos inputs
const eventLogin = () => {
    const form = document.querySelector('.form-login')
    const inputEmail = document.querySelector('#email')
    const inputPass = document.querySelector('#password')
    const button = document.querySelector('.button-login')
    const elements = [...form.elements] //buscando elements de form e transformando em array
    form.addEventListener('input', () =>{
        if(inputEmail.value.length > 0 && inputPass.value.length > 0){
            button.removeAttribute('disabled')
        }else{
            button.setAttribute('disabled', 'disabled')
        }
    })
    form.addEventListener('submit', async (e) => { //pegando evento submit do botão do formulário
        e.preventDefault()
        const value = {}
        elements.forEach(element => {
             if(element.tagName == "INPUT" && element.value !== ""){ //filtrando inputs para adicionar ao value
                value[element.id] = element.value //capturando value dos inputs 
             } 
        });
         const email = value.email
         const password = value.password

         const body = {
         email: email,
         password: password,
         }
        await login(body)
    })
}
eventLogin()

function clickEventLogin(){
    const buttonRegister = document.querySelector('.button-back-to-register')
    const buttonRegisterTwo = document.querySelector('.register-button-menu')
    buttonRegister.addEventListener('click', (e)=>{
        window.location.href = '/pages/cadastro/register.html'
    })
    buttonRegisterTwo.addEventListener('click', (e)=>{
        window.location.href = '/pages/cadastro/register.html'
    })
}
clickEventLogin()




