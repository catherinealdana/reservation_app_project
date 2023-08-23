//handle cases where a request is made using an HTTP method that is not allowed for a particular route.

function methodNotAllowed(req, res, next) {
    next({
      status: 405,
      message: `${req.method} not allowed for ${req.originalUrl}`,
    });
  }
  
  module.exports = methodNotAllowed;