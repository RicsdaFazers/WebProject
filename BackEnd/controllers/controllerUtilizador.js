const connect = require("../database");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//Funcao que le todos os dados refentes aos utilizadores
function read(req, res) {
  const query = connect.con.query(
    "SELECT * FROM utilizador",
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

//Funcao que le todos os dados referentes a um determinado utilizador
function readUtilizadorX(req, res) {
  const username = req.params.username;
  const query = connect.con.query(
    "SELECT u.username, op.id_operacional, ca.descricao_cargo FROM utilizador u, operacional op, cargo ca WHERE u.username = op.username and ca.id_cargo = u.id_cargo and u.username = ?",
    username,
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

//Funcao que le a especialidade de um determinado utilizador
function readEspecialidadeUtilizador(req, res) {
  const username = req.params.username;
  const query = connect.con.query(
    "SELECT ca.descricao_cargo FROM cargo ca, utilizador us WHERE ca.id_cargo = us.id_cargo and us.username = ?",
    username,
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

//Funcao que permite alterar os dados de um utilizador, com excecao do username e especialidade
/*function updateUtilizador(req, res) {
  const username = req.params.username;
  const nome = req.body.nome;
  const email_utilizador = req.body.email_utilizador;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds).then(function (hash) {
    const update = [nome, email_utilizador, hash, username];
    const query = connect.con.query(
      "UPDATE utilizador SET nome = ?, email_utilizador = ?, password = ? WHERE username = ?",
      update,
      function (err, rows, fields) {
        console.log(query.sql);
        if (!err) {
          console.log("Number of records updated: " + rows.affectedRows);
          res.status(200).send({ msg: "Dados utilizador alterados" });
        } else {
          res.status(400).send({ msg: err.code });
          console.log("Error while performing Query.", err);
        }
      }
    );
  });
<<<<<<< HEAD
}  */

function updateUtilizador(req, res) {

  let username = req.params.username;
  //receber os dados do formuário que são enviados por post
  let nome = req.body.nome;
  let email_utilizador = req.body.email_utilizador;
  let password = req.body.password;

  console.log("without hahsh:" + req.body.password);
  var query = "";
  bcrypt.hash(password, saltRounds).then(function (hash) {
      console.log("with hash:" + hash);

      let update = [
          nome,
          email_utilizador,
          hash,
          username
      ];
      var query = "UPDATE utilizador SET nome = ?, email_utilizador = ?, password= ? WHERE username=?";
      connect.con.query (query, update,
      function (err, rows, fields) {
          if (!err) {
            let query1 = "UPDATE users SET nome = ?, email_utilizador = ?, password= ? WHERE username=?";
            connect.con.query(query1, update, 
              function(err, rows, fields){
                console.log(query1);
              if (!err) {
                  console.log("Number of records updated: " + rows.affectedRows);
                  res.status(200).send({ "msg": "update with success" });
              } else {
                  res.status(400).send({ "msg": err.code });
                  console.log('Error while performing Query.', err);
              }
            })
          } else {
              res.status(400).send({ "msg": err.code });
              console.log('Error while performing Query.', err);
          }
      });
  });
}

module.exports = {
  read: read,
  readUtilizadorX: readUtilizadorX,
  readEspecialidadeUtilizador: readEspecialidadeUtilizador,
  updateUtilizador: updateUtilizador,
};
