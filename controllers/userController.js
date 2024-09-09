const { User } = require('../models/user');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newUser = await User.create({ username, email, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        deletedAt: null,  
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const user = await User.findByPk(id);

    if (!user || user.deletedAt !== null) {
      return res.status(404).json({ error: 'User not found or has been deleted.' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user || user.deletedAt !== null) {
      return res.status(404).json({ error: 'User not found or has already been deleted.' });
    }

    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({ message: 'User soft-deleted successfully.' });
  } catch (error) {
    console.error('Error soft deleting user:', error);
    res.status(500).json({ error: 'An error occurred while soft deleting the user.' });
  }
};

exports.restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
        deletedAt: { [Op.not]: null },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Soft-deleted user not found.' });
    }

    user.deletedAt = null;
    await user.save();

    res.status(200).json({ message: 'User restored successfully.' });
  } catch (error) {
    console.error('Error restoring user:', error);
    res.status(500).json({ error: 'An error occurred while restoring the user.' });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required.' });
    }

    const user = await User.findByPk(id);

    if (!user || user.deletedAt !== null) {
      return res.status(404).json({ error: 'User not found or has been deleted.' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: `Role assigned successfully. User is now a ${role}.` });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'An error occurred while assigning the role.' });
  }
};
