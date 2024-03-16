let usersList = document.querySelector(".users-list")
let postsList = document.querySelector(".posts-list")
let commentsList = document.querySelector(".comments-list")

let elModalWrapper = document.querySelector(".modal-wrapper")
let elModal = document.querySelector(".modal")

const getData = async(URL) => {
    const res = await fetch(URL)
    const data = await res.json()
    return data
}

usersList.innerHTML = "Loading..."
getData("https://jsonplaceholder.typicode.com/users").then(res =>{
    getUsers(res, usersList)
})

// user
function getUsers(arr, list){
    list.innerHTML = ``
    arr.map(item => {
        let elItem = document.createElement("li")
        elItem.className = `bg-orange-400 p-3 rounded-[20px]`
        elItem.innerHTML = `
            <p><span class="font-bold">ID: </span>${item.id}</p>
            <p><span class="font-bold">Name: </span>${item.name}</p>
            <p><span class="font-bold">Username: </span>${item.username}</p>
            <p><span class="font-bold">Phone: </span>${item.phone.split(" ")[0]}</p>
            <p><span class="font-bold">Email: </span>${item.email}</p>
            
            <div class="mt-3">
                <button onclick="userClick(${item.id})" class="w-[100px] p-2 rounded-[10px] bg-teal-500 text-white">Show post</button>
                <button onclick="submitUser(${item.id})" class="w-[100px] p-2 rounded-[10px] bg-red-500 text-white">Submit</button>
                <button onclick="submitDocUser(${item.id})" class="w-[100px] p-2 rounded-[10px] bg-green-500 text-white">Submit Doc</button>
            </div>
        `
        list.appendChild(elItem)
    })
}


const CHAT_ID = "-1002124708047"
const TOKEN = "7071855466:AAERi8WOMHdpxcX1P9gUuth2mGAOuB_IJYI"
const URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`
const URL2 = `https://api.telegram.org/bot${TOKEN}/sendDocument`


function submitUser(id){
    elModalWrapper.classList.add("open-modal")

    getData(`https://jsonplaceholder.typicode.com/users/${id}`).then(res => {
        elModal.innerHTML = `
            <form class="flex flex-col gap-5 submit-form">
                <label class="flex flex-col w-[40%] mx-auto">
                    <span>Username</span>
                    <input value=${res.name} class="p-2 rounded-[10px]" required name="userName" type="text" placeholder="username:"/>
                </label>
                <label class="flex flex-col w-[40%] mx-auto">
                    <span>Phone</span>
                    <input value=${res.phone.split(" ")[0]} class="p-2 rounded-[10px]" required name="userPhone" type="tel" placeholder="phone:"/>
                </label>
                <button type="submit" class="bg-teal-500 text-white font-bold mt-4 p-3 rounded-[10px] mx-auto w-[40%]">Submit</button>
            </form>
        `

        let elForm = document.querySelector(".submit-form")
        elForm.addEventListener("submit", function(e) {
            e.preventDefault()
            let message = `<b>Order:</b> \n`
            message += `<b>id: ${id}</b> \n`
            message += `<b>username: ${e.target.userName.value}</b> \n`
            message += `<b>phone: ${e.target.userPhone.value}</b> \n`


            axios.post(URL, {
                chat_id: CHAT_ID,
                parse_mode: "HTML",
                text: message,
            })
            .then(res =>{
                elModalWrapper.classList.remove("open-modal")
            })

        })
    })

}

function submitDocUser(){
    elModalWrapper.classList.add("open-modal")
    elModal.innerHTML =`
        <form class="flex flex-col doc-form" >
            <input name="fileInput" type="file"/>
            <button type="submit" class="bg-teal-500 text-white font-bold mt-4 p-3 rounded-[10px] mx-auto w-[40%]">Submit</button>
        </form>
    `

    let elDocForm = document.querySelector(".doc-form")
    let formdata = new FormData()

    elDocForm.addEventListener("submit", function(e){
        e.preventDefault()
        formdata.append("chat_id", CHAT_ID )
        formdata.append("document", e.target.fileInput.files[0])

        axios.post(URL2, formdata,{
            headers:{"Content-type":"multipart/form-data"}
        }).then(res =>{
            console.log(res);
        })
    })
}

// post
function userClick(id){
    postsList.innerHTML = `Loading...`;
    getData(`https://jsonplaceholder.typicode.com/posts?userId=${id}`).then(res =>{
        getPosts(res, postsList)
    })
}

function getPosts(arr, list){
    list.innerHTML = ``
    arr.map(item => {
        let elItem = document.createElement("li")
        elItem.className = `bg-orange-400 p-3 rounded-[20px]`
        elItem.innerHTML = `
            <p><span class="font-bold">ID: </span>${item.id}</p>
            <p><span class="font-bold">User ID: </span>${item.userId}</p>
            <p><span class="font-bold">Title: </span>${item.title}</p>
            <p><span class="font-bold">Body: </span>${item.body}</p>
            
            <div class="mt-3">
                <button onclick="postClick(${item.id})" class="w-[150px] p-2 rounded-[10px] bg-teal-500 text-white">Show Comment</button>
            </div>
        `
        list.appendChild(elItem)
    })
}

// comment
function postClick(id){
    commentsList.innerHTML = `Loading...`;
    getData(`https://jsonplaceholder.typicode.com/comments?postId=${id}`).then(res =>{
        getComment(res, commentsList)
    })
}

function getComment(arr, list){
    list.innerHTML = ``
    arr.map(item => {
        let elItem = document.createElement("li")
        elItem.className = `bg-orange-400 p-3 rounded-[20px]`
        elItem.innerHTML = `
            <p><span class="font-bold">ID: </span>${item.id}</p>
            <p><span class="font-bold">Post ID: </span>${item.postId}</p>
            <p><span class="font-bold">Name: </span>${item.name}</p>
            <p><span class="font-bold">Email: </span>${item.email}</p>
            <p><span class="font-bold">Body: </span>${item.body}</p>
            
        `
        list.appendChild(elItem)
    })
}


elModalWrapper.addEventListener("click", function(e) {
    if(e.target.id == "modal-wrapper"){
        elModalWrapper.classList.remove("open-modal")
    }
})


// telegram
