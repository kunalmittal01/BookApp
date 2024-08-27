let disp = document.getElementsByClassName('disp')[0];
let sidebar = document.getElementsByClassName('sidebar-cont')[0];
let usersArray = localStorage.getItem('usersArray') || [];

async function fetchBooksData() {
    let data = await fetch('https://books-backend.p.goit.global/books/top-books');
    let book = await data.json();
    return book;
}
let wraper = document.createElement('div');
async function displayBooks(query) {
    let books = await fetchBooksData();
    console.log(books);
    disp.innerHTML = '';
    let span = "",rem = "", h1 = document.createElement("h1");
    if(query == "All categories") {
            h1.innerHTML = "Best Sellers <span id='book-dec'>Books</span>"
    }
    else {
        let i = query.length - 1;
        for(i; i >= 0; i--) {
            if(query[i] != ' ') {
                span += query[i];
            }
            else {
                i--;
                break;
            }
        }
        for(i; i >= 0; i--) {
            rem += query[i];
        }
        span = span.split('').reverse().join('');
        rem = rem.split('').reverse().join('');
        h1.innerHTML = `${rem} <span id='book-dec'>${span}</span>`
        books = books.filter(book => book.list_name == query);
        console.log(books);
        
    }
    disp.prepend(h1);
    wraper.classList.add('book-wraper');
    books.forEach(book => {
        let div = document.createElement('div');
        div.classList.add('book-cont');
        if(query == 'All categories') {
            div.innerHTML = `
            <h3>${book.list_name}</h3>
        `
        }
        let div2 = document.createElement('div');
        div2.classList.remove('books');
        div2.classList.add('book-design-wrap');
        for(let i = 0; i < book.books.length; i++) {
            let div3 = document.createElement('div');
            div3.classList.add('book-design');
            div3.classList.remove('book-cont');
            div3.innerHTML = `
                <img src="${book.books[i].book_image}" alt="Book Cover">
                <h4>${book.books[i].title}</h4>
                <p>${book.books[i].author}</p>
            `
            div3.onclick = ()=> showDetails(book.books[i]);
            div3.addEventListener('mouseenter', (e) => showEffects(e.target));
            div3.addEventListener('mouseleave', (e)=> hideEffects(e.target));
            div3.classList.add('book');
            div2.appendChild(div3);
            if(query == "All categories") {
                div3.classList.add('book-cont');
                div2.classList.add('books');
                div2.classList.remove('book-design-wrap');
                div3.classList.remove('book-design');
                if(i == 2) {
                    break;
                }
            }
        }
         div.appendChild(div2);
         if(query == "All categories") {
            let div4 = document.createElement('div');
            div4.classList.add('seebtn-cont');
            div4.innerHTML = `<button class="see-btn" onclick="addMore(this,'${book.list_name}')">SEE MORE</button>`
            div.appendChild(div4);
         }
         wraper.appendChild(div);  
    });
    disp.appendChild(wraper);
}

window.onload = async()=> await displayBooks('All categories');

function filterBooks(e) {
    let query = e.target.innerText;
    disp.innerHTML = '';
    wraper.innerHTML = '';
    console.log(e.target.innerText);
    displayBooks(query);  
}

sidebar.addEventListener('click', filterBooks);

async function addMore(ref, query) {
    let par = ref.parentElement.parentElement;
    let books = await fetchBooksData();
    let moreBooks = books.filter(book => book.list_name == query);
    wraper.innerHTML = '';
    let div = document.createElement('div');
    div.classList.add('book-design-wrap');
    moreBooks.forEach(book => {
        for(let i = 0; i < book.books.length; i++) {
            let div2 = document.createElement('div');
            div2.classList.add('book-design');
            div2.innerHTML = `
                <img src="${book.books[i].book_image}" alt="Book Cover">
                <h4>${book.books[i].title}</h4>
                <p>${book.books[i].author}</p>
            `
            div2.classList.add('book');
            div2.onclick = ()=> showDetails(book.books[i]);
            div2.addEventListener('mouseenter', (e) => showEffects(e.target));
            div2.addEventListener('mouseleave', (e)=> hideEffects(e.target));
            div.appendChild(div2);
        }
    }) 
    wraper.appendChild(div);
}

