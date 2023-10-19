import { getLocalStorage } from "./localStorage.js"
// import { renderDepartments } from "./adminPage.js"

const baseUrl = "http://localhost:6278"
const tokenAdmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjczOTBhZGYtMzhhNy00Y2VlLTg5ZWQtYzJiYWVmMzY4YmZmIiwiaXNfYWRtaW4iOnRydWUsImlhdCI6MTY2NjkxNzQyMywiZXhwIjoxNjY3NzgxNDIzLCJzdWIiOiJbb2JqZWN0IFVuZGVmaW5lZF0ifQ.1VEwu65jMWZXistVAMZrjTjkJ1KzsADjj08j-VPDlOA"

async function validateUser(body){
    let token = ""
            const request = await fetch(baseUrl + "/auth/login", {
                method: "Post",
                headers:{
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify(body)   
            }) 
            const response = await request.json()
            token = response.token
   
        try{
            const request = await fetch(baseUrl + "/auth/validate_user", {
                method: "Get",
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }, 
            })
            const response = await request.json()
            return response
        }catch(err){
            console.log(err)
        }
    }

async function login(body){
const responseMessage = document.querySelector('.response-message')
const h3Response = document.querySelector('.response-content')
    try{
        const request = await fetch(baseUrl + "/auth/login", {
            method: "Post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)    
        })
        const response = await request.json()
        if(response.error == "email invalid!"){
            responseMessage.style.backgroundColor = "#CE4646"
                h3Response.innerText = "Email ou senha incorreto" 
                responseMessage.classList.remove('none')
                setTimeout(()=>{
                  responseMessage.classList.add('none')
                },2500)

        }

        const admin = await validateUser(body)
        const validate = await admin.is_admin

         if( validate === false){
            if(request.ok == false){
                responseMessage.style.backgroundColor = "#CE4646"
                h3Response.innerText = "Email ou senha incorreto" 
                responseMessage.classList.remove('none')
                setTimeout(()=>{
                  responseMessage.classList.add('none')
                },2500)
            }else if(request.ok == true){
              responseMessage.style.backgroundColor = "#4BA036"
              h3Response.innerText = "Login bem sucedido" 
              responseMessage.classList.remove('none')
              setTimeout(()=>{
                responseMessage.classList.add('none')
              },2500)
    
                localStorage.setItem("user", JSON.stringify(response))
                setTimeout(()=>{
                    window.location.replace('/pages/UserPage/userPage.html')
                }, 3000)
            }
          }
         if(validate === true && request.ok == true){
            if(request.ok == false){
                responseMessage.style.backgroundColor = "#CE4646"
                h3Response.innerText = "Email ou senha incorreto" 
                responseMessage.classList.remove('none')
                setTimeout(()=>{
                  responseMessage.classList.add('none')
                },2500)
            }else if(request.ok == true){
              responseMessage.style.backgroundColor = "#4BA036"
              h3Response.innerText = "Login bem sucedido" 
              responseMessage.classList.remove('none')
              setTimeout(()=>{
                responseMessage.classList.add('none')
              },2500)
    
                localStorage.setItem("user", JSON.stringify(response))
                setTimeout(()=>{
                    window.location.replace('/pages/adminPage/adminPage.html')
                }, 3000)
            }
        }
    }catch(err){
        console.log(err)
    }
}

async function register(body){
const responseMessage = document.querySelector('.response-message')
const h3Response = document.querySelector('.response-content')  
    try{
        const request = await fetch(baseUrl + "/auth/register", {
            method: "Post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)    
        })  
        
        if(request.ok){
            responseMessage.style.backgroundColor = "#4BA036"
            h3Response.innerText = "Cadastro bem sucedido" 
            responseMessage.classList.remove('none')
            responseMessage.classList.remove('none')
            setTimeout(()=>{
                responseMessage.classList.add('none')
            },2500)
            setTimeout(()=>{
                window.location.replace('/pages/login/login.html')
            },3000)
        }else{
            responseMessage.style.backgroundColor = "#CE4646"
            h3Response.innerText = "Erro no cadastro" 
            responseMessage.classList.remove('none')
            setTimeout(()=>{
                responseMessage.classList.add('none')
            },2500)
        }
    }catch(err){
        console.log(err)
    }
}

