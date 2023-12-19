var cl = console.log;
let postform = document.getElementById('postform');
// cl(postform)
let addbtn = document.getElementById('addbtn');
let updatebtn = document.getElementById('update');
let card1 = document.getElementById('card');
let titlecontrol = document.getElementById('title');
let bodycontrol = document.getElementById('body');
let useridcontrol = document.getElementById('userid');
let loader = document.getElementById('loader')

let posturl = `https://crud-application-f9285-default-rtdb.asia-southeast1.firebasedatabase.app`;


let baseurl = `${posturl}/posts.json`;

const onDelete = (ele) => {

    cl(ele);
    let deleteid = ele.closest('.card').id;
    let deleteurl = `${posturl}/posts/${deleteid}.json`;
    cl(deleteurl)

    // loader.classList.remove('d-none')
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
            fetch(deleteurl, {
                method: `DELETE`,
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then((res) => {

                    // loader.classList.add('d-none')
                    return res.json();
                })
                .then(res => {
                    document.getElementById(deleteid).remove()
                })
                .catch(err => {
                    cl(err)
                })
                .finally(()=>{
                    postform.reset()
                })
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });

        }
    })

        .finally(() => {
            postform.reset()
        })


}

const onupdate = () => {


    let updateid = localStorage.getItem('get');
    cl(updateid)
    let updateurl = `${posturl}/posts/${updateid}.json`;
    cl(updateurl)

    loader.classList.remove('d-none')
    let updatenewobj = {
        title: titlecontrol.value,
        body: bodycontrol.value,
        userid: useridcontrol.value,
        id: updateid
    }
    cl(updatenewobj);


    fetch(updateurl, {
        method: "PATCH",
        body: JSON.stringify(updatenewobj),
        headers: {
            'Content-type': 'application/json'

        }
    })

        .then((res) => {

            loader.classList.add('d-none')
            return res.json();
        })

        .then((res) => {
            let getupdateid = document.getElementById(updateid);
            cl(getupdateid);
            let childreup = [...getupdateid.children];
            cl(childreup)
            childreup[0].innerHTML = `<h2>${res.title}</h2>`
            childreup[1].innerHTML = `<p>${res.body}</p>`
            swal.fire({
                title: "Good job!",
                text: "post updated",
                icon: "success"
            });
        })
        .catch((err) => {
            cl(err)
        })
        .finally(() => {
            postform.reset();
            updatebtn.classList.add('d-none');
            addbtn.classList.remove('d-none')
        })

}

const onEdit = (ele) => {


    let editid = ele.closest('.card').id;
    localStorage.setItem('get', editid)

    let editurl = `${posturl}/posts/${editid}.json`
    cl(editurl);

    loader.classList.remove('d-none')
    fetch(editurl, {
        method: "GET",
        headers: {
            'Content-type': 'application/json'
        }

    })
        .then((res) => {

            loader.classList.add('d-none')
            return res.json();
        })
        .then((res) => {


            titlecontrol.value = res.title,
                bodycontrol.value = res.body,
                useridcontrol.value = res.userid


            cl(res)
        })
        .catch((err) => {
            cl(err)
        })

        .finally(() => {
            addbtn.classList.add('d-none');
            updatebtn.classList.remove('d-none');
        })


}

const oncreate = (ele) => {
    ele.preventDefault();
    let newobj = {
        title: titlecontrol.value,
        body: bodycontrol.value,
        userid: useridcontrol.value,


    }
    cl(newobj);

    loader.classList.remove('d-none')
    fetch(baseurl, {
        method: "POST",
        body: JSON.stringify(newobj),
        headers: {
            'Content-type': 'application/json'
        }


    })
        .then((res) => {

            loader.classList.add('d-none')
            return res.json();
        })
        .then((res) => {
            newobj.id = res.name;
            createCard(newobj)
            swal.fire({
                title: "Good job!",
                text: "post created",
                icon: "success"
            });
            cl(res);
        })
        .catch((err) => {
            cl(err)
        })
        .finally(() => {
            postform.reset();
        })

}
const objtoarr = (obj) => {
    let postarr = [];
    for (const key in obj) {
        let obj2 = obj[key];
        obj2.id = key;
        postarr.push(obj2)
        // cl(obj2)
    }
    return postarr;
}

loader.classList.remove('d-none')
fetch(baseurl)
    .then((res) => {

        loader.classList.add('d-none')
        return res.json();
    })
    .then((res) => {
        cl(res)
        let data2 = objtoarr(res);
        cl(data2)
        templatingOfPosts(data2)
    })
    .catch((err) => {
        cl(err)
    })

const templatingOfPosts = (arr) => {
    arr.forEach(posts => {
        createCard(posts)
    });
}


const createCard = (post) => {
    let card = document.createElement('div');
    card.className = "card mb-4"
    card.id = post.id;
    card.innerHTML = `
                           <div class="card-header">
                             <h2>${post.title}</h2>
                           </div>
                           <div class="card-body">
                              <p>${post.body}</p>
                           </div>
                           <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-outline-secondary cl" onclick="onEdit(this)"> edit</button>
			
                            <button class="btn btn-outline-secondary cl"onclick="onDelete(this)"> delete</button>
                           </div>
                        
                          `
    card1.append(card)

}


updatebtn.addEventListener('click', onupdate)
postform.addEventListener('submit', oncreate)