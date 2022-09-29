let commentsList = [];

class Comment {
  constructor(options) {
    this.author = options.author;
    this.msg = options.message;
    this.createdAt = options.createdAt;
  }

  createComment() {
    let list = document.querySelector(".comments-list");
    // let increment = document.querySelector(".increment");

    // let value = Number(increment.innerText) + 1
    // increment.innerText = value;

    let comment = document.createElement("div");
    comment.classList.add("single-comment", "hidden");

    comment.innerHTML = `
      <div class="logo-side logo-side--comment">
        <div class="comment-logo"></div>
      </div>
      <div class="text-side">
        <div class="user-data">
          <div class="user-namer">
            <p><strong>${this.author}</strong></p>
          </div>
          <div class="user-date">${this.createdAt}</div>
        </div>
        <div class="user-msg">
          <p class="message">${this.msg}</p>
        </div>
        <div class="btn-container">
          <div class="btn-respond">Odpowiedz</div>
          <div class="sapcer">|</div>
          <div class="btn-edit">Edytuj</div>
        </div>
      </div>
    `

    list.appendChild(comment);
    setTimeout(() => {
      comment.classList.replace("hidden", "show");
    }, 200);
    setTimeout(() => {
      comment.classList.remove( "show");
    }, 600);



    
  }
}

class CommentsFactory {

  create = (options) => {

    let comment = new Comment(options)

    return comment

  }

}

initComments = () => {
  console.log("initComments")
  let createdComments = [];
  let increment = document.querySelector(".increment");
  let list = document.querySelector(".comments-list");

  list.innerHTML = "";

  const CommentFactory = new CommentsFactory();

  increment.innerText = commentsList.length;

  commentsList.reverse().forEach((comment, i) => {
    createdComments[i] = CommentFactory.create(comment);
    createdComments[i].createComment();
    console.log(createdComments[i])
  })
}

init = () => {

  let SendBtn = document.querySelector(".comment-btn");

  initComments();

  SendBtn.addEventListener("click", () => {
    let author = document.getElementById("author").value;
    let message = document.getElementById("message").value;

    if (author === "" && message === "")  {
      document.getElementById("author").value = "Imie wymagane!";
      document.getElementById("message").value = "Wiadomość wymagana!";

      document.getElementById("author").classList.add("shake");
      document.getElementById("message").classList.add("shake");

      setTimeout(() => {
        document.getElementById("author").classList.remove("shake");
        document.getElementById("message").classList.remove("shake");

        document.getElementById("author").value = "";
        document.getElementById("message").value = "";
      }, 350);

      return;
    }
    
    const Http = new XMLHttpRequest();
    const url = "http://localhost:8080/PostComment";

    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify({message: `${message}`, author:`${author}`}));

    document.getElementById("author").value = "";
    document.getElementById("message").value = "";

    setTimeout(() => {
      getData();
    }, 200);
  })

}

getData = () => {
  console.log("data download")
  const Http = new XMLHttpRequest();
  const url = "http://localhost:8080/getComments";
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = () => {
    if(Http.readyState == 4 && Http.status == 200) {
      console.log(Http.responseText, "resp0");
      commentsList = JSON.parse(Http.responseText);
      
      init();
    }
  }
}

document.addEventListener('DOMContentLoaded', getData , false);