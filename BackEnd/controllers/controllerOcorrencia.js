const connect = require("../database");
const { save } = require("./controllerTestemunha");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

//Funcao que le os dados mais importantes referente a cada ocorrencia
function read(req, res) {
  const query = connect.con.query(
    "SELECT oc.id_ocorrencia, loc.freguesia, oc.id_equipa, gu.descricao_urgencia oc.data_ocorrencia FROM ocorrencia oc, localizacao loc, grau_urgencia gu WHERE oc.id_local = loc.id_local and oc.id_nivel = gu.id_nivel",
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

//Funcao que le a descricao do pedido de uma determinada ocorrencia
function readDescricao(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let id_pedido;
  const query = connect.con.query(
    "SELECT id_pedido FROM ocorrencia WHERE id_ocorrencia = ?",
    id_ocorrencia,
    function (err, rows, fields) {
      id_pedido = rows[0].id_pedido;
      const secondquery = connect.con.query(
        "SELECT descricao_pedido FROM pedido WHERE id_pedido = ?",
        id_pedido,
        function (err, rows, fields) {
          if (!err) {
            if (rows.length == 0) {
              res.status(404).send({ msg: "Data not found" });
            } else {
              res.status(200).send(rows[0]);
            }
          } else console.log("Error while performing Query.", err);
        }
      );
    }
  );
}

//Funcao que le todas as ocorrencias que se encontram acabadas, ou seja, o estado da mesma encontra-se Concluido
function readAcabada(req, res) {
  const query = connect.con.query(
    "SELECT oc.id_ocorrencia, loc.freguesia, oc.id_equipa, gu.descricao_urgencia, oc.data_ocorrencia, oc.creditos_ocorrencia FROM ocorrencia oc, localizacao loc, grau_urgencia gu WHERE oc.id_local = loc.id_local and oc.id_nivel = gu.id_nivel and oc.id_estado = 2",
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

function readOcorrenciaAtual(req, res) {
  const id_operacional = req.params.id_operacional;
  let id_estado;
  let id_equipa;
  let id_ocorrencia;
  const query = connect.con.query(
    "SELECT op.id_equipa,oc.id_estado,oc.id_ocorrencia FROM operacional op, ocorrencia oc WHERE op.id_equipa = oc.id_equipa AND op.id_operacional = ?",
    id_operacional,
    function (err, rows, fields) {
      id_equipa = rows[0].id_equipa;
      id_estado = rows[0].id_estado;
      id_ocorrencia = rows[0].id_ocorrencia;
      if (id_estado == 1) {
        const secondquery = connect.con.query(
          "SELECT oc.id_ocorrencia,loc.freguesia,gu.descricao_urgencia,eq.nome_equipa,ma.nome_material,om.quantidade_usada,op.id_operacional FROM ocorrencia oc,localizacao loc, grau_urgencia gu, equipa eq, material ma, ocorrencia_material om, operacional op WHERE oc.id_local = loc.id_local AND oc.id_nivel = gu.id_nivel AND oc.id_equipa = eq.id_equipa AND ma.id_material = om.id_material AND om.id_ocorrencia = oc.id_ocorrencia  AND op.id_operacional = ?",
          id_operacional,
          function (err, rows, fields) {
            res.send(rows);
          }
        );
      }
    }
  );
}

//Funcao que le todos os dados de uma determinada ocorrencia
function readOcorrenciaX(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const query = connect.con.query(
    "SELECT * FROM ocorrencia WHERE id_ocorrencia = ?",
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

//Funcao que le a freguesia de uma determinada ocorrencia para usar o metodo no Mapa
function readFreguesiaOcorrenciaX(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const query = connect.con.query(
    "SELECT lo.freguesia FROM ocorrencia oc, localizacao lo WHERE oc.id_ocorrencia = ?",
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

//Funcao que le os creditos de uma determinada ocorrencia
function readCreditoOcorrenciaX(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const query = connect.con.query(
    "SELECT creditos_ocorrencia FROM ocorrencia WHERE id_ocorrencia = ?",
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

/*
//Este metodo imprime apenas as ocorrencias que teem uma equipa atribuida e ainda esta a decorrer
/*function readOcorrenciaAtual(req, res) {
>>>>>>> 06ecb7cbea19d1631c26855425eb0c86e668f28f
  const id_operacional = req.params.id_operacional;
  let id_equipa;
  let id_estado;
  let id_ocorrencia;
  const query = connect.con.query('SELECT id_equipa FROM operacional WHERE id_operacional = ?', id_operacional,
  function (err, rows, fields) {
    console.log('klasdmasld--------1---------');
    id_equipa = rows[0].id_equipa;
    const secondquery = connect.con.query('SELECT id_estado, id_ocorrencia FROM ocorrencia WHERE id_equipa = ? and id_estado = 1', id_equipa,
    function (err, rows, fields) {
      console.log(rows);
      console.log('klasdmasld--------2---------');
      for(let i = 0; i < rows.length; i++) {
        id_estado = rows[0].id_estado;
        console.log(id_estado);
        id_ocorrencia = rows[0].id_ocorrencia;
        console.log('klasdmasld--------3---------');
        const thirdquery = connect.con.query('SELECT oc.id_ocorrencia, lo.freguesia, ur.descricao_urgencia, eq.nome_equipa, ma.nome_material, om.quantidade_usada, oc.data_ocorrencia, op.id_operacional, op.username FROM localizacao lo, grau_urgencia ur, equipa eq, material ma, ocorrencia_material om, ocorrencia oc, operacional op WHERE oc.id_local = lo.id_local and oc.id_equipa = eq.id_equipa and oc.id_nivel = ur.id_nivel and oc.id_ocorrencia = om.id_ocorrencia and om.id_material = ma.id_material and oc.id_ocorrencia = ?', id_ocorrencia,
        function (err, rows, fields) {
          console.log('klasdmasld--------4---------');
          res.send(rows);
        });
      }
    });
  });
}*/

//Este metodo imprime apenas as ocorrencias que teem uma equipa atribuida e ainda esta a decorrer
function readOcorrenciaAtual(req, res) {
  const id_operacional = req.params.id_operacional;
  let id_ocorrencia;
  const query = connect.con.query(
    "SELECT op.id_equipa, oc.id_ocorrencia FROM operacional op, ocorrencia oc, ocorrencia_material om WHERE op.id_equipa = oc.id_equipa AND oc.id_estado = 1 AND oc.id_ocorrencia = om.id_ocorrencia AND op.id_operacional = ?",
    id_operacional,
    function (err, rows, fields) {
      console.log(rows);
      id_ocorrencia = rows[0].id_ocorrencia;
      console.log(id_ocorrencia);
      const secondquery = connect.con.query(
        "SELECT oc.id_ocorrencia, lo.freguesia, gu.descricao_urgencia, eq.nome_equipa, ma.nome_material, om.quantidade_usada, oc.data_ocorrencia, op.id_operacional, op.username FROM operacional op, ocorrencia oc, equipa eq, material ma, ocorrencia_material om, localizacao lo, grau_urgencia gu WHERE op.id_equipa = eq.id_equipa AND eq.id_equipa = oc.id_equipa AND oc.id_local = lo.id_local AND oc.id_nivel = gu.id_nivel AND oc.id_ocorrencia = om.id_ocorrencia AND ma.id_material = om.id_material AND oc.id_ocorrencia = ? AND op.id_operacional = ?",
        [id_ocorrencia, id_operacional],
        function (err, rows, fields) {
          console.log(rows);
          res.send(rows);
        }
      );
    }
  );
}

//Funcao que contabiliza as ocorrencias de cada mes do ano corrente
function readGrafico(req, res) {
  const query = connect.con.query(
    'SELECT COUNT(*) AS Janeiro, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-02")) AS Fevereiro, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-03")) AS Março, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-04")) AS Abril, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-05")) AS Maio, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-06")) AS Junho, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-07")) AS Julho, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-08")) AS Agosto, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-09")) AS Setembro, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-010")) AS Outubro, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-11")) AS Novembro, (SELECT COUNT(*) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-12")) AS Dezembro, (SELECT COUNT(id_ocorrencia) FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-%m")) AS Total FROM ocorrencia WHERE DATE_FORMAT(data_ocorrencia, "%Y-%m")=DATE_FORMAT(CURDATE(),"%Y-01")',
    function (err, rows, fields) {
      if (!err) {
        //verifica os resultados se o número de linhas for 0 devolve dados não encontrados, caso contrário envia os resultados (rows).
        if (rows.length == 0) {
          res.status(404).send("Data not found");
        } else {
          res.status(200).send(rows[0]);
        }
      } else console.log("Error while performing Query.", err);
    }
  );
}

//Funcao que contabiliza o grau de urgencia total
function readGraficoNivel(req, res) {
  const query = connect.con.query(
    "SELECT id_nivel, COUNT(id_nivel) AS Numero_Ocorrencias FROM ocorrencia WHERE id_nivel IN (SELECT id_nivel FROM ocorrencia) GROUP BY id_nivel",
    function (err, rows, fields) {
      console.log(query.sql);
      if (err) {
        console.log(err);
        res
          .status(jsonMessages.db.dbError.status)
          .send(jsonMessages.db.dbError);
      } else {
        if (rows.length == 0) {
          res
            .status(jsonMessages.db.noRecords.status)
            .send(jsonMessages.db.noRecords);
        } else {
          res.send(rows);
        }
      }
    }
  );
}

//Envia um email ao Centro de Operações com os dados de uma ocorrência terminada
function readDadosOcorrencia(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let id_estado;
  let nome_equipa;
  let freguesia;
  let data_ocorrencia;
  let data_fim_ocorrencia;
  const query = connect.con.query(
    "SELECT id_estado FROM ocorrencia WHERE id_ocorrencia = ? ",
    id_ocorrencia,
    function (err, rows, fields) {
      console.log(rows);
      id_estado = rows[0].id_estado;
      if (id_estado == 2) {
        const secondquery = connect.con.query(
          "SELECT oc.id_ocorrencia, loc.freguesia, eq.nome_equipa, oc.data_ocorrencia, oc.data_fim_ocorrencia FROM ocorrencia oc, equipa eq, localizacao loc WHERE oc.id_equipa = eq.id_equipa AND oc.id_local = loc.id_local AND oc.id_ocorrencia = ?",
          id_ocorrencia,
          function (err, rows, fields) {
            freguesia = rows[0].freguesia;
            nome_equipa = rows[0].nome_equipa;
            data_ocorrencia = rows[0].data_ocorrencia;
            data_fim_ocorrencia = rows[0].data_fim_ocorrencia;
            console.log(secondquery.sql);
            if (!err) {
              let transporter = nodemailer.createTransport(
                smtpTransport({
                  service: "Gmail",
                  auth: {
                    user: "pw.gcodepatrol@gmail.com",
                    pass: "codepatrol123",
                  },
                  tls: {
                    rejectUnauthorized: false,
                  },
                })
              );
              transporter.verify(function (err, success) {
                if (err) {
                  console.log(err);
                }
              });
              var mailOptions = {
                from: "pw.gcodepatrol@gmail.com",
                to: "pw.policiamaritima@gmail.com",
                cc: "pw.gcodepatrol@gmail.com",
                subject: "Dados da Ocorrência",
                text:
                  "Olá, \nVimos por este meio fornecer-vos as informações relativas à ocorrência: " +
                  id_ocorrencia +
                  ".\nFreguesia: " +
                  freguesia +
                  " \nNome Equipa: " +
                  nome_equipa +
                  " \nData da ocorrência: " +
                  data_ocorrencia +
                  " - " +
                  data_fim_ocorrencia +
                  " \nAtenciosamente Responsavel Operações no terreno!",
              };

              transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Email enviado: " + info.response);
                }
              });
            }
          }
        );
      } else {
        res.status(400).send("Ocorrência ainda se encontra em progresso");
      }
    }
  );
}

//Funcao que le as testemunhas de uma determinada ocorrencia
function readTestemunha(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const query = connect.con.query(
    "SELECT de.id_ocorrencia, te.id_testemunha, te.nome_testemunha, te.localidade_testemunha, te.profissao_testemunha, te.email_testemunha, te.notas_testemunha FROM testemunha te, depoimento de WHERE te.id_testemunha = de.id_testemunha AND de.id_ocorrencia = ?",
    id_ocorrencia,
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

//Funcao que apresenta a diferenca entre o tempo de deslocacao real que uma equipa necessitou para chegar a um local e, o tempo estimado, solicitado pelo Google Maps
function readDiferencaTempo(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let tempo_deslocacao;
  let tempo_estimado_deslocacao;
  let diferencaTempo;
  const query = connect.con.query(
    "SELECT tempo_deslocacao, tempo_estimado_deslocacao FROM ocorrencia WHERE id_ocorrencia = ?",
    id_ocorrencia,
    function (err, rows, fields) {
      tempo_deslocacao = rows[0].tempo_deslocacao;
      tempo_estimado_deslocacao = rows[0].tempo_estimado_deslocacao;
      diferencaTempo = tempo_estimado_deslocacao - tempo_deslocacao;
      console.log(tempo_deslocacao);
      console.log(tempo_estimado_deslocacao), console.log(diferencaTempo);
      if (!err) {
        if (rows.length == 0) {
          res.status(404).send({ msg: "Data not found" });
        } else {
          res.status(200).send(diferencaTempo.toString());
        }
      } else res.status(400).send({ msg: err.code });
    }
  );
}

//Funcao que le todas as ocorrencias a decorrer, ou seja, o id_estado tem que estar Em Progresso
function readOcorrenciaDecorrer(req, res) {
  const query = connect.con.query(
    "SELECT oc.id_ocorrencia, lo.freguesia, eq.nome_equipa, gu.descricao_urgencia FROM ocorrencia oc, localizacao lo, equipa eq, grau_urgencia gu WHERE oc.id_equipa = eq.id_equipa AND oc.id_local = lo.id_local AND oc.id_nivel = gu.id_nivel AND id_estado = 1",
    function (err, rows, fields) {
      if (!err) {
        if (rows.length == 0) {
          res.status(404).send({ msg: "Data not found" });
        } else {
          res.status(200).send(rows);
        }
      } else res.status(400).send({ msg: err.code });
    }
  );
}

//Funcao que altera os creditos de uma determinada ocorrencia, tendo em conta 3 variaveis, a duracao da mesma, o nivel e a percentagem de sobreviventes
function updateCreditoOcorrencia(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let id_estado;
  let duracao_ocorrencia;
  let id_nivel;
  let percentagem_sobrevivente;
  let creditos_ocorrencia;
  const query = connect.con.query(
    "SELECT id_estado, duracao_ocorrencia, id_nivel, percentagem_sobrevivente, creditos_ocorrencia FROM ocorrencia WHERE id_ocorrencia = ? and data_fim_ocorrencia IS NOT NULL",
    id_ocorrencia,
    function (err, rows, fields) {
      id_estado = rows[0].id_estado;
      creditos_ocorrencia = rows[0].creditos_ocorrencia;
      if (err) return res.status(500).end();
      if (id_estado == 2) {
        duracao_ocorrencia = rows[0].duracao_ocorrencia;
        id_nivel = rows[0].id_nivel;
        percentagem_sobrevivente = rows[0].percentagem_sobrevivente;
        switch (id_nivel) {
          case 1:
            creditos_ocorrencia = creditos_ocorrencia + 6;
            break;
          case 2:
            creditos_ocorrencia = creditos_ocorrencia + 12;
            break;
          case 3:
            creditos_ocorrencia = creditos_ocorrencia + 18;
            break;
          case 4:
            creditos_ocorrencia = creditos_ocorrencia + 24;
            break;
          case 5:
            creditos_ocorrencia = creditos_ocorrencia + 30;
            break;
        }
        if (duracao_ocorrencia < 60) {
          creditos_ocorrencia = creditos_ocorrencia + 20;
        }
        if (duracao_ocorrencia > 60) {
          creditos_ocorrencia = creditos_ocorrencia + 10;
        }
        if (percentagem_sobrevivente == 100) {
          creditos_ocorrencia = creditos_ocorrencia + 50;
        }
        if (percentagem_sobrevivente >= 50 && percentagem_sobrevivente < 100) {
          creditos_ocorrencia = creditos_ocorrencia + 30;
        }
        if (percentagem_sobrevivente > 0 && percentagem_sobrevivente < 50) {
          creditos_ocorrencia = creditos_ocorrencia + 10;
        }
        if (percentagem_sobrevivente == 0) {
          creditos_ocorrencia = creditos_ocorrencia + 0;
        }
        const update = [creditos_ocorrencia, id_ocorrencia];
        const query = connect.con.query(
          "UPDATE ocorrencia SET creditos_ocorrencia = ? WHERE id_ocorrencia = ?",
          update,
          function (err, rows, fields) {
            res.send("Os creditos foram atribuidos com sucesso");
          }
        );
      } else {
        res.send("A ocorrencia ainda nao esta concluida");
      }
    }
  );
}

//Funcao que altera o estado de uma determinada ocorrencia que se encontrava Em Espera para Em Progresso
function updateConfirmarPartidaOcorrencia(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let id_estado;
  const query = connect.con.query(
    "SELECT id_estado FROM ocorrencia WHERE id_ocorrencia = ?",
    id_ocorrencia,
    function (err, rows, fields) {
      id_estado = rows[0].id_estado;
      if (err) return res.status(500).end();
      if (id_estado == 3) {
        const update = [id_estado, id_ocorrencia];
        const secondquery = connect.con.query(
          "UPDATE ocorrencia SET id_estado = 1 WHERE id_ocorrencia = ?",
          update,
          function (err, rows, fields) {
            res.send("Confirmada a partida para a ocorrencia");
          }
        );
      } else if (id_estado == 2) {
        res.send("A ocorrencia ja foi concluida");
      } else {
        res.send("A ocorrencia ja se encontra em progresso");
      }
    }
  );
}

//Funcao que calcula a duracao de uma ocorrencia, consoante a data de inicio e a data de fim e, o resultado e disponibilizado em minutos
function updateDuracaoOcorrencia(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  let data_ocorrencia;
  let data_fim_ocorrencia;
  let duracao_ocorrencia;
  const query = connect.con.query(
    "SELECT * FROM ocorrencia WHERE id_ocorrencia = ?",
    id_ocorrencia,
    function (err, rows, fields) {
      data_ocorrencia = rows[0].data_ocorrencia;
      data_fim_ocorrencia = rows[0].data_fim_ocorrencia;
      duracao_ocorrencia = Math.abs(data_ocorrencia - data_fim_ocorrencia);
      duracao_ocorrencia = duracao_ocorrencia * 0.00001 * 1.66666667;
      const update = [duracao_ocorrencia, id_ocorrencia];
      if (err) return res.status(500).end();
      const secondquery = connect.con.query(
        "UPDATE ocorrencia SET duracao_ocorrencia = ? WHERE id_ocorrencia = ?",
        update,
        function (err, rows, fields) {
          if (err) return res.status(500).end();
          res.send(
            "A duracao da ocorrencia foi de " + duracao_ocorrencia + " minutos"
          );
        }
      );
    }
  );
}

//Funcao que requer a percentagem de sobreviventes de uma determinada ocorrencia e, de seguida, altera o valor na Base de Dados
function updatePercentagemSobrevivente(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const percentagem_sobrevivente = req.body.percentagem_sobrevivente;
  if (0 <= percentagem_sobrevivente && percentagem_sobrevivente <= 100) {
    const query = connect.con.query(
      "UPDATE ocorrencia SET percentagem_sobrevivente = ? WHERE id_ocorrencia = ?",
      [percentagem_sobrevivente, id_ocorrencia],
      function (err, rows, fields) {
        res.send(
          "A percentagem " +
            percentagem_sobrevivente +
            "% foi inserida com sucesso"
        );
      }
    );
  } else {
    res.send("Por favor, insira um valor entre 0 e 100...");
  }
}

//Funcao que requer o tempo de deslocacao real e o estimado e altera os valores na Base de Dados
function updateTempoDeslocacao(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const tempo_deslocacao = req.body.tempo_deslocacao; //tempo real
  const tempo_estimado_deslocacao = req.body.tempo_estimado_deslocacao; //tempo estimado
  let update = [tempo_deslocacao, tempo_estimado_deslocacao, id_ocorrencia];
  const query = connect.con.query(
    "UPDATE ocorrencia SET tempo_deslocacao = ?, tempo_estimado_deslocacao = ? WHERE id_ocorrencia = ?",
    update,
    function (err, rows, fields) {
      if (!err) {
        console.log("Number of records updated: " + rows.affectedRows);
        res
          .status(200)
          .send("O tempo de deslocação real e estimado foram inseridos!");
      } else {
        res.status(400).send({ msg: err.code });
        console.log("Error while performing Query.", err);
      }
    }
  );
}

//Funcao que altera a data de fim da ocorrencia assim que clica no botao para finalizar a ocorrencia
function updateDataFim(req, res) {
  const id_ocorrencia = req.params.id_ocorrencia;
  const id_estado = 2;
  const data_fim_ocorrencia = new Date();
  const disponibilidade = "Disponivel";
  const update1 = [id_estado, data_fim_ocorrencia, id_ocorrencia];
  const query = connect.con.query(
    "UPDATE ocorrencia SET id_estado = ?, data_fim_ocorrencia = ? WHERE id_ocorrencia = ?",
    update1,
    function (err, rows, fields) {
      console.log(query.sql);
      if (!err) {
        //Voltar a guardar o material utilizado
        const secondquery = connect.con.query(
          "SELECT id_material, quantidade_usada FROM ocorrencia_material WHERE id_ocorrencia = ?",
          id_ocorrencia,
          function (err, rows, fields) {
            console.log(secondquery.sql);
            if (err) {
              console.log(err);
              res.status(400).send({ msg: err.code });
            } else {
              if (!rows.length == 0) {
                let numeroRows = rows.length;
                //console.log(numeroRows);
                for (let i = 0; i < numeroRows; i++) {
                  const id_material = rows[i].id_material;
                  const quantidade_usada = rows[i].quantidade_usada;
                  const thirdquery = connect.con.query(
                    "SELECT quantidade_disponivel FROM material WHERE id_material = ?",
                    id_material,
                    function (err, rows, fields) {
                      console.log(thirdquery.sql);
                      if (err) {
                        console.log(err);
                        res.status(400).send({ msg: err.code });
                      } else {
                        if (!rows.length == 0) {
                          let quantidade_disponivel =
                            rows[0].quantidade_disponivel;
                          quantidade_disponivel =
                            quantidade_disponivel + quantidade_usada;
                          const update2 = [quantidade_disponivel, id_material];
                          const fourthquery = connect.con.query(
                            "UPDATE material SET quantidade_disponivel = ? WHERE id_material = ?",
                            update2,
                            function (err, rows, fields) {
                              console.log(fourthquery.sql);
                              if (err) {
                                res.status(400).send({ msg: err.code });
                              }
                            }
                          );
                        }
                      }
                    }
                  );
                }
              }
            }
          }
        );
        //Tornar disponivel os voluntarios
        const fifthquery = connect.con.query(
          "SELECT id_voluntario FROM ocorrencia_voluntario WHERE id_ocorrencia = ?",
          id_ocorrencia,
          function (err, rows, fields) {
            console.log(fifthquery.sql);
            if (err) {
              console.log(err);
              res.status(400).send({ msg: err.code });
            } else {
              if (!rows.length == 0) {
                let numeroRows2 = rows.length;
                for (let a = 0; a < numeroRows2; a++) {
                  const id_voluntario = rows[a].id_voluntario;
                  const update3 = [disponibilidade, id_voluntario];
                  const sixthquery = connect.con.query(
                    "UPDATE voluntario SET disponibilidade = ? WHERE id_voluntario = ?",
                    update3,
                    function (err, rows, fields) {
                      console.log(sixthquery.sql);
                      if (err) {
                        res.status(400).send({ msg: err.code });
                      }
                    }
                  );
                }
              }
            }
          }
        );
        //Tornar disponivel a equipa
        const seventhquery = connect.con.query(
          "SELECT id_equipa FROM ocorrencia WHERE id_ocorrencia = ?",
          id_ocorrencia,
          function (err, rows, fields) {
            console.log(seventhquery.sql);
            if (err) {
              console.log(err);
              res.status(400).send({ msg: err.code });
            } else {
              if (!rows.length == 0) {
                const id_equipa = rows[0].id_equipa;
                const update4 = [disponibilidade, id_equipa];
                const eigthquery = connect.con.query(
                  "UPDATE equipa SET disponibilidade = ? WHERE id_equipa = ?",
                  update4,
                  function (err, rows, fields) {
                    console.log(eigthquery.sql);
                    if (err) {
                      res.status(400).send({ msg: err.code });
                    }
                  }
                );
              }
            }
          }
        );
        res.status(200).send("Alterações realizadas com sucesso");
      } else {
        res.status(404).send({ msg: "Data not found" });
      }
    }
  );
}

module.exports = {
  read: read,
  readDescricao: readDescricao,
  readAcabada: readAcabada,
  readOcorrenciaX: readOcorrenciaX,
  readFreguesiaOcorrenciaX: readFreguesiaOcorrenciaX,
  readCreditoOcorrenciaX: readCreditoOcorrenciaX,
  readOcorrenciaAtual: readOcorrenciaAtual,
  readGrafico: readGrafico,
  readGraficoNivel: readGraficoNivel,
  readDadosOcorrencia: readDadosOcorrencia,
  readTestemunha: readTestemunha,
  readDiferencaTempo: readDiferencaTempo,
  readOcorrenciaDecorrer: readOcorrenciaDecorrer,
  updateCreditoOcorrencia: updateCreditoOcorrencia,
  updateConfirmarPartidaOcorrencia: updateConfirmarPartidaOcorrencia,
  updateDuracaoOcorrencia: updateDuracaoOcorrencia,
  updatePercentagemSobrevivente: updatePercentagemSobrevivente,
  updateTempoDeslocacao: updateTempoDeslocacao,
  updateDataFim: updateDataFim,
};
