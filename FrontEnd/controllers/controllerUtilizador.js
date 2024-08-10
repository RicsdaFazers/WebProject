//LOGIN
window.onload = function () {
  document.getElementById("btnLogin").onclick = function () {
    login();
    console.log("clicado");
  };

  let username;
  // Autenticar administrador na área privada
  function login() {
    username = document.getElementById("inputUser").value;
    var data = {};
    data.username = document.getElementById("inputUser").value;
    data.password = document.getElementById("inputPassword").value;
    fetch("http://127.0.0.1:3000/signin/", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((out) => {
        console.log(out);
        if (out.msg == "Success") {
          localStorage.setItem("User", username);
          window.location.href =
            "http://127.0.0.1:5502/FrontEnd/Pagina-principal.html";
        } else {
          alert("Username ou password errado");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
};

/*function atualizarUser(user) {
  var data = {};
  //data.username = document.getElementById("PerfilUser").value;
  data.nome = document.getElementById("PerfilNome1").value;
  data.email_utilizador = document.getElementById("PerfilEmail1").value;
  data.password = document.getElementById("password-perfil1").value;

  console.log(data);

  fetch(`http://127.0.0.1:3000/users/${user}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    //Then with the data from the response in JSON...
    .then((data) => {
      console.log("Success:", data);
      alert(user);
    })
    //Then with the error genereted...
    .catch((error) => {
      console.error("Error:", error);
    });
}*/
