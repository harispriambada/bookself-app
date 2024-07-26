const books = [];
const KUNCI_EVENT = "kunci-book";
const SIMPANAN_EVENT = "simpan_buku";
const KUNCI_PENYIMPANAN = "BOOKSHELF_APP";

function generateId() {
  return +new Date();
}

function generatebookObject(id, title, author, year, isComplete) {
  var year = parseInt(year);
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}
// ------------------------------------

function makeTolist(bookObject) {
  const textTitle = document.createElement("p");
  textTitle.innerText = `Judul : ${bookObject.title}`;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis : ${bookObject.author}`;
  const textYear = document.createElement("p");
  textYear.innerText = `Tahun : ${bookObject.year}`;

  const textContainer = document.createElement("article");
  textContainer.classList.add("item-buku");
  textContainer.append(textTitle, textAuthor, textYear);
  const container = document.createElement("div");
  container.classList.add("list-buku");
  container.append(textContainer);
  container.setAttribute("id", `listBelumSelesaiBaca-${bookObject.id}`);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undone");
    undoButton.addEventListener("click", function () {
      undoBookFromSelesai(bookObject.id);
    });
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");

    deleteButton.addEventListener("click", function () {
      removeBookFromSelesai(bookObject.id);
    });
    const containerButton = document.createElement("div");
    containerButton.classList.add("action");

    containerButton.append(deleteButton, undoButton);
    textContainer.append(containerButton);
  } else {
    const belumselesaiButton = document.createElement("button");
    belumselesaiButton.classList.add("done");

    belumselesaiButton.addEventListener("click", function () {
      doneBookFromSelesai(bookObject.id);
    });
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");

    deleteButton.addEventListener("click", function () {
      removeBookFromSelesai(bookObject.id);
    });

    const containerButton = document.createElement("div");
    containerButton.classList.add("action");
    containerButton.append(deleteButton, belumselesaiButton);
    textContainer.append(containerButton);
  }

  //   ----------------------------
  function removeBookFromSelesai(bookId) {
    const bookTarget = findbookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(KUNCI_EVENT));
    simpanData();
  }

  function undoBookFromSelesai(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(KUNCI_EVENT));
    simpanData();
  }
  function findbookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }

    return -1;
  }
  //   ---------------------------------------------
  function doneBookFromSelesai(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(KUNCI_EVENT));
    simpanData();
  }

  function findbookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }

    return -1;
  }
  function findBook(bookID) {
    for (const bookItem of books) {
      if (bookItem.id === bookID) {
        return bookItem;
      }
    }
    return null;
  }

  return container;
}

function AddTolist() {
  const textTitlelist = document.getElementById("inputJudul").value;
  const textAuthor = document.getElementById("inputPenulis").value;
  const textYear = document.getElementById("inputTahun").value;
  const generateID = generateId();
  const checkBook = document.getElementById("checkboxBtn");
  const bookObject = generatebookObject(
    generateID,
    textTitlelist,
    textAuthor,
    textYear,
    false
  );
  if (checkBook.checked) {
    bookObject.isComplete = true;
  } else {
    bookObject.isComplete = false;
  }
  books.push(bookObject);
  document.dispatchEvent(new Event(KUNCI_EVENT));
  simpanData();
}
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Sayang sekali browsermu tidak mendukung webstorage");
    return false;
  }
  return true;
}
function simpanData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(KUNCI_PENYIMPANAN, parsed);
    document.dispatchEvent(new Event(SIMPANAN_EVENT));
  }
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(KUNCI_PENYIMPANAN);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(KUNCI_EVENT));
}

document.addEventListener(SIMPANAN_EVENT, function () {
  console.log(localStorage.getItem(KUNCI_PENYIMPANAN));
});

document.addEventListener(KUNCI_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("listBelumSelesaiBaca");
  uncompletedBOOKList.innerHTML = "";
  const completedBookList = document.getElementById("listSelesaiBaca");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeTolist(bookItem);
    if (!bookItem.isComplete) uncompletedBOOKList.append(bookElement);
    else completedBookList.append(bookElement);
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBuku");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    AddTolist();
    submitForm.reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const searchBook = document.getElementById("searchBar");

// searchBook.addEventListener("keyup", function () {
//   const inputValue = document.getElementById("searchBar").value;
//   const listBooks = document.querySelectorAll(".item-buku");

//   for (let i = 0; i < listBooks.length; i++) {
//     console.log(listBooks[i]);
//     if (
//       !inputValue ||
//       listBooks[i].textContent.toLowerCase().indexOf(inputValue) > -1
//     ) {
//       listBooks[i].classList.remove("hide");
//     } else {
//       listBooks[i].classList.add("hide");
//     }
//   }
// });

function searchBar() {
  const inputValue = document.getElementById("searchBar").value;
  const listBooks = document.querySelectorAll(".item-buku");

  for (let i = 0; i < listBooks.length; i++) {
    console.log(listBooks[i]);
    if (
      listBooks[i].textContent
        .toLocaleLowerCase()
        .includes(inputValue.toLowerCase())
    ) {
      listBooks[i].classList.remove("hide");
    } else {
      listBooks[i].classList.add("hide");
    }
  }
}
searchBook.addEventListener("keyup", function () {
  searchBar();
});
searchBook.addEventListener("keydown", function () {
  searchBar();
});