// função que busca todos os setores existentes
async function getSectors(){
    const localStorage = getLocalStorage()

    try{
        const request = await fetch(baseUrl + "/sectors", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        const response = await request.json()
        return response   
    }catch(err){
        console.log(err)
    }
}

// requisição que busca empresas pelo setor desejado na pageHome
async function searchForSector(sector){
        try{
            const request = await fetch(baseUrl + `/companies/${sector}`, {
                method: "Get",
                headers:{
                    "Content-Type": "application/json",
                    'Authorization': "Bearer null"
                },   
            })     
            const response = await request.json()
            return response      
        }catch(err){
            console.log(err)
        }
}


// requisição que busca dados do usuário logado
async function searchDataUser(){
    const localStorage = getLocalStorage()
    try{
        const request = await fetch(baseUrl + "/users/profile", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        const response = await request.json()
        return response   
    }catch(err){
        console.log(err)
    }   

}

// requisição que busca usuários sem departamento
async function searchForUnemployedWorkers(){
    try{
        const request = await fetch(baseUrl + "/admin/out_of_work", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            }
        })
        const response = await request.json()
        return response
    }catch(err){
        console.log(err)
    } 
}

// requisição que busca todos os funcionários do mesmo departamento (está com defeito na API)
async function allCoWorkers(){
    const localStorage = getLocalStorage()
    try{
        const request = await fetch(baseUrl + "/users/departments/coworkers", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        const response = await request.json()
        return response
    }catch(err){
        console.log(err)
    } 
}


// requisição que edita dados do usuário na página userPage
async function editInfoUser(body){
    const localStorage = getLocalStorage()
    try{
        const request = await fetch(baseUrl + "/users", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify(body) 
        })
        const response = await request.json()
        return response
    }catch(err){
        console.log(err)
    } 
}
// requisição que busca todas as empresas para o select da página admin
async function searchForCompanies(){
    try{
        const request = await fetch(baseUrl + `/companies`, {
            method: "Get",
            headers:{
                "Content-Type": "application/json",
                'Authorization': "Bearer null"
            },   
        })     
        const response = await request.json()
        return response      
    }catch(err){
        console.log(err)
    }
}

// requisição que busca todos os departamentos de uma empresa selecionada no select da admin page
async function searchDepartments(id){
    try{
        const request = await fetch(baseUrl + `/departments/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            }
        })
        const response = await request.json()
        return response
    }catch(err){
        console.log(err)
    }
}


// requisição que busca todos os usuários
async function allUsers(){
    try{
        const request = await fetch(baseUrl + `/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            }
        })
        const response = await request.json()
      
        return response
    }catch(err){
        console.log(err)
    }
}

// requisição para deletar usuários na page admin
async function deleteUsers(id){
    try{
        const request = await fetch(baseUrl + `/admin/delete_user/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            }
        })
        const response = await request.json()
        return response
    }catch(err){
        console.log(err)
    }
}
// requisição para editar informações de usuários
async function editDataUser(id, body){
    try{
        const request = await fetch(baseUrl + `/admin/update_user/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify(body) 
        })
    }catch(err){
        console.log(err)
    }
}

// requisição que cria novo departamento
async function createDepartment(body){
    try{
        const request = await fetch(baseUrl + `/departments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify(body) 
        })
      
    }catch(err){
        console.log(err)
    }
}

// requisição que edita descrição de partamento
async function editDepartment(body, id){
    try{
        const request = await fetch(baseUrl + `/departments/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify(body) 
        })
    }catch(err){
        console.log(err)
    }
}

// requisição que deleta departamento
async function deleteDepartmentRequest(id){
    try{
        const request = await fetch(baseUrl + `/departments/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
        })
    }catch(err){
        console.log(err)
    }
}

// requisição que contrata funcionários
async function hireWorker(body){
    try{
        const request = await fetch(baseUrl + `/departments/hire/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
            body: JSON.stringify(body) 
        })
    }catch(err){
        console.log(err)
    }
}

// requisição que demite funcionário de departamento
async function firedDepartmentWorker(id){
    try{
        const request = await fetch(baseUrl + `/departments/dismiss/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAdmin}`
            },
        })
    }catch(err){
        console.log(err)
    }
}

// requisição que busca todos departamentos da empresa do usuário logado
async function searchUserDepartment(){
    const localStorage = getLocalStorage()
    try{
        const request = await fetch(baseUrl + "/users/departments", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        const response = await request.json()
        return response
    }catch(err){
        console.log(err)
    } 
}

// requisição que busca todos os departamentos
async function searchAllDepartments(){
    const localStorage = getLocalStorage()
    try{
        const request = await fetch(baseUrl + "/departments", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        const response = await request.json()
        return response
    }catch(err){
        console.log(err)
    } 
}




export{
    login,
    register,
    getSectors,
    searchForSector,
    searchDataUser,
    searchForUnemployedWorkers,
    allCoWorkers,
    editInfoUser,
    searchForCompanies,
    searchDepartments,
    allUsers,
    deleteUsers,
    editDataUser,
    createDepartment,
    editDepartment,
    deleteDepartmentRequest,
    hireWorker,
    firedDepartmentWorker,
    allCoWorkers,
    searchUserDepartment,
    searchAllDepartments
}
