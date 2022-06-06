const express = require("express")
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController")
const auth = require("../middleware/Auth")

router.get('/', HomeController.index);
router.post('/user', UserController.create);
router.get('/user', auth, UserController.index);
router.get('/user/:id', auth, UserController.findById);
router.put('/user/:id', auth, UserController.edit);
router.delete('/user/:id', auth, UserController.delete);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword/:token', UserController.changePassword);
router.post('/login', UserController.login);
router.post('/validate', auth, HomeController.validate);

module.exports = router;