const connect = require("../database");

//Funcao que le todos os dados referentes aos materiais
function read(req, res) {
  const query = connect.con.query(
    "SELECT * FROM material",
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

/*function confirmarLevantamento(req, res) {
  const id_material = req.params.id_material;
  let quantidade_saida = req.body.quantidade_saida;
  quantidade_saida = parseInt(quantidade_saida, 10);
  let quantidade_disponivel;
  const query = connect.con.query(
    "SELECT quantidade_disponivel FROM material WHERE id_material = ?",
    id_material,
    function (err, rows, fields) {
      //console.log(query.sql);
      quantidade_disponivel = rows[0].quantidade_disponivel;
      quantidade_disponivel = quantidade_disponivel - quantidade_saida;
      const update = [quantidade_disponivel, id_material];
      const secondquery = connect.con.query(
        "UPDATE material SET quantidade_disponivel = ? WHERE id_material = ?",
        update,
        function (err, rows, fields) {
          //console.log(query.sql);
          res.send("Quantidade confirmada");
        }
      );
    }
  );
}*/

//Funcao que le os materiais disponibilizados para uma determinada ocorrencia, bem como a sua quantidade
function readMaterialOcorrencia(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const query = connect.con.query(
    "SELECT m.nome_material, om.quantidade_usada FROM material m, ocorrencia_material om WHERE om.id_ocorrencia = ? and m.id_material = om.id_material",
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

//Funcao que le apenas os materiais que foram confirmados para irem a uma determinada ocorrencia
function readConfirmarMaterialUsado(req, res) {
  const id_material = req.params.id_material;
  const query = connect.con.query(
    "SELECT m.nome_material, om.quantidade_usada FROM ocorrencia_material om, material m WHERE m.id_material = ? and om.id_material = m.id_material and om.confirmado_material = 1",
    id_material,
    function (err, rows, fields) {
      if (!err) {
        if (rows.length == 0) {
          res.status(404).send({ msg: "Data not found" });
        } else {
          res.status(200).send(rows[0]);
        }
      } else {
        res.status(400).send({ msg: err.code });
        console.log("Error while performing Query.", err);
      }
    }
  );
}

//Funcao que le um id_ocorrencia e altera o booleano, default false, para true, para confirmar os materiais da mesma
function updateConfirmarLevantamento(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let id_material;
  const query = connect.con.query(
    "SELECT id_material FROM ocorrencia_material WHERE id_ocorrencia = ?",
    id_ocorrencia,
    function (err, rows, fields) {
      console.log(rows);
      for (let i = 0; i > rows.length; i++) {
        id_material = rows[i].id_material;
        const update1 = [id_material, id_ocorrencia];
        const secondquery = connect.con.query(
          "UPDATE ocorrencia_material SET confirmado_material = 1 WHERE id_material = ? AND id_ocorrencia = ?",
          update1,
          function (err, rows, fields) {
            console.log(secondquery.sql);
            if (err) {
              res.status(400).send({ msg: err.code });
            } else
              res.send(
                "Os materiais da ocorrencia " +
                  id_ocorrencia +
                  " foram confirmados"
              );
          }
        );
      }
    }
  );
}

module.exports = {
  read: read,
  readMaterialOcorrencia: readMaterialOcorrencia,
  readConfirmarMaterialUsado: readConfirmarMaterialUsado,
  updateConfirmarLevantamento: updateConfirmarLevantamento,
};
