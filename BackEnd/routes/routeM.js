const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const controllerUtilizador = require("../controllers/controllerUtilizador");
const controllerEquipa = require("../controllers/controllerEquipa");
const controllerOcorrencia = require("../controllers/controllerOcorrencia");
const controllerOperacional = require("../controllers/controllerOperacional");
const controllerMaterial = require("../controllers/controllerMaterial");
const controllerTestemunha = require("../controllers/controllerTestemunha");

router.get("/", function (req, res) {res.send("Pagina principal");});

//Utilizador

router.get("/users", controllerUtilizador.read);
router.get("/users/:username/info", controllerUtilizador.readUtilizadorX);
router.get("/users/:username/role", controllerUtilizador.readEspecialidadeUtilizador);
router.put("/users/:username",
    [
        body('nome')
            .not()
            .isEmpty()
            .withMessage('Insira um nome válido'),
        body('email_utilizador')
            .isEmail()
            .withMessage('Insira um email válido'),
        body('password')
            .isLength({ min: 8, max: 15 })
            .withMessage('Password deve ter entre 8 e 15 caracteres')
    ], function (req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ msg: err.array()});
        }
        controllerUtilizador.updateUtilizador(req, res);
    });

//Equipa

router.get("/teams", controllerEquipa.read);
router.get("/teams/:id_ocorrencia/view_team", controllerEquipa.readEquipaOcorrencia);
router.get("/teamsRanking", controllerEquipa.readRankingEquipa);
router.get("/teams/:id_equipa/members", controllerEquipa.readMembrosEquipa);
router.put("/teams/:id_equipa/check_team", controllerEquipa.updateConfirmarEquipa);
router.put("/teams/:id_ocorrencia/credit_team", controllerEquipa.updateCreditoEquipa);

//Ocorrencia

router.get("/occurrences", controllerOcorrencia.read);
router.get("/occurrences/:id_ocorrencia/description", controllerOcorrencia.readDescricao);
router.get("/occurrences/finished", controllerOcorrencia.readAcabada);
router.get("/occurrences/:id_ocorrencia", controllerOcorrencia.readOcorrenciaX);
router.get("/occurrences/:id_ocorrencia/local", controllerOcorrencia.readFreguesiaOcorrenciaX);
router.get("/occurrences/:id_ocorrencia/read_credit", controllerOcorrencia.readCreditoOcorrenciaX);
router.get("/occurrences/:id_operacional/accurring", controllerOcorrencia.readOcorrenciaAtual);
router.get("/occurrencesGraphic", controllerOcorrencia.readGrafico);
router.get("/occurrencesLevel", controllerOcorrencia.readGraficoNivel);
router.get("/occurrences/:id_ocorrencia/sendmail", controllerOcorrencia.readDadosOcorrencia);
router.get("/occurrences/:id_ocorrencia/timeDiff", controllerOcorrencia.readDiferencaTempo);
router.get("/occurrences/:id_ocorrencia/witnesses", controllerOcorrencia.readTestemunha);
router.get("/occurrencesOccurring", controllerOcorrencia.readOcorrenciaDecorrer);
router.put("/occurrences/:id_ocorrencia/credit", controllerOcorrencia.updateCreditoOcorrencia);
router.put("/occurrences/:id_ocorrencia/check_departure", controllerOcorrencia.updateConfirmarPartidaOcorrencia);
router.put("/occurrences/:id_ocorrencia/duration", controllerOcorrencia.updateDuracaoOcorrencia);
router.put("/occurrences/:id_ocorrencia/survival",
    [
        body('percentagem_sobrevivente')
            .not()
            .isEmpty()
            .withMessage('Insira um valor para a percentagem de sobreviventes')
    ], function(req, res) {
        const err = validationResult(req);
        if(!err.isEmpty()) {
            return res.status(400).send({ msg: err.code});
        }
        controllerOcorrencia.updatePercentagemSobrevivente(req, res);
    });
router.put("/occurrences/:id_ocorrencia/times",
    [
        body('tempo_deslocacao')
            .not()
            .isEmpty()
            .withMessage('Insira o valor que demorou a chegar ao local'),
        body('tempo_estimado_deslocacao')
            .not()
            .isEmpty()
            .withMessage('Insira o valor dado pelo mapa...')
    ], function(req, res) {
        const err = validationResult(req);
        if(!err.isEmpty()) {
            return res.status(400).send({ msg: err.code});
        }
        controllerOcorrencia.updateTempoDeslocacao(req, res);
    });
router.put("/occurrences/:id_ocorrencia/finishdate", controllerOcorrencia.updateDataFim);

//Operacional

router.get("/agents", controllerOperacional.read);
router.get("/agents/:id_operacional/agent", controllerOperacional.readOperacional);
router.get("/agents/:id_operacional/role", controllerOperacional.readEspecialidade);
router.get("/agents/:id_operacional/occurrence", controllerOperacional.readOcorrenciaOperacional);
router.get("/agents/:id_operacional/read_credit", controllerOperacional.readCreditoOperacional);
router.get("/agentsRanking", controllerOperacional.readRankingOperacional);
router.put("/agents/:id_ocorrencia/put_credit", controllerOperacional.updateCreditoOperacional);

//Material

router.get("/materials", controllerMaterial.read);
router.get("/materials/:id_ocorrencia/material", controllerMaterial.readMaterialOcorrencia);
router.get("/materials/:id_material/confirm", controllerMaterial.readConfirmarMaterialUsado);
router.put("/materials/:id_ocorrencia/withdraw", controllerMaterial.updateConfirmarLevantamento);

//Testemunha

router.get("/witnesses", controllerTestemunha.read);
router.post("/witnesses/:id_ocorrencia/registration", 
    [
        body('nome_testemunha')
            .not()
            .isEmpty()
            .withMessage("Por favor insira o nome da testemunha"),
        body('email_testemunha')
            .isEmail()
            .withMessage("Por favor insira um email válido (ex: teste@gmail.com)"),
        body('notas_testemunha')
            .not()
            .isEmpty()
            .withMessage("Por favor insira o depoimento realizado pela testemunha")
    ], function(req, res) {
        const err = validationResult(req);
        if(!err.isEmpty()) {
            return res.status(400).send({ msg: err.code});
        }
        controllerTestemunha.save(req, res);
    });

module.exports = router;
