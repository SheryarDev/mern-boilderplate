const { validationResult } = require('express-validator');
const User = require('../models/user');
const Company = require('../models/company');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const register = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => {
      return {
        msg: error.msg,
      };
    });

    return res.json({ errors, data: null });
  }

  const { name, email, password, city, address, phone, isCompany, companyName, companyLogo } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.json({
      errors: [
        {
          msg: 'Email already in use',
        },
      ],
      data: null,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    city,
    phone,
    address,
    password: hashedPassword,
    isCompany,
  });
  if (isCompany === true) {
    const newCompany = await Company.create({
      companyName,
      companyLogo,
      owner: newUser._id,
    });
  }

  const token = await JWT.sign({ email: newUser.email }, process.env.JWT_SECRET, {
    expiresIn: 360000,
  });

  res.json({
    errors: [],
    data: {
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        city: newUser.city,
        phone: newUser.phone,
        address: newUser.address,
        isCompany: newUser.isCompany,
      },
    },
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      errors: [
        {
          msg: 'User or Company Not Exist!',
        },
      ],
      data: null,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({
      errors: [
        {
          msg: 'invalid credentials',
        },
      ],
      data: null,
    });
  }

  const token = await JWT.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: 360000,
  });

  return res.json({
    errors: [],
    data: {
      token,
      user,
    },
  });
};

const me = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user });
    if (user) {
      return res.json({
        errors: [],
        data: {
          user,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Delete user

const DeleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const user = await User.findOneAndDelete({ email });
      if (user) {
        return res.json({ message: `${email} deleted successfully` });
      }
    } else {
      return res.json({ message: `${email} user not found` });
    }
  } catch (error) {
    console.log('error', error);
  }
};

module.exports = { login, DeleteUser, me, register };
