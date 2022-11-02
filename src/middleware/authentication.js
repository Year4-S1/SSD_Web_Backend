// Create the authentication middleware here
import jwt from 'jsonwebtoken';
import User from '../model/User';

module.exports = async function auth(req, res, next) {
  try {
    const TOKEN = req.header('Authorization');
    const DECODE = jwt.verify(TOKEN, 'ABC_CompanySecret');
    const user = await User.findOne({ _id: DECODE._id, token: TOKEN });

    if (!user) {
      throw new Error(
        'Error from auth middleware - Plase authenticate to the system'
      );
    }
    req.token = TOKEN;
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json(error.message);
  }
};