function showDetails(book) {
    console.log(book);
    let modal = document.getElementById('modal');
    let div = document.createElement('div');
    let div2 = document.createElement('div');
    let shopBtn = document.createElement('div');
    shopBtn.classList.add('infobtn-cont');
    div2.classList.add('modal-content');
    div.classList.add('book-info');
    modal.style.display = 'flex';
    div.innerHTML = `
                <div class="info-img">
                    <img src="${book.book_image}" alt="Book Cover">
                </div>
                    <div class="info-details">
                        <h4 class="info-head">${book.title}</h4>
                        <p class="author">${book.contributor}</p>
                        <p class="desc"></p>
                        <div class="book-links">
                            <a href="${book.buy_links[0].url}"><img src="https://yevhenii2022.github.io/team-proj-js-book-app/amazon-shop-1x.d33dc585.png" width="48px" height="16px"></a>
                            <a href="${book.buy_links[1].url}"><img src="https://yevhenii2022.github.io/team-proj-js-book-app/apple-shop-1x.aeb5cfd2.png" width="28px" height="28px"></a>
                            <a href="${book.buy_links[4].url}"><img src="https://yevhenii2022.github.io/team-proj-js-book-app/bookshop-1x.d3877644.png" width="32px" height=30px"></a>
                        </div>
                    </div>
                <button class="closebtn" onclick="closeDetails(this)">X</button>
                     `;
    let desc = div.querySelector('.desc');
    if(book.description == "") {
        desc.innerHTML = "There is no description available";
    }      
    else {
        desc.innerHTML = book.description;
    }           
    shopBtn.innerHTML = `<button class="infobtn" onclick="addToCart(${book})">ADD TO SHOPPING LIST</button>`;          
    div2.appendChild(div);
    div2.appendChild(shopBtn);
    modal.appendChild(div2);                 
    modal.showModal();    
}

function showEffects(ref) {
    if(ref.querySelector('.effect') != null) {
        return;
    }
    let div = document.createElement("div");
    div.classList.add('effect');
    div.innerHTML = '<p>Quick View</p>'
    ref.appendChild(div);
}

function hideEffects(ref) {
    let div = ref.querySelector('.effect');
    if(div) {
        div.remove();
    }
}

function closeDetails(ref) {
    let modal = ref.parentElement.parentElement.parentElement;
    modal.style.display = 'none';
    modal.close();
}

let signbtn = document.getElementsByClassName('sign-up')[0];
let formUp = document.getElementById('form-nav-up');
let formIn = document.getElementById('form-nav-in');
let name = document.getElementById('formname');
let email = document.getElementById('formemail');
let pass = document.getElementById('formpass');
let confirmPass = document.getElementById('formconf');
let formSignin = document.getElementById('form-in');
let formSignbtn = document.getElementById('form-sub');
let terms = document.getElementById('terms');

signbtn.addEventListener('click', () => {
    name.style.display = 'block';
    confirmPass.style.display = 'block';
    formIn.classList.remove('form-btn-design');
    formUp.classList.add('form-btn-design');
    let modal = document.getElementsByClassName('form')[0];
    let main = document.getElementsByClassName('main')[0];
    main.style.display = 'none';
    modal.style.display = 'flex';
    document.querySelector('body').classList.add('bg-color');
});

let cancelbtn = document.getElementById('cancel');

cancelbtn.addEventListener('click', () => {
    let modal = document.getElementsByClassName('form')[0];
    let main = document.getElementsByClassName('main')[0];
    main.style.display = 'flex';
    modal.style.display = 'none';
    document.querySelector('body').classList.remove('bg-color');
});

formSignbtn.addEventListener('click',(e) => {
    e.preventDefault();
    validateUp(name,email,pass,confirmPass);
}); 

formIn.addEventListener('click',()=>{
    formSignbtn.style.display = 'none';
    formSignin.style.display = 'block';

    name.style.display = 'none';
    confirmPass.style.display = 'none';
    formIn.classList.add('form-btn-design');
    formUp.classList.remove('form-btn-design');
});

formUp.addEventListener('click', function() {
    formSignbtn.style.display = 'block';
    formSignin.style.display = 'none';
    name.style.display = 'block';
    confirmPass.style.display = 'block';
    formIn.classList.remove('form-btn-design');
    formUp.classList.add('form-btn-design');
});

formSignin.addEventListener('click',()=>{
    let res = validateIn(email,pass);
    if(res == 'success') {
        let modal = document.getElementsByClassName('form')[0];
        let main = document.getElementsByClassName('main')[0];
        setTimeout(()=>{
            document.getElementsByClassName('log-out')[0].style.display = 'flex';
            document.getElementsByClassName('home-shop')[0].style.display = 'flex';
            signbtn.style.display = 'none';
            main.style.display = 'flex';
            modal.style.display = 'none';
            document.querySelector('body').classList.remove('bg-color');
        },3100);
    }
});

let logOut = document.querySelector('.log-out');
logOut.addEventListener('click',()=> {
    signbtn.style.display = 'flex';
    document.getElementsByClassName('home-shop')[0].style.display = 'none';
    document.getElementsByClassName('log-out')[0].style.display = 'none';
});

