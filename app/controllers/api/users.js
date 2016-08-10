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
    UserRepository.getOne({accessToken: token}, function(result) {
      if(result) {
        result.accessToken = null;
        UserRepository.update(result, function(data) {
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
    UserRepository.getOne({_id: userId}, function (result) {
        res.json({user: result, status: {success: 'Ok', error: null}});
    });
});

// users.get('/logout', (req, res) => {
//     let accessToken = req.headers.token;
//     if(accessToken == undefined)
//     {
//       accessToken = 'none';
//     }
//     UserRepository.getOne({accessToken: accessToken}, function (result) {
//         result.accessToken = null;
//         UserRepository.update(result, function (data) {
//           res.json({user: data, status: {success: 'ok', error: 'null'}});
//         });
//         res.json({user: result, status: {success: 'Ok', error: null}});
//     });
// });

users.post('/', (req, res) => {
    let user = req.body;
    let email = user.email;
    let password = user.password;
    console.log(user);
    if (!email) {
        res.json({user: null, status: {success: null, error: 'No Email'}});
    }
    UserRepository.getOne({email: email}, function (result) {
        if (!result) {
            UserRepository.create(user, function (result) {
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
    UserRepository.update(user, function (result) {
        res.json(result);
    });
});

users.delete('/:id', (req, res) => {
    let userId = req.params.id;
    UserRepository.delete(userId, function (result) {
        res.json(result);
    });
});

export default users;
