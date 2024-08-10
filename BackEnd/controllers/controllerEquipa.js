const connect = require("../database");

//Funcao que le todos os dados referentes as equipas
function read(req, res) {
  const query = connect.con.query(
    "SELECT * FROM equipa",
    function (err, rows, fields) {
      if (!err) {
        if (rows.length == 0) {
          res.status(404).send({ msg: "Data not found" });
        } else {
          res.status(200).send(rows);
        }
      } else console.log("Error while performing Query.", err);
    }
  );
}

//Funcao que le uma equipa de uma determinada ocorrencia
function readEquipaOcorrencia(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const query = connect.con.query(
    "SELECT eq.* FROM equipa eq, ocorrencia oc WHERE oc.id_ocorrencia = ? and eq.id_equipa = oc.id_equipa",
    id_ocorrencia,
    function (err, rows, fields) {
      if (!err) {
        if (rows.length == 0) {
          res.status(404).send({ msg: "Data not found" });
        } else {
          res.status(200).send(rows);
        }
      } else {
        res.status(400).send({ msg: err.code });
        console.log("Error while performing Query.", err);
      }
    }
  );
}

//Funcao que le os membros de uma determinada equipa
function readMembrosEquipa(req, res) {
  const id_equipa = req.params.id_equipa;
  const query = connect.con.query(
    "SELECT eq.id_equipa, op.username, op.id_operacional FROM equipa eq, operacional op WHERE eq.id_equipa = op.id_equipa AND eq.id_equipa = ?",
    id_equipa,
    function (err, rows, fields) {
      if (!err) {
        if (rows.length == 0) {
          res.status(404).send({ msg: "Data not found" });
        } else {
          res.status(200).send(rows);
        }
      } else {
        res.status(400).send({ msg: err.code });
        console.log("Error while performing Query.", err);
      }
    }
  );
}

//Funcao que disponibiliza as equipas por ranking, segundo os creditos das mesmas
function readRankingEquipa(req, res) {
  const query = connect.con.query(
    "SELECT COUNT(oc.id_ocorrencia) AS Numero_Ocorrencias, eq.id_equipa , eq.creditos_equipa,  DENSE_RANK() OVER  (ORDER BY eq.creditos_equipa DESC) AS Ranking_equipa, GROUP_CONCAT( DISTINCT op.username SEPARATOR ',') AS users FROM equipa eq  LEFT OUTER JOIN ocorrencia oc ON oc.id_equipa = eq.id_equipa LEFT OUTER JOIN operacional op ON op.id_equipa = oc.id_equipa WHERE op.id_equipa = oc.id_equipa GROUP BY id_equipa;",
    function (err, rows, fields) {
      if (!err) {
        if (rows.length == 0) {
          res.status(404).send({ msg: "Data not found" });
        } else {
          res.status(200).send(rows);
        }
      } else {
        res.status(400).send({ msg: err.code });
        console.log("Error while performing Query.", err);
      }
    }
  );
}

//Funcao que altera a disponibilidade de uma equipa que foi solicitada para ir a terreno
function updateConfirmarEquipa(req, res) {
  const id_equipa = req.params.id_equipa;
  let disponibilidade;
  const query = connect.con.query(
    "SELECT disponibilidade FROM equipa WHERE id_equipa = ?",
    id_equipa,
    function (err, rows, fields) {
      disponibilidade = rows[0].disponibilidade;
      if (err) return res.status(500).end();
      if (disponibilidade == "Disponivel") {
        const update = id_equipa;
        const secondquery = connect.con.query(
          'UPDATE equipa SET disponibilidade = "Indisponivel" WHERE id_equipa = ?',
          update,
          function (err, rows, fields) {
            res.send("A equipa esta confirmada");
          }
        );
      } else {
        res.send("A equipa continua indisponivel para ir a terreno");
      }
    }
  );
}

//Funcao que altera os creditos de uma determinada equipa consoante os creditos das ocorrencias que as mesmas
function updateCreditoEquipa(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let id_equipa;
  let creditos_equipa;
  const query = connect.con.query(
    "SELECT id_equipa FROM ocorrencia WHERE id_ocorrencia = ?",
    id_ocorrencia,
    function (err, rows, fields) {
      id_equipa = rows[0].id_equipa;
      console.log(id_equipa);
      const secondquery = connect.con.query(
        "SELECT SUM(creditos_ocorrencia) AS creditos_equipa FROM ocorrencia WHERE id_equipa = ?",
        id_equipa,
        function (err, rows, fields) {
          creditos_equipa = rows[0].creditos_equipa;
          const update = [creditos_equipa, id_equipa];
          const thirdquery = connect.con.query(
            "UPDATE equipa SET creditos_equipa = ? WHERE id_equipa = ?",
            update,
            function (err, rows, fields) {
              if (!err) {
                console.log("Number of records updated: " + rows.affectedRows);
                res.status(200).send({
                  msg: "Foram atribuidos os pontos à Equipa " + id_equipa,
                });
              } else {
                res.status(400).send({ msg: err.code });
                console.log("Error while performing Query.", err);
              }
            }
          );
        }
      );
    }
  );
}

/*
function updateCreditoEquipa(req, res) {
  const id_equipa = req.params.id_equipa;
  let creditos_equipa;
  const query = connect.con.query('SELECT SUM(creditos_ocorrencia) AS creditos_equipa FROM ocorrencia WHERE id_equipa = ?', id_equipa,
  function (err, rows, fields) {
    creditos_equipa = rows[0].creditos_equipa;
    const update = [creditos_equipa, id_equipa];
    const secondquery = connect.con.query('UPDATE equipa SET creditos_equipa = ? WHERE id_equipa = ?', update,
    function (err, rows, fields) {
      if (!err) {
        console.log("Number of records updated: " + rows.affectedRows);
        res.status(200).send({ msg: "Foram atribuidos " +creditos_equipa+ " pontos à Equipa " +id_equipa});
      }
      else {
        res.status(400).send({ msg: err.code });
        console.log("Error while performing Query.", err);
      }
    });
  });
}*/

module.exports = {
  read: read,
  readEquipaOcorrencia: readEquipaOcorrencia,
  readRankingEquipa: readRankingEquipa,
  readMembrosEquipa: readMembrosEquipa,
  updateConfirmarEquipa: updateConfirmarEquipa,
  updateCreditoEquipa: updateCreditoEquipa
};
