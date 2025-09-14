let cl = console.log;

const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const contentControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const submitpost = document.getElementById('submitpost')
const updatePost = document.getElementById('updatePost')
const postContainer = document.getElementById('postContainer')
const loader = document.getElementById('loader')


let BASE_URL = 'https://crud-27f49-default-rtdb.firebaseio.com'
let POST_URL = `${BASE_URL}/posts.json`
// cl(POST_URL)

const snackBar = (msg, icon) => {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 2000
  })
}

const postTemplating = (arr) => {
  let result = ``;
  arr.forEach(blog => {
    result += `<div class="col-md-4 my-4 d-flex">
            <div class="card h-100 w-100" id="${blog.id}">
                <div class="card-header">
                    <h4>${blog.title}</h4>
                </div>
                <div class="card-body">
                    <p>${blog.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick = "onEdit(this)" class="btn btn-primary">Edit</button>
                    <button onclick = "onRemove(this)" class="btn btn-danger">Remove</button>
                </div>
            </div>
        </div>`
  })

  postContainer.innerHTML = result
}
// edit
const onEdit = (ele) => {
  let Edit_Id = ele.closest('.card').id
  cl(Edit_Id)
  localStorage.setItem('Edit_Id', Edit_Id)
  let Edit_URL = `${BASE_URL}/posts/${Edit_Id}.json`

  makeApiCall('GET', Edit_URL, null)
}



// updatePost
const onUpdatePost = () => {
  let Update_Id = localStorage.getItem('Edit_Id')
  cl(Update_Id)
  let Update_URL = `${BASE_URL}/posts/${Update_Id}.json`
  let Update_Obj = {
    title: titleControl.value,
    body: contentControl.value,
    userId: userIdControl.value,
    id: Update_Id
  }
  cl(Update_Obj)
    postForm.reset();
  makeApiCall('PATCH', Update_URL, Update_Obj)
  
}


// remove
const onRemove = (ele) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      let Remove_Id = ele.closest('.card').id
      localStorage.setItem('Remove_Id', Remove_Id)
      cl(Remove_Id)
      let Remove_URL = `${BASE_URL}/posts/${Remove_Id}.json`

      makeApiCall('DELETE', Remove_URL, null)
    }
  });
}
// generic function
const makeApiCall = (methodName, url, msgBody) => {
 // loader.classList.remove('d-none')
  let xhr = new XMLHttpRequest()
  xhr.open(methodName, url)
  xhr.onload = () => {
    //loader.classList.add('d-none')
    if (xhr.status >= 200 && xhr.status <= 299) {
      let obj = JSON.parse(xhr.response)
      cl(obj)

      if (methodName === 'GET' && url === POST_URL) {
        let dataArr = []
        for (const key in obj) {
          obj[key].id = key
          dataArr.push(obj[key])
        }
        postTemplating(dataArr)
        snackBar(`Data is fetched successfully!!!`, 'success')
      } else if (methodName === 'GET') {
       // snackBar(`${obj.title} successfully!!!`, 'success')

        titleControl.value = obj.title
        contentControl.value = obj.body
        userIdControl.value = obj.userId

        submitpost.classList.add('d-none')
        updatePost.classList.remove('d-none')
         window.scrollTo({top:0, behavior:'smooth'});

      } else if (methodName === 'POST') {
        postForm.reset()
        let newId = obj.name;
        msgBody.id = newId;
        let col = document.createElement('div')
        col.className = 'col-md-4 my-4 d-flex'
        col.innerHTML = `<div class="card h-100 w-100" id="${msgBody.id}">
                            <div class="card-header">
                                <h4>${msgBody.title}</h4>
                            </div>
                            <div class="card-body">
                                <p>${msgBody.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick = "onEdit(this)" class="btn btn-primary">Edit</button>
                                <button onclick = "onRemove(this)" class="btn btn-danger">Remove</button>
                            </div>
                        </div>`
        postContainer.prepend(col)
        snackBar(`New post is added successfully!!!`, 'success')
      } else if (methodName === 'PATCH') {
        snackBar(`${msgBody.title} is updated succussfully!!!`, 'success')
        postForm.reset()
        let card = document.getElementById(msgBody.id)
        let h4 = card.querySelector('h4')
        let p = card.querySelector('p')
        h4.innerHTML = msgBody.title
        p.innerHTML = msgBody.body

        submitpost.classList.remove('d-none')
        updatePost.classList.add('d-none')
      } else if (methodName === 'DELETE') {
        let Remove_Id = localStorage.getItem('Remove_Id')
        let card = document.getElementById(Remove_Id).parentElement
        card.remove()
        snackBar('This data is removed successfully!!!', 'success')
         postForm.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
   
      }
    }
  }
  let msg = msgBody ? JSON.stringify(msgBody) : null
  xhr.send(msg)
}

// initial fetch
makeApiCall('GET', POST_URL, null)


const onSubmitPost = (eve) => {
  eve.preventDefault()
  let postObj = {
    title: titleControl.value,
    body: contentControl.value,
    userId: userIdControl.value
  }
  cl(postObj)
  makeApiCall('POST', POST_URL, postObj)
}


updatePost.addEventListener('click', onUpdatePost)
postForm.addEventListener('submit', onSubmitPost)