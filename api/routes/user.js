const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken')

const UsersController = require('../controllers/users');


router.post('/signup', UsersController.users_signup);

router.post('/login', UsersController.users_login);

router.get('/', UsersController.users_get_all);

router.delete('/:userId', UsersController.users_delete_user);

module.exports = router;
