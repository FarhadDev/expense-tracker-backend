
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


exports.register = async (data) => {
  const { error } = registerSchema.validate(data);
  if (error) throw new Error(error.details[0].message);
  const { username, email, password } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  return { message: 'User registered successfully' };
};


exports.login = async (data) => {
  const { error } = loginSchema.validate(data);
  if (error) throw new Error(error.details[0].message);
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  return { token };
};
