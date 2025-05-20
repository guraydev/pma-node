// Restrict access to specified roles
const restrictTo = (roles) => {
  return (req, res, next) => {
    console.log('restrictTo: user role=', req.user.role, 'required=', roles);
    if (!roles.includes(req.user.role)) {
      console.log('restrictTo: Forbidden');
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { restrictTo };