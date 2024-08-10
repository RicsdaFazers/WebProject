//const { updateDuracaoOcorrencia } = require("../../BackEnd/controllers/controllerOcorrencia");
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
      document.getElementById("btn_ConcluirOperacao").onclick = function () {
        update_DataFim(id_ocorr);
      };
    })
    .catch((err) => console.error(err));
}

function update_DataFim(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/finishdate`, {
    //mudar a rota do fetch
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      //alert("1");
      update_PercentagemSobreviventes(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_PercentagemSobreviventes(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/survival`, {
    //mudar a rota do fetch
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      // alert("2");
      update_DuracaoOcorrencia(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_DuracaoOcorrencia(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/duration`, {
    //mudar a rota do fetch
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      // alert("3");
      update_CreditoOcorrencia(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_CreditoOcorrencia(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/credit`, {
    //mudar a rota do fetch
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      // alert("4");
      update_CreditoEquipa(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_CreditoEquipa(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/credit_team`, {
    //mudar a rota do fetch
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      alert("Créditos atribuídos à equipa!");
      update_CreditoOperacional(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_CreditoOperacional(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/put_credit`, {
    //mudar a rota do fetch
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      alert("Créditos atribuídos aos operacionais!");
    })
    .catch((error) => {
      alert(error);
    });
}

//mostrar materiais no relatorio
function enviaDados(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/sendmail`, {
    //mudar a rota do fetch
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      alert("Email enviado ao Centro de Operações");
    });
}
*/
