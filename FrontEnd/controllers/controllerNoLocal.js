window.onload = function () {
  let user = localStorage.User;
  getIdOp(user);
};

//procura o id_operacional atraves do username e chama as funçoes Get Ocorrencia
function getIdOp(ler) {
  fetch(`http://127.0.0.1:3000/users/${ler}/info`)
    .then((res) => res.json())
    .then((out) => {
      let id_oper = out[0].id_operacional;
      getOcorr(id_oper);
    })
    .catch((err) => console.error(err));
}

//procura o id_ocorrencia atraves do id_operacional e chama as funçoes Ver Testemunhas, Verificar Tempo, Update Data do Fim e Cria Testemunha
function getOcorr(id_op) {
  fetch(`http://127.0.0.1:3000/occurrences/${id_op}/accurring`)
    .then((res) => res.json())
    .then((out) => {
      id_ocorr = out[0].id_ocorrencia;

      materialUsadoNoLocal(id_ocorr);

      $(document).ready(function () {
        $("#tabela-testemunhas").DataTable();
        getTestemunhas(id_ocorr);
      });

      document.getElementById("btn_calcularDiferenca").onclick = function () {
        verificarTempos(id_ocorr);
      };
      document.getElementById("btn_ConcluirOperacao").onclick = function () {
        update_DataFim(id_ocorr);
      };
      document.getElementById("btn_criarTestemunha").onclick = function () {
        createTestemunha(id_ocorr);
      };
    })
    .catch((err) => console.error(err));
}

//Recebe os tempos estimado e real
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
      verDiferencaTempos(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

//Calculo da diferença dos tempos estimado e real em minutos
function verDiferencaTempos(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/timeDiff`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      tempoDiferenca.innerText = out;
    });
}

//Procura testemunhas de uma certa ocorrencia
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

//Cria testemunhas numa certa ocorrencia
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

//Imprime o material usado na pagina No-Local
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

function update_DataFim(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/finishdate`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      update_PercentagemSobreviventes(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_PercentagemSobreviventes(ler) {
  var data = {};
  data.percentagem_sobrevivente = document.getElementById("vitimas-s").value;

  fetch(`http://127.0.0.1:3000/occurrences/${ler}/survival`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.text())
    .then((out) => {
      alert(out);
      update_DuracaoOcorrencia(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_DuracaoOcorrencia(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/duration`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      update_CreditoOcorrencia(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_CreditoOcorrencia(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/credit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      update_CreditoEquipa(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

function update_CreditoEquipa(ler) {
  fetch(`http://127.0.0.1:3000/teams/${ler}/credit_team`, {
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
  fetch(`http://127.0.0.1:3000/agents/${ler}/put_credit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.text())
    .then((out) => {
      alert("Créditos atribuídos aos operacionais!");
      enviaDados(ler);
    })
    .catch((error) => {
      alert(error);
    });
}

//mostrar materiais no relatorio
function enviaDados(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/sendmail`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      alert("Email enviado ao Centro de Operações");
      window.location.href = "http://127.0.0.1:5502/FrontEnd/Pagina-principal";
    });
}
