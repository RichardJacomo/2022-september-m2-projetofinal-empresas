import { searchForCompanies, 
         searchDepartments, 
         allUsers, 
         deleteUsers, 
         editDataUser,
         createDepartment,
         editDepartment,
         deleteDepartmentRequest,
         searchForUnemployedWorkers,
         hireWorker,
         firedDepartmentWorker,
         searchAllDepartments
} from "./requests.js";

const buttonTurnOff = document.querySelector('.logout-button-menu')
buttonTurnOff.addEventListener('click', () =>{
    localStorage.clear();
    window.location.replace('/index.html')
})

// função que renderiza select
const ul = document.querySelector('.ul-departments')
const selector = document.querySelector('.selector')
async function renderSelect(){
let id = ''    
    const companies = await searchForCompanies()
    companies.forEach(element => {
        selector.insertAdjacentHTML('beforeend', `
        <option value="${element.name}">${element.name}</option>
        `)
        selector.addEventListener('change', (e) =>{
            let value = e.target.value 
            if(element.name == value){
                id = element.uuid
                ul.innerHTML = ""
                renderDepartments(id)
            }
        })
    }); 
}
renderSelect()

// função que renderiza todos os departamentos de cada empresa
async function renderDepartments(id){
    const array = await searchDepartments(id)
    array.forEach(element => {
        ul.insertAdjacentHTML('beforeend', `
        <li class="li-departments">
                <h2 class="department-name">${element.name}</h2>
                <p class="department-description">${element.description}</p>
                <p class="company-name">${element.companies.name}</p>
                <div class="bottons-department">
                    <button id="eye_${element.uuid}" class="look-button no-bg">
                        <img src="/assets/img/look.png" alt="">
                    </button>
                    <button id="edt_${element.uuid}" class="edit-button-department no-bg">
                        <img src="/assets/img/edit.png" alt="">
                    </button>
                    <button id="del_${element.uuid}" class="delete-button-department no-bg">
                        <img src="/assets/img/delete.png" alt="">
                    </button>
                </div>
            </li>
        `)
        openModalEditDepartment(element.uuid)
        openModalDeleteDepartment(element.uuid, element.name)
        mainModalAdmin(element.uuid, element.name, element.description, element.companies.name)
    });
}

// função que renderiza usuários cadastrados
const ulUsers = document.querySelector('.ul-users')
async function renderUsers(){
    const users = await allUsers()
    const arr = await searchAllDepartments()
   
    users.forEach(element => {
        if(element.username !== 'ADMIN'){
            const li = document.createElement('li')
            const h2 = document.createElement('h2')
            const p1 = document.createElement('p')
            const p2 = document.createElement('p')
            const div = document.createElement('div')
            const button1 = document.createElement('button')
            const button2 = document.createElement('button')

            li.classList = 'li-users'
            h2.classList = 'users-name'
            p1.classList = 'users-description'
            p2.classList = 'company-name-users'
            div.classList = 'bottons-users'
            button1.classList = 'edit-button-users no-bg'
            button1.id = `${element.uuid}`
            button1.innerHTML = '<img src="/assets/img/edit.png" alt="">'
            button2.classList = 'delete-button-users no-bg'
            button2.id = `${element.uuid}`
            button2.innerHTML = '<img src="/assets/img/delete.png" alt="">'

            h2.innerText = `${element.username}`
            p1.innerText = `${element.professional_level}`
            const nameCompany = arr.find((e)=> e.uuid == element.department_uuid)
            if(nameCompany){
                p2.innerText = `${nameCompany.companies.name}`
            }

            ulUsers.append(li)
            li.append(h2, p1, p2, div)
            div.append(button1, button2)

        }
    });
    
    openModalDelete()
    openModalEditUser()
}
renderUsers()


// função que abre modal de deletar usuário
function openModalDelete(){
    const dialog = document.querySelector('.dialog-delete')
    const divClose = document.querySelector('.div-content-modal')
    const buttonsDelete = document.getElementsByClassName('delete-button-users')
    const array = [...buttonsDelete]
    array.forEach(element => {
        element.addEventListener('click', () =>{

            dialog.showModal()
            const name = element.parentElement.parentElement.children[0].innerText
            divClose.innerHTML = ""
            divClose.insertAdjacentHTML('beforeend', `
            <h1>Realmente deseja remover o usuário ${name}</h1>
            <button id=${element.id} class="delete-modal">Sim</button>
            `)
            deleteUser()
        })
    });
    const closeModal = document.querySelector('.close-modal')
    closeModal.addEventListener('click', ()=>{
        dialog.close()
    })
}
// função que deleta usuário
function deleteUser(){
const deleteUSerEvent = document.querySelector('.delete-modal')
deleteUSerEvent.addEventListener('click', () =>{
    let id = deleteUSerEvent.id
    deleteUsers(id)
    setTimeout(()=>{
     window.location.reload(true)
    },200)
})
}

