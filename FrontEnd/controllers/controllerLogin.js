function login() {
  var data = {};
  data.nome_testemunha = document.getElementById("inputUser").value;
  data.email_testemunha = document.getElementById("inputPassword").value;
  console.log(data);
  fetch("http://127.0.0.1:3000/signin", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(
      data
      // id_ocorrencia: idocorrencia,
    ),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
