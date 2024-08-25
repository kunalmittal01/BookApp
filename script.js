let disp = document.getElementsByClassName('disp')[0];
let sidebar = document.getElementsByClassName('sidebar-cont')[0];

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

window.onload = ()=> displayBooks('All categories');

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
    // wraper.style.display = 'flex';
    // wraper.style.flexWrap = 'wrap';
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
            div.appendChild(div2);
        }
    }) 
    wraper.appendChild(div);
}