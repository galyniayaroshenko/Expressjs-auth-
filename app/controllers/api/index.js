import express from 'express';

import users from './users';
import auth from './auth';
import performer from './performer';
let api = express.Router();

api.use('/users', users);
api.use('/auth', auth);
api.use('/performer', performer);
export default api;
