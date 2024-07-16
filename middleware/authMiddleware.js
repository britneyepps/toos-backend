import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import Admin from '../models/admins.js'

dotenv.config();


// TODO: Cleanup middleware
export const protect = async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get admin from the token
      req.admin = await Admin.findById(decoded.id).select('-password')

      next();
    } catch (error) {
      console.log(error)
      res.status(403)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(403)
    throw new Error('Not authorized, no token')
  }

}

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export const getIdFromToken = (req) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {

    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      return decoded.id;
    } catch (error) {
      console.error(error);
    }

    return null;

  }

  return null;
}