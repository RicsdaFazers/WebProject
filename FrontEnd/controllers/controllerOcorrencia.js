window.onload = function () {
  let user = localStorage.User;
  console.log(user);
  getIdOp(user);
};

let id_ocorr;

//buscar o id_operacional atraves do username e chama as funçoes Get Ocorrencia e Ver Ocorrencia Atual
function getIdOp(ler) {
  fetch(`http://127.0.0.1:3000/users/${ler}/info`)
    .then((res) => res.json())
    .then((out) => {
      let id_oper = out[0].id_operacional;
      getOcorr(id_oper);
      verOcorrenciaAtual(id_oper);
    })
    .catch((err) => console.error(err));
}

//busca o id_ocorrencia atraves do id_operacional e chama as funçoes Ver Equipa, Material Usado e Ler Descriçao
function getOcorr(id_op) {
  fetch(`http://127.0.0.1:3000/occurrences/${id_op}/accurring`)
    .then((res) => res.json())
    .then((out) => {
      id_ocorr = out[0].id_ocorrencia;

      verEqOcorrAtual(id_ocorr);
      materialUsado(id_ocorr);
      lerDescricao(id_ocorr);
    })
    .catch((err) => console.error(err));
}

document.getElementById("btn_iniciar").onclick = function () {
  confirmarOcorrencia(id_ocorr);
};

//Chamada do id_equipa e da funçao Mostra Equipa
function verEqOcorrAtual(ler) {
  //let table = $("#tabela-equipa-oco-atual").DataTable();
  fetch(`http://127.0.0.1:3000/teams/${ler}/view_team`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())

    .then((out) => {
      document.getElementById("label_nomeEquipa").innerHTML =
        "Equipa: " + out[0].nome_equipa;
      let id_eq = out[0].id_equipa;

      mostraEq(id_eq);
    })

    .catch((err) => {
      alert("Erro!" + err);
    });
}

//confirmar material e presença
function confirmarOcorrencia(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/check_departure`, {
    //mudar a rota do fetch
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      //alert(ler);
      confirmarMaterial(ler);
      window.location.href = "http://127.0.0.1:5502/FrontEnd/Relatorio.html";
    })
    .catch((error) => {
      alert(error);
    });
}

////confirmar o material
function confirmarMaterial(ler) {
  fetch(`http://127.0.0.1:3000/materials/${ler}/withdraw`, {
    //mudar a rota do fetch
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      //window.location.href = "http://127.0.0.1:3000/FrontEnd/Relatorio.html";
    })
    .catch((error) => {
      alert(error);
    });
}

//mostrar materiais na pagina principal e relatorio
function materialUsado(ler) {
  fetch(`http://127.0.0.1:3000/materials/${ler}/material`, {
    //mudar a rota do fetch
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      if (
        document.getElementById("exampleFormControlSelect3").options.length == 0
      ) {
        $.each(out, function (index, valor) {
          var x = document.getElementById("exampleFormControlSelect3");
          var c = document.createElement("option");
          c.text = valor.quantidade_usada + " --> " + valor.nome_material;
          x.options.add(c, 1);
        });
      }
    });
}

//mostrar informacoes da ocorrencia atual
function verOcorrenciaAtual(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/accurring`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, valor) {
        document.getElementById("label_local").innerHTML =
          "Local da ocorrência: " + valor.freguesia;
        document.getElementById("label_urgencia").innerHTML =
          "Grau de urgência: " + valor.descricao_urgencia;
      });
    })
    .catch((err) => {
      //alert("Erro!" + err);
    });
}

//mostrar membros da equipa
function mostraEq(ler) {
  let table = $("#tabela-equipa-oco-atual").DataTable();
  table.clear();
  fetch(`http://127.0.0.1:3000/teams/${ler}/members`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())

    .then((out) => {
      $("#tabela-equipa-oco-atual tbody").empty();
      $.each(out, function (index, value) {
        table.row.add([value.id_operacional, value.username]).draw();
      });
    });
}

//mostrar observacoes no relatorio
function lerDescricao(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/description`)
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, value) {
        document.getElementById("exampleFormControlTextarea5").innerHTML =
          out.descricao_pedido;
      });
    })
    .catch((err) => console.error(err));
}

//REFRESH DA TABELA ocorrencias passadas
function tabelaHist() {
  let table = $("#tabela-historico-ocorrencias").DataTable();
  fetch("http://127.0.0.1:3000/occurrences/finished")
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, value) {
        var m = new Date(value.data_ocorrencia);
        var dataString =
          m.getUTCFullYear() +
          "/" +
          ("0" + (m.getUTCMonth() + 1)).slice(-2) +
          "/" +
          ("0" + m.getUTCDate()).slice(-2) +
          " " +
          ("0" + m.getUTCHours()).slice(-2) +
          ":" +
          ("0" + m.getUTCMinutes()).slice(-2) +
          ":" +
          ("0" + m.getUTCSeconds()).slice(-2);
        table.row
          .add([
            value.id_ocorrencia,
            value.freguesia,
            value.id_equipa,
            value.descricao_urgencia,
            dataString,
            value.creditos_ocorrencia,
          ])
          .draw();
      });
    })
    .catch((err) => console.error(err));
}

//REFRESH DA TABELA ocorrencias em curso
function tabelaOcDecorrer() {
  let table = $("#tabela-ocorrencias-decorrer").DataTable();

  fetch("http://127.0.0.1:3000/occurrencesOccurring")
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, value) {
        console.log("teste");
        table.row.add([value.freguesia, value.nome_equipa]).draw();
      });
    })
    .catch((err) => console.error(err));
}

$(document).ready(function () {
  $("#tabela-historico-ocorrencias").DataTable();
  tabelaHist();
  $("#tabela-ocorrencias-decorrer").DataTable();
  tabelaOcDecorrer();
});
