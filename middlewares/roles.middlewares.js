function isLoggedIn(req, res, next) {
  if (req.session.user === undefined) {
    // el usuario no está logeado
    res.redirect("/");
  } else {
    // el usuario si está activo
    next();
  }
}
function isUserLocals(req, res, next) {
  console.log(req.session.user);
  if (req.session.user !== undefined) {
    // creo una variable local que indique que no está logeado
    res.locals.isActive = true
    res.locals.userName = req.session.user.userName
    res.locals.userType = req.session.user.userType
    console.log("localas", res.locals.userName, req.session.user.username)
    if (req.session.user.userType === "owner") {
      res.locals.isOwnerLocals = true;
      res.locals.isSittrLocals = false;
    } else if (req.session.user.userType === "sittr") {
      res.locals.isOwnerLocals = false;
      res.locals.isSittrLocals = true;
    }
  }
  next(); // despues de actualizar la variable, continua con las rutas
}

function isOwner(req, res, next) {
  if (req.session.user !== undefined) {
   if (req.session.user.userType !== "owner") {
    res.redirect("/"); 
    } 
  
  next();
}
}

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
