import express from 'express';
import UserRepositoryClass from '../../repository/UserRepository';
import ensureAuth from './token_auth';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs';

let users = express.Router();
let UserRepository = new UserRepositoryClass();

users.get('/logout', (req, res) => {
    let token = req.headers.token;
    if(token == undefined)
    {
      token = 'none';
    }
    UserRepository.getOne({accessToken: token}, (result) => {
      if(result) {
        result.accessToken = null;
        UserRepository.update(result, (data) => {
          res.json(data);
        });
      } else {
          res.json({user: null, status: {success: null, error: 'token is null'}});
      }
    });
});


users.get('/', (req, res) => {
    UserRepository.getAll(function (result) {
        res.json({users: result, status: {success: 'Ok', error: null}});
        console.log('Smile!');
    });
});

users.get('/:id',  (req, res) => {
    let userId = req.params.id;
    UserRepository.getOne({_id: userId}, (result) => {
        res.json({user: result, status: {success: 'Ok', error: null}});
    });
});

// users.get('/logout', (req, res) => {
//     let accessToken = req.headers.token;
//     if(accessToken == undefined)
//     {
//       accessToken = 'none';
//     }
//     UserRepository.getOne({accessToken: accessToken}, (result) => {
//         result.accessToken = null;
//         UserRepository.update(result, (data) => {
//           res.json({user: data, status: {success: 'ok', error: 'null'}});
//         });
//         res.json({user: result, status: {success: 'Ok', error: null}});
//     });
// });

users.post('/', (req, res) => {
    let user = req.body;
    let email = req.body.email;
    let password = user.password;
    console.log(user);
    if (!req.body.email ) {
        res.json({user: null, status: {success: null, error: 'No Email'}});
    }
    UserRepository.getOne({email: email}, (result) => {
        if (!result) {
            UserRepository.create(user, (result) => {
                res.json(result);
            });
        } else {
            res.json({user: null, status: {success: null, error: 'Email is using by other member'}});
        }
    });
});

users.put('/:id', (req, res) => {
    let user = req.body.user;
    user._id = req.params.id;
    user.lastUpdate = new Date().getTime();
    UserRepository.update(user, (result) => {
        res.json(result);
    });
});

users.delete('/:id', (req, res) => {
    let userId = req.params.id;
    UserRepository.delete(userId, (result) => {
        res.json(result);
    });
});

export default users;
