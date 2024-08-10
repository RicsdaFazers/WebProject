const connect = require("../database");

//Funcao que le todos os dados referentes as testemunhas
function read(req, res) {
  const query = connect.con.query('SELECT * FROM testemunha',
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

//Funcao que insere na tabela das testemunhas os caracteres fornecidos no body e, de seguida, insere na tabela dos depoimentos a testemunha e a ocorrencia a que ficou associada
function save(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let nome_testemunha = req.body.nome_testemunha;
  let email_testemunha = req.body.email_testemunha;
  let profissao_testemunha = req.body.profissao_testemunha;
  let localidade_testemunha = req.body.localidade_testemunha;
  let notas_testemunha = req.body.notas_testemunha;
  let id_testemunha;
  const post = [nome_testemunha, email_testemunha, profissao_testemunha, localidade_testemunha, notas_testemunha];
  const query = connect.con.query('INSERT INTO testemunha  SET nome_testemunha = ?, email_testemunha = ?, profissao_testemunha = ?, localidade_testemunha = ?, notas_testemunha = ?', post,
  function (err, rows, fields) {
    if (err) return res.status(500).end();
  });
  const secondquery = 'SELECT id_testemunha FROM testemunha WHERE nome_testemunha = ? and email_testemunha = ?';
  connect.con.query(secondquery, post,
  function (err, rows, fields) {
    id_testemunha = rows[0].id_testemunha;
    const post2 = [id_ocorrencia, id_testemunha];
    const thirdquery = connect.con.query('INSERT INTO depoimento SET id_ocorrencia = ?, id_testemunha = ?', post2,
    function (err, rows, fields) {
      if (!err) {
        res.status(200).location(rows.insertId).send({ msg: "Testemunha associada com sucesso"});
        console.log("Number of records inserted: " + rows.affectedRows);
      }
      else {
        if (err.code == "ER_DUP_ENTRY") {
          res.status(400).send({ msg: err.code});
          console.log('Error while performing Query.', err);
        }
        else res.status(400).send({ msg: err.code});
      }
    });
  });
}

module.exports = {
  read: read,
  save: save
}
