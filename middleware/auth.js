const msgStatus = require('../models/data/messages')

module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', msgStatus.authFail.unrecognized)
    res.redirect('/users/login')
  }
}