//Autentificación y Autorización

//Usuarios sin autorización no se le permite el acceso a ciertas secciones
function isLoggedIn(req, res, next) {
  if (req.session.user === undefined) {
    // el usuario no está logeado
    res.redirect("/");
  } else {
    // el usuario si está activo
    next();
  }
}

//Variables locales para la gestión de visualización del nav
function isUserLocals(req, res, next) {
  // console.log(req.session.user);
  //Comprobación de que la sesión está activa
  if (req.session.user !== undefined) {
    res.locals.isActive = true
    res.locals.userName = req.session.user.userName
    res.locals.userType = req.session.user.userType
    // console.log("localas", res.locals.userName, req.session.user.username)

    if (req.session.user.userType === "owner") {
      res.locals.isOwnerLocals = true;
      res.locals.isSittrLocals = false;
    } else if (req.session.user.userType === "sittr") {
      res.locals.isOwnerLocals = false;
      res.locals.isSittrLocals = true;
    }
  }
  next();
}

//Middleware para controlar el acceso de un usuario distinto de owner a las páginas owner
function isOwner(req, res, next) {
  if (req.session.user !== undefined) {
    if (req.session.user.userType !== "owner") {
      res.redirect("/");
    }

    next();
  }
}

//Middleware para controlar el acceso de un usuario distinto de sittr a las páginas sittr
function isSittr(req, res, next) {
  if (req.session.user !== undefined) {
    if (req.session.user.userType !== "sittr") {
      res.redirect("/");
    }

    next();
  }
}


module.exports = {
  isLoggedIn,
  isUserLocals,
  isOwner,
  isSittr
};
