import { Router } from 'express';
const router = Router();
import auth from '../middlewares/auth.js';
import User from '../models/User.js';

// get current user
router.get('/me', auth, async (req,res) => {
  res.json({ user: req.user });
});

// sdmin users list 
router.get('/', auth, async (req,res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const users = await User.find().select('-password');
  res.json({ users });
});

export default router;
