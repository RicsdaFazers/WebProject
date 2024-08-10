const { json } = require("body-parser");
const connect = require("../database");
const { updateUtilizador } = require("./controllerUtilizador");

//Funcao que le todos os dados referentes aos operacionais
function read(req, res) {
  const query = connect.con.query('SELECT * FROM operacional',
  function (err, rows, fields) {
    if (!err) {
      if (rows.length == 0) {
        res.status(404).send({ msg: "Data not found" });
      }
      else {
        res.status(200).send(rows);
      }
    }
    else
      console.log('Error while performing Query.', err);  
  });
}

//Funcao que le todos os dados de um determinado operacional
function readOperacional(req, res) {
  const id_operacional = req.params.id_operacional;
  const query = connect.con.query('SELECT * FROM operacional WHERE id_operacional = ?', id_operacional,
  function (err, rows, fields) {
    if (!err) {
      if (rows.length == 0) {
        res.status(404).send({ msg: "Data not found"});
      }
      else {
        res.status(200).send(rows);
      }
    }
    else {
      res.status(400).send({ msg: err.code});
      console.log('Error while performing Query.', err);
    }
  });
}

//Funcao que le a especialidade de um determinado operacional
function readEspecialidade(req, res) {
  const id_operacional = req.params.id_operacional;
  const query = connect.con.query('SELECT c.descricao_cargo FROM operacional op, cargo c WHERE op.id_operacional = ? and op.id_cargo = c.id_cargo', id_operacional,
  function (err, rows, fields) {
    if (!err) {
      if (rows.length == 0) {
        res.status(404).send({ msg: "Data not found"});
      }
      else {
        res.status(200).send(rows[0]);
      }
    }
    else {
      res.status(400).send({ msg: err.code});
      console.log('Error while performing Query.', err);
    }
  });
}

//Funcao que le todas as ocorrencias de um determinado operacional
function readOcorrenciaOperacional(req, res) {
  const id_operacional = req.params.id_operacional;
  const query = connect.con.query('SELECT oc.* FROM operacional op, equipa eq, ocorrencia oc WHERE op.id_operacional = ? and op.id_equipa = eq.id_equipa and oc.id_ocorrencia = eq.id_ocorrencia', id_operacional,
  function (err, rows, fields) {
    if (!err) {
      if (rows.length == 0) {
        res.status(404).send({ msg: "Data not found"});
      }
      else {
        res.status(200).send(rows);
      }
    }
    else {
      res.status(400).send({ msg: err.code});
      console.log('Error while performing Query.', err);
    }
  });
}

//Funcao que le os creditos de um determinado operacional
function readCreditoOperacional(req, res) {
  const id_operacional = req.params.id_operacional;
  const query = connect.con.query('SELECT u.nome, eq.nome_equipa, op.pontos_gamificacao FROM operacional op, equipa eq, utilizador u WHERE op.id_operacional = ? and op.id_equipa = eq.id_equipa and op.username = u.username', id_operacional,
  function(err, rows, fields) {
    if (!err) {
      if (rows.length == 0) {
        res.status(404).send({ msg: "Data not found" });
      }
      else {
        res.status(200).send(rows[0]);
      }
    }
    else {
      res.status(400).send({"msg": err.code});
      console.log('Error while performing Query.', err);
    }
  });
}

//Funcao que disponibiliza os operacionais por ranking, segundo os creditos dos mesmos
function readRankingOperacional(req, res) {
  const query = connect.con.query('SELECT op.username, op.pontos_gamificacao, ca.descricao_cargo, DENSE_RANK() OVER  (ORDER BY op.pontos_gamificacao DESC) AS Ranking_Operacionais FROM operacional op, cargo ca WHERE op.id_cargo = ca.id_cargo',
  function (err, rows, fields) {
    if (!err) {
      if (rows.length == 0) {
        res.status(404).send({ msg: "Data not found"});
      }
      else {
        res.status(200).send(rows);
      }
    }
    else {
      res.status(400).send({"msg": err.code});
      console.log('Error while performing Query.', err);
    }
  });
}

//Funcao que altera os creditos de um determinado operacional, com o criterio de distribuicao igualitaria para cada um dos operacionais da equipa
function updateCreditoOperacional(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let id_equipa;
  let creditos_equipa;
  let pontos_gamificacao;
  let numero_operacional_equipa;
  const query = connect.con.query('SELECT id_equipa FROM ocorrencia WHERE id_ocorrencia = ?', id_ocorrencia,
  function(err, rows, fields) {
    id_equipa = rows[0].id_equipa;
    const secondquery = connect.con.query('SELECT creditos_equipa FROM equipa WHERE id_equipa = ?', id_equipa,
    function(err, rows, fields) {
      creditos_equipa = rows[0].creditos_equipa;
      const thirdquery = connect.con.query('SELECT pontos_gamificacao FROM operacional WHERE id_equipa = ?', id_equipa,
      function(err, rows, fields) {
        pontos_gamificacao = rows[0].pontos_gamificacao;
        const forthquery = connect.con.query('SELECT COUNT(id_operacional) AS Numero_Operacionais FROM operacional WHERE id_equipa = ?', id_equipa,
        function(err, rows, fields) {
          numero_operacional_equipa = rows[0].Numero_Operacionais;
          pontos_gamificacao = pontos_gamificacao + (creditos_equipa/numero_operacional_equipa);
          const update = [pontos_gamificacao, id_equipa];
          const fifthquery = connect.con.query('UPDATE operacional SET pontos_gamificacao = ? WHERE id_equipa = ?', update,
          function(err, rows, fields) {
            if (!err) {
              console.log("Number of records updated: " + rows.affectedRows);
              res.status(200).send({ msg: "Foram atribuidos " +pontos_gamificacao+ " pontos para cada um dos operacionais da respetiva equipa"});
            }
            else {
              res.status(400).send({ msg: err.code});
              console.log('Error while performing Query.', err);
            }
          });
        });
      });
    });
  });
}

module.exports = {
  read: read,
  readOperacional: readOperacional,
  readEspecialidade: readEspecialidade,
  readOcorrenciaOperacional: readOcorrenciaOperacional,
  readCreditoOperacional: readCreditoOperacional,
  readRankingOperacional: readRankingOperacional,
  updateCreditoOperacional: updateCreditoOperacional
}