function displayMessage(mssg) {
    let alertBox = document.getElementsByClassName('message-box')[0];
    alertBox.style.display = 'flex';
    alertBox.innerHTML = `<p>${mssg}</p>`
    setTimeout(() => {

        alertBox.style.display = 'none';
    }, 3000);
}

function validateUp(name,email,pass,confirmPass) {
    let res = checkFormFeilds(name.value,email.value,pass.value,confirmPass.value);
    if(res == 'All'|| res == 'valid' || res == 'confirm' ||res == 'terms' || res == 'password') {
        return;
    }
    let usersArray = JSON.parse(localStorage.getItem('usersArray')) || [];
    if(usersArray.length > 0) {
       for(let obj of usersArray) {
            if(obj.email === email.value) {
                displayMessage('Email already exists');
                name.value = '';
                pass.value = '';
                confirmPass.value = '';
                email.value = ''; 
                return;
            }
        }
    }
    let userObj = {
        name: name.value,
        email: email.value,
        pass: pass.value
    };
    usersArray.push(userObj);
    localStorage.setItem('usersArray', JSON.stringify(usersArray));
    displayMessage('Regestered Sucessfully'); 
    name.value = '';
    pass.value = '';
    confirmPass.value = '';
    email.value = '';    
    }

function checkFormFeilds(name,email,pass,confirmPass) {
    if(name == '' || email == '' || pass == '' || confirmPass == '') {
        displayMessage('All fields are required');
        return 'All';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        displayMessage('Please enter a valid email address.');
        return 'valid';
    }

    if(pass.length < 8 ||!/[A-Z]/.test(pass) ||!/[a-z]/.test(pass) ||!/[0-9]/.test(pass) ||!/\W/.test(pass)) {
        displayMessage('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        return 'password';
    }
    if(pass!= confirmPass) {
        displayMessage('Passwords do not match');
        return 'confirm';
    }
    if(!terms.checked) {
        displayMessage('You must agree to the terms and conditions');
        return 'terms';
    }
}

function validateIn(email,pass) {
    if(!terms.checked) {
        displayMessage('You must agree to the terms and conditions');
        return;
    }
    let usersArray = JSON.parse(localStorage.getItem('usersArray')) || [];
    if(usersArray.length != 0) {
        for(let obj of usersArray) {
            if(obj.email == email.value && obj.pass == pass.value) {
                displayMessage('Login successful');
                email.value= '';
                pass.value = '';
                return "success";
            }
        }
    }
    displayMessage('Invalid email or password');
}

let darkmode = document.getElementsByClassName('dark-mode')[0];
let darkbtn = document.getElementById('dark-btn');
let toggle = false;
darkmode.addEventListener('click',()=>{
    if(!toggle) {
        darkbtn.classList.add('forward');
        darkbtn.classList.remove('backward');
        toggle = true;
    }
    else {
        darkbtn.classList.remove('forward');
        darkbtn.classList.add('backward');
        toggle = false;
    }
    document.querySelector('body').classList.toggle('dark-mode');
});


let menuBtn = document.getElementsByClassName('menu-icon')[0];
let wrapper = document.getElementsByClassName('wrapper')[0];
let nav = document.querySelector('nav');
nav.style.height= '3.2rem';
menuBtn.addEventListener('click',()=>{
    if(nav.style.height == '3.2rem'){
        nav.style.height = '10rem';
    }

    else {
        nav.style.height = '3.2rem';
    }
});

// shoppping-list

let listcont = document.querySelector('.shopping-list');
let shopBtn = document.getElementById('shopping-btn');
function addToCart(book) {
    let div = document.createElement('div');
    div.classList.add('book-info');
    div.innerHTML = `
                <div class="info-img">
                    <img src="${book.book_image}" alt="Book Cover">
                </div>
                    <div class="info-details">
                        <h4 class="info-head">${book.title}</h4>
                        <p class="author">${book.contributor}</p>
                        <p class="desc"></p>
                        <div class="book-links">
                            <a href="${book.buy_links[0].url}"><img src="https://yevhenii2022.github.io/team-proj-js-book-app/amazon-shop-1x.d33dc585.png" width="48px" height="16px"></a>
                            <a href="${book.buy_links[1].url}"><img src="https://yevhenii2022.github.io/team-proj-js-book-app/apple-shop-1x.aeb5cfd2.png" width="28px" height="28px"></a>
                            <a href="${book.buy_links[4].url}"><img src="https://yevhenii2022.github.io/team-proj-js-book-app/bookshop-1x.d3877644.png" width="32px" height=30px"></a>
                        </div>
                    </div>
                <button class="closebtn" onclick="closeDetails(this)">X</button>
                     `;
    listcont.appendChild(div);
}
shopBtn.addEventListener('click', function() {
    let main = document.querySelector('.main');
    listcont.style.display = 'flex';
    main.style.display = 'none';
})