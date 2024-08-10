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
      materialUsadoNoLocal(id_ocorr);
      getTestemunhas(id_ocorr);
      document.getElementById("btn_criarTestemunha").onclick = function () {
        createTestemunha(id_ocorr);
      };
    })
    .catch((err) => console.error(err));
}

function getTestemunhas(ler) {
  let table = $("#tabela-testemunhas").DataTable();
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/witnesses`)
    .then((res) => res.json())

    .then((out) => {
      console.log(out);
      $("#tabela-testemunhas tbody").empty();
      $.each(out, function (index, value) {
        console.log(value);
        table.row
          .add([
            value.nome_testemunha,
            value.localidade_testemunha,
            value.profissao_testemunha,
            value.email_testemunha,
            value.notas_testemunha,
          ])
          .draw();
      });
    });
}

function createTestemunha(ler) {
  console.log("Adicionado com sucesso!");
  var data = {};
  data.nome_testemunha = document.getElementById("nomeTestemunha").value;
  data.email_testemunha = document.getElementById("emailTestemunha").value;
  data.profissao_testemunha = document.getElementById(
    "profissaoTestemunha"
  ).value;
  data.localidade_testemunha = document.getElementById("localTestemunha").value;
  data.notas_testemunha = document.getElementById("notasTestemunha").value;
  // var idocorrencia="4";   ${idocorrencia}
  console.log(data);
  fetch(`http://127.0.0.1:3000/witnesses/${ler}/registration`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
  window.location.reload();
}

function materialUsadoNoLocal(ler) {
  fetch(`http://127.0.0.1:3000/materials/${ler}/material`, {
    //mudar a rota do fetch
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, valor) {
        var x = document.getElementById("listaMatUtilizadoNoLocal");
        var c = document.createElement("option");
        c.text = valor.quantidade_usada + " --> " + valor.nome_material;
        x.options.add(c, 1);
      });
    });
}
*/
