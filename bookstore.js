// Book class: represent book

class Book {
    constructor(title, author, genre, price){
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.price = price;
    }
}

// storage

class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')=== null){
            books = []
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(price){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.price === price){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// UI class; handles UI

class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        // card on ui
        const card = document.querySelector('.product');
        const div = document.createElement('div');
        div.innerHTML = `
            <h2 class="proName">${book.title}</h2>
            <h3 class="proAuthor">${book.author}</h3>
            <div class = "flex">
                <h3 class="proGenre">${book.genre}</h3>
                <h4 class="proPrice">Tsh ${book.price}</h4>
            </div>
            <span><a href="#" class="cart">cart</a></span>
        `;
        div.classList.add('card')
        card.appendChild(div)
        

        // list on the table
        const list = document.querySelector('.booklist');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.price}</td>
        <td><a href="#" class="del">X</a></td> 
        `;

        list.appendChild(row);
    };

    static deleteBook(el){
        if(el.classList.contains("del")){
            el.parentElement.parentElement.remove();
        }
    };

    static showAlert (message, className){
        const msg = document.querySelector('.msg');
        const h3 = document.createElement('h3');
        h3.className = `${className}`;
        const popup = document.createTextNode(message);
        h3.appendChild(popup);
        msg.appendChild(h3);
        setTimeout(() => msg.remove(), 1000);
    };

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#genre').value = '';
        document.querySelector('#price').value = '';
    };
};


// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add book
document.querySelector('#form').addEventListener('submit', (e) => {
    e.preventDefault();

    // get value of property from the form
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const genre = document.querySelector('#genre').value;
    const price = document.querySelector('#price').value;

    // validates the fields
    if(title === '' || author === '' || genre === '' || price === ''){
       UI.showAlert('Please fill in all fields', 'alert');
    }else{
        // instatiate to book
        const book = new Book(title, author, genre, price);
        
        // to add book and display
        UI.addBookToList(book);

        // add bok to store
        Store.addBook(book);

        // success message
        UI.showAlert('Book added', 'success')
    
        // to clear field
        UI.clearFields();
    }

});

// Event: Remove a book
document.querySelector('.booklist').addEventListener('click', (e) => {
    // add book to ui
    UI.deleteBook(e.target);

    // to remove book from the store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

     // success to remove
     UI.showAlert('Book removed', 'remove')
});