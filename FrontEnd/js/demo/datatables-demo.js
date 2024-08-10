// Call the dataTables jQuery plugin
$(document).ready(function () {
  $("#dataTable").DataTable();
});

$(document).ready(function () {
  $("#tabela-testemunha-acabado").DataTable();
});

$(document).ready(function () {
  $("#tabela-ocorrencias-decorrer").DataTable();
});

$(document).ready(function () {
  $("#tabela-testemunhas").DataTable();
});

$(document).ready(function () {
  $("#tabela-equipa-relatorio").DataTable();
});

$(document).ready(function () {
  $("#tabela-historico-ocorrencias").DataTable();
});

$(document).ready(function () {
  $("#tabela-ranking-operacionais").DataTable();
});

$(document).ready(function () {
  $("#tabela-ranking-equipa").DataTable();
});

$(document).ready(function () {
  $("#tabela-equipa-oco-atual").DataTable();
});

$(document).ready(function () {
  $("#tabela-equipa-oco-decorrer").DataTable();
});

$(
  "#tabela-testemunha-acabado , #tabela-ocorrencias-decorrer, #tabela-historico-ocorrencias , #tabela-ranking-equipa , #tabela-ranking-operacionais , #tabela-testemunhas , #tabela-equipa-oco-atual , #tabela-equipa-oco-decorrer , #tabela-equipa-relatorio"
).DataTable({
  language: {
    sprocessing: "Tratamento em curso...",
    search: "Procurar",
    lengthMenu: "Ver elementos _MENU_",
    info: "Mostrando _START_ de _END_ entradas",
    infoEmpty: "",
    infoFiltered: "(De um total de _MAX_)",
    infoPostFix: "",
    loadingRecords: "Carregamento em curso...",
    zeroRecords: "Não foi encontrado nenhum registo correspondente.",
    emptyTable: "Não existe dados disponíveis na tabela",
    paginate: {
      first: "Primeiro",
      previous: "Anterior",
      next: "Seguinte",
      last: "Ultimo",
    },
    aria: {
      sortAscending: ": Ordenar por ordem crescente",
      sortDescending: ": Ordenar por ordem decrescente",
    },
  },
});

$(document).ready(function () {
  $("#tabela-historico-ocorrencias").DataTable();
  $("#tabela-historico-ocorrencias tbody").on("click", "tr", function () {
    $("#historico-popup").modal("show");

    var select = document.getElementById("exampleFormControlSelect4");
    var length = select.options.length;
    for (i = length - 1; i >= 0; i--) {
      select.options[i] = null;
    }

    $("#tabela-equipa-oco-decorrer").DataTable().clear();
    $("#tabela-testemunha-acabado").DataTable().clear();

    var id_ocorr = $("td", this).eq(0).text(); //eq(2) increase the value inside eq() will display the txt column wise.
    $("#id_ocorr_selec").text(id_ocorr);

    verEqOcorr(id_ocorr);
    materialUsadoPassado(id_ocorr);
    lerDescricao(id_ocorr);

    $(document).ready(function () {
      $("#tabela-testemunha-acabado").DataTable();
      getTestemunha(id_ocorr);
    });

    var credito_equipa = $("td", this).eq(5).text();
    $("#credito_ocorr").text(credito_equipa);
  });
});
$("#tabela-historico-ocorrencias").on("keyup", function () {
  tableInstance.search(this.value).draw(); // try this easy code and check if works at first
});

function getTestemunha(par) {
  let table = $("#tabela-testemunha-acabado").DataTable();

  fetch(`http://127.0.0.1:3000/occurrences/${par}/witnesses`)
    .then((res) => res.json())
    .then((out) => {
      console.log(out),
        $.each(out, function (index, value) {
          table.row
            .add([
              value.nome_testemunha,
              value.localidade_testemunha,
              value.profissao_testemunha,
            ])
            .draw();
        });
    })
    .catch((err) => console.error(err));
}

function verEqOcorr(ler) {
  //let table = $("#tabela-equipa-oco-atual").DataTable();
  fetch(`http://127.0.0.1:3000/teams/${ler}/view_team`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())

    .then((out) => {
      let id_eq = out[0].id_equipa;
      getEquipa(id_eq);
    })

    .catch((err) => {
      alert("Erro!" + err);
    });
}

function getEquipa(par) {
  let table = $("#tabela-equipa-oco-decorrer").DataTable();
  fetch(`http://127.0.0.1:3000/teams/${par}/members`)
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, value) {
        table.row.add([value.id_operacional, value.username]).draw();
      });
    })
    .catch((err) => console.error(err));
}

function materialUsadoPassado(ler) {
  fetch(`http://127.0.0.1:3000/materials/${ler}/material`, {
    //mudar a rota do fetch
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, valor) {
        var x = document.getElementById("exampleFormControlSelect4");
        var c = document.createElement("option");
        c.text = valor.quantidade_usada + " --> " + valor.nome_material;
        x.options.add(c, 1);
      });
    });
}

function lerDescricao(ler) {
  fetch(`http://127.0.0.1:3000/occurrences/${ler}/description`)
    .then((res) => res.json())
    .then((out) => {
      $.each(out, function (index, value) {
        document.getElementById("outrasInformacoes").innerHTML =
          out.descricao_pedido;
      });
    })
    .catch((err) => console.error(err));
}

// TENTAR SUBLINHAR A LINHA DO RANKING DO GAJO (acho q está só da para fazer qd der o login, para sabermos quem está ligado)
/*
$(document).ready(function () {
  $("#tabela-ranking-operacionais").DataTable();
  $("#taabela-ranking-operacionais tbody").on("click", "tr", function () {
    var id_ocorr = $("td", this).eq(0).text();
    $("#id_ocorr_selec").text(id_ocorr);

    var response = fetch(
      `http://127.0.0.1:3000/materials/${id_ocorr}/material`
    );
    var mat_usado = JSON.stringify(response);
    $("#material_usado").text(mat_usado);

    var credito_equipa = $("td", this).eq(5).text();
    $("#credito_ocorr").text(credito_equipa);
  });
});
$("#tabela-ranking-operacionais").on("keyup", function () {
  tableInstance.search(this.value).draw(); 
});
*/
