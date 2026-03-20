/**
 * Middleware de restriction par rôle
 * À utiliser après le middleware protect (authentification)
 * @param {...string} roles - Rôles autorisés (ex: 'RH_ADMIN', 'MANAGER')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle "${req.user.role}" n'est pas autorisé à accéder à cette ressource.`,
      });
    }
    next();
  };
};

module.exports = { authorize };
