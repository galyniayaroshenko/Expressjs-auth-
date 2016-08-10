import User from '../../models/User';
import UserRepositoryClass from '../../repository/UserRepository';
let UserRepository = new UserRepositoryClass();

let ensureAuth = (req, res, next) => {
    var token = req.headers.token;
    if(token && token != null) {

    UserRepository.getOne({accessToken: token}, (result) => {
      if (result) {
          req.user = result;
          next();
      } else {
          res.json({error: 'error'});
      }
    });
    }
    else {
      res.json({error: 'error'});
    }
};

module.exports = ensureAuth;
