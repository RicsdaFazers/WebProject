window.onload = function () {
  let user = localStorage.User;
  verDados(user);
  document.getElementById("btnAtualiza").onclick = function () {
    atualizarUser();
  };
};

//mostra o username e especialidade no Perfil do Utilizador logado
function verDados(user) {
  fetch(`http://127.0.0.1:3000/users/${user}/info`, {
    //mudar a rota do fetch
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, valor) {
        document.getElementById("PerfilUser").innerHTML = valor.username;
        document.getElementById("PerfilEspecialidade").innerHTML =
          valor.descricao_cargo;
      });
    });
}

//atualiza as informações do Utilizador logado
function atualizarUser() {
  var data = {};
  //data.username = document.getElementById("PerfilUser").value;
  data.nome = document.getElementById("PerfilNome1").value;
  data.email_utilizador = document.getElementById("PerfilEmail1").value;
  data.password = document.getElementById("password-perfil1").value;

  console.log(data);

  fetch(`http://127.0.0.1:3000/users/${localStorage.User}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    //Then with the data from the response in JSON...
    .then((data) => {
      console.log("Success:", data);
      //alert(user);
    })
    //Then with the error genereted...
    .catch((error) => {
      console.error("Error:", error);
    });
}
