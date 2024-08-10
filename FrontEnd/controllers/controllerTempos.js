/*window.onload = function () {
  let user = localStorage.User;
  getIdOp(user);
};

function getIdOp(ler) {
  fetch(`http://127.0.0.1:3000/users/${ler}/info`)
    .then((res) => res.json())
    .then((out) => {
      let id_oper = out[0].id_operacional;
      getOcorr(id_oper);
    })
    .catch((err) => console.error(err));
}

function getOcorr(id_op) {
  fetch(`http://127.0.0.1:3000/occurrences/${id_op}/accurring`)
    .then((res) => res.json())
    .then((out) => {
      id_ocorr = out[0].id_ocorrencia;
      document.getElementById("btn_calcularDiferenca").onclick = function () {
        verificarTempos(id_ocorr);
      };
    })
    .catch((err) => console.error(err));
}

function verificarTempos(ler) {
  var data = {};
  data.tempo_estimado_deslocacao = document.getElementById(
    "tempoEstimado"
  ).value;
  data.tempo_deslocacao = document.getElementById("tempoReal").value;
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/times`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.text())
    .then((out) => {
      alert(out);
      //window.location.reload();
      verDiferencaTempos(ler);
      //alert(data);
    })
    .catch((error) => {
      alert(error);
    });
}*/
/*
function verDiferencaTempos(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/timeDiff`, {
    //mudar a rota do fetch
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      /*  $.each(out, function (index, valor) {
         // document.getElementById("teste23").innerHTML = valor.tempo_deslocacao;
          alert(valor.tempo_deslocacao);*/
// console.log(out);
//document.getElementById("tempoDiferenca").value;
//tempoDiferenca.innerText = out;
//});
//});
//}
