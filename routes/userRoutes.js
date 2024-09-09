const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser, restoreUser, assignRole } = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authorizeRole('Admin'), createUser);

router.get('/', authorizeRole(['Admin', 'Manager']), getUsers);

router.get('/:id', authenticateToken, getUserById);

router.put('/:id', authorizeRole('Admin'), updateUser);

router.delete('/:id', authorizeRole('Admin'), deleteUser);

router.patch('/restore/:id', authorizeRole('Admin'), restoreUser);

router.post('/:id/assign-role', authorizeRole('Admin'), assignRole);

module.exports = router;
