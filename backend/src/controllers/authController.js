const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role }
  });
}

// there's nothing to invalidate server side since we're using a stateless JWT
// (no session table / redis blacklist for a fresher-scale assignment). logout
// is handled by the frontend just dropping the token. leaving this endpoint in
// so the API surface matches what the brief asked for, and so it's an easy spot
// to plug in token revocation later if this ever needed to be production-hardened.
function logout(req, res) {
  res.json({ message: 'logged out' });
}

module.exports = { login, logout };