// função para abrir modal de edição de usuário
const divEdit = document.querySelector('.div-content-modal-edit')
const dialogEdit = document.querySelector('.dialog-edit')
function openModalEditUser(){
    const buttonsDelete = document.getElementsByClassName('edit-button-users')
    const array = [...buttonsDelete]
    array.forEach(element => {
        element.addEventListener('click', () =>{
            let id = element.id
            dialogEdit.showModal()
            divEdit.innerHTML = ""
            divEdit.insertAdjacentHTML('beforeend', `
            <h1>Editar Usuário</h1>
                    <select class="select-type-work" name="select" id="type">
                        <option value="">Selecionar modalidade de trabalho</option>
                        <option value="home office">Home office</option>
                        <option value="hibrido">Hibrido</option>
                        <option value="presencial">Presencial</option>
                    </select>
                    <select class="select-professional-level" name="select" id="level">
                        <option value="">Selecionar nível de profissional</option>
                        <option value="estágio">Estagiário</option>
                        <option value="júnior">Júnior</option>
                        <option value="pleno">Pleno</option>
                        <option value="sênior">Sênior</option>
                    </select>
            <button id="${id}" type="submit" class="button-modal-edit">Editar</button>    
            `)
            editUser()
        }) 
    })
}

// função que captura valores dos selects e chama a requição para editar usuário
async function editUser(){
    let id = ''
    const elements = [...divEdit.elements]
    divEdit.addEventListener('submit', async (e) => { //pegando evento submit do botão do formulário
    e.preventDefault()
    const value = {}
    elements.forEach(element => {
         if(element.tagName == "SELECT"){ //filtrando inputs para adicionar ao value
            value[element.id] = element.value //capturando value dos inputs 
            
         }else if(element.tagName == "BUTTON"){
            id = element.id
         } 
    });
     const typeWork = value.type
     const level = value.level
     
     const body = {
     kind_of_work: typeWork,
     professional_level: level
     }
    await editDataUser(id, body)
    setTimeout(()=>{
        window.location.reload(true)
    },200)
})
const closeModalEdit = document.querySelector('.close-modal-edit')
closeModalEdit.addEventListener('click', ()=>{
    dialogEdit.close()
})
}


// função para abrir modal de criação de departamento
const selectCerate = document.querySelector('.select-create')
const formCreate = document.querySelector('.div-content-modal-create')
const dialogCreate = document.querySelector('.dialog-create')
async function openModalCreate(){
    let allCompanies = await searchForCompanies()
    const buttonCreate = document.querySelector('.button-create')   
    buttonCreate.addEventListener('click', () =>{
        allCompanies.forEach(element => {
            selectCerate.insertAdjacentHTML('beforeend', `
            <option value="${element.uuid}">${element.name}</option>
            `)
        });
        dialogCreate.showModal()
 })
 takeCreateValues()
}
openModalCreate()


//função que pega valores dos inputs e do select do modal que cria departamentos
async function takeCreateValues(){
    // let id = ''
    const elements = [...formCreate.elements]
    formCreate.addEventListener('submit', async (e) => { //pegando evento submit do botão do formulário
    e.preventDefault()
    const value = {}
    elements.forEach(element => {
         if(element.tagName == "INPUT" || element.tagName == "SELECT"){ //filtrando inputs para adicionar ao value
            value[element.id] = element.value //capturando value dos inputs     
         }
    });
     const departmentName = value.departmentName
     const description = value.description
     const createSelect = value.createSelect
     const body = {
        name: departmentName,
        description: description,
        company_uuid: createSelect,
     }
    await createDepartment(body)
    setTimeout(()=>{
        window.location.reload(true)
    },200)
})
const closeModalCreate = document.querySelector('.close-modal-create')
closeModalCreate.addEventListener('click', ()=>{
    dialogCreate.close()
})
}


// função que abre modal de edição de departamento
const dialogEditDepartment = document.querySelector('.dialog-edit-department')
async function openModalEditDepartment(id){
    const buttonEditDepartment = document.getElementById(`edt_${id}`)   
    buttonEditDepartment.addEventListener('click', () =>{
        takeEditValues(id)
        const description = buttonEditDepartment.parentElement.parentElement.children[1].innerText
        const textAreaEdit = document.querySelector('.textarea-edit-department')
        textAreaEdit.value = description
        dialogEditDepartment.showModal()
 })
}


const formEditDepartment = document.querySelector('.div-content-modal-edit-department')
//função que pega valores dos inputs e do select do modal que cria departamentos
async function takeEditValues(id){
    const elements = [...formEditDepartment.elements]
    formEditDepartment.addEventListener('submit', async (e) => { //pegando evento submit do botão do formulário
    e.preventDefault()
    const value = {}
    elements.forEach(element => {
         //if(element.tagName == "TEXTAREA"){ //filtrando inputs para adicionar ao value
            value[element.id] = element.value //capturando value dos inputs     
        //  }
    });

     const description = value.description
     const body = {
        description: description,
     }
    await editDepartment(body, id)
    setTimeout(()=>{
        window.location.reload(true)
    },200)
})
const closeModalEdit = document.querySelector('.close-modal-edit-department')
closeModalEdit.addEventListener('click', ()=>{
    dialogEditDepartment.close()
})
}

