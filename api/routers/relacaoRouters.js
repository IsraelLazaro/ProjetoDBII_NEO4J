const express = require('express');
const router = express.Router();
const neo4jController = require('../controllers/relacaoControllers');

router.post('/dislike', neo4jController.dislikeEvent);
router.post('/gostou', neo4jController.likeEvent);
router.post('/subscribe', neo4jController.SubscribeEvent);
router.post('/remove/subscribe', neo4jController.removeSubscribeEvent);
router.post('/check/like', neo4jController.verificarLike);
router.post('/check/sub', neo4jController.verificarSubscribe);
router.get('/event/participaram/:id', neo4jController.contarUsuariosParticiparam);
router.get('/event/gostaram/:id', neo4jController.contarUsuariosGostaram);



module.exports = router;
