const router = require('express').Router();
const { getCurrentUser, patchUser } = require('../controllers/users');
const { updateInfo } = require('../middlewares/validations');

router.get('/me', getCurrentUser);
router.patch('/me', updateInfo, patchUser);

module.exports = router;