// função que abre modal que deleta departamento
const dialogDelete = document.querySelector('.dialog-delete-department')
function openModalDeleteDepartment(id, name){
const buttonDeleteDepartment = document.getElementById(`del_${id}`) 
const divDeleteDepartment = document.querySelector('.div-content-modal-delete-department')
buttonDeleteDepartment.addEventListener('click', ()=>{
    divDeleteDepartment.innerHTML = ""
    divDeleteDepartment.insertAdjacentHTML('beforeend', `
        <h1>Realmente deseja deletar o departamento ${name} e demitir seus funcionários?</h1>
        <button id="dlt_${id}" type="submit" class="button-modal-delete-department">Confirmar</button> 
    `)
    dialogDelete.showModal()
    deleteDepartment(id)
})   
}

// função que deleta departamento
async function deleteDepartment(id){
    const buttonCloseModalDelete = document.querySelector('.close-modal-delete-department')
    buttonCloseModalDelete.addEventListener('click', ()=>{
        dialogDelete.close()
    })
    const buttonDel = document.getElementById(`dlt_${id}`)  
    buttonDel.addEventListener('click', ()=>{
        deleteDepartmentRequest(id)
        setTimeout(()=>{
            window.location.reload()
        },200)
    })
}

// mainModalAdmin(id, name, description, company)
// função que abre modal detalhado de departamento
const ulWorkers = document.querySelector('.ul-look-department')
async function mainModalAdmin(id, name, description, company){
    const divLookDepartment = document.querySelector('.dialog-look-department')
    const closeModalLook = document.querySelector('.close-modal-look-department')
    const divContentModalLook = document.querySelector('.div-select')
    const buttonEye = document.getElementById(`eye_${id}`)
    buttonEye.addEventListener('click', ()=>{
        divLookDepartment.showModal()  
        ulWorkers.innerHTML = ""
        divContentModalLook.innerHTML = ""
        divContentModalLook.insertAdjacentHTML('afterbegin', `
        <h1>${name}</h1>   
        <div class="div-select-and-description">
        <div class="div-description-department">
            <h3>${description}</h3>
            <p>${company}</p>
        </div>
        <form class="form-department-look">
            <select class="select-look-department" name="select">
                <option value="">Selecione usuário</option>
            </select>
            <button class="button-look-department" type="submit">Contratar</button>
        </form>
        </div>
        
        `)
        addOptionToSelect()
        searchDepartmentWorkers(id)
        getSelectValue(id)
    })
    closeModalLook.addEventListener('click', ()=>{
        divLookDepartment.close()
    })
}
// função que adiciona opções ao select de usuários desempregados
async function addOptionToSelect(){
    const divModalLook = document.querySelector('.select-look-department')
    const usersWithouJob = await searchForUnemployedWorkers()
    usersWithouJob.forEach(element => {
        divModalLook.insertAdjacentHTML('beforeend', `
        <option value="${element.uuid}">${element.username}</option>
        `)
    });
}

// função que caaptura value do select para enviar para requisição que contrata funcionários para o departamento
async function getSelectValue(id){
const buttonLookDepartment = document.querySelector('.button-look-department') 
const selectLookDepartment = document.querySelector('.select-look-department')
let body = {}
    buttonLookDepartment.addEventListener('click', (e)=>{
        e.preventDefault()
        const userId = selectLookDepartment.value
        body = {
            user_uuid: userId,
            department_uuid: id,
         }
        hireWorker(body)
        setTimeout(()=>{
            window.location.reload()
        },200)
    })
}


// função que compara id de todos os usuários com o departamento escolhido para renderizar na tela
async function searchDepartmentWorkers(id){ 
let workers = []     
    const dataWorkers = await allUsers()
    dataWorkers.forEach(element => {
            if(id == element.department_uuid){
                workers.push(element)
                renderDepartmentWorkers(workers)
            }
        });
}
// função que renderiza trabalhadores de um departamento na tela
function renderDepartmentWorkers(workers){
    // const ulWorkers = document.querySelector('.ul-look-department')
    ulWorkers.innerHTML = ""
    workers.forEach(element => {
        ulWorkers.insertAdjacentHTML('beforeend', `
        <li id="lis_${element.uuid}" class="li-look-department">
        <h3>${element.username}</h3>
        <p>${element.professional_level}</p>
        <p>Company Name</p>
        <div class="div-button-fired">
             <button id="usr_${element.uuid}" class="button-fired">Desligar</button>
         </div>
         </li> 
        `)
        firedWorker(element.uuid)
    });
}

// função que captura evento no botão de demitir e chama requisição
function firedWorker(id){
    const buttonFired = document.getElementById(`usr_${id}`)
    const li = document.getElementById(`lis_${id}`)
    buttonFired.addEventListener('click', ()=>{
            firedDepartmentWorker(id)
            li.remove()
    })
}





















