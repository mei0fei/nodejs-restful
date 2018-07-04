const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');


exports.users_get_all = (req, res, next)=>{
  User.find()
    .exec()
    .then(users=>{
      if(users.length>=1){
        res.status(200).json({
          users: users
        })
      }else{
        res.status(404).json({
          message: "no user found"
        });
      }
    })
    .catch();
};

exports.users_login = (req, res, next)=>{
  User.find({email: req.body.email})
    .exec()
    .then(user=>{
      if(user.length<1){
        return res.status(404).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
        if(err){
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if(result){
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        res.status(401).json({
          message: 'Auth failed'
        });
      });

    })
    .catch(err=>{
      res.status(500).json({
        error: err
      });
    });
};

exports.users_delete_user = (req, res, next)=>{
  User.findOneAndRemove({_id: req.params.userId})
    .exec()
    .then(result=>{
      if(result){
        res.status(200).json({
          message: "user deleted"
        });
      }else{
        res.status(404).json({
          message: "user not found"
        });
      }
    })
    .catch(err=>{
      res.status(500).json({
        error: err
      });
    });
};

exports.users_signup = (req, res, next)=>{
  User.find({email: req.body.email})
    .exec()
    .then(user=>{
      //user is an array
      if(user.length>=1){
        return res.status(409).json({
          message: 'mail existed!'
        });
      }else{
        bcrypt.hash(req.body.password, 10, (err, hash)=>{
          if(err){
            return res.status(500).json({
              error: err
            });
          }else{
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result=>{
                console.log(result);
                res.status(201).json({
                  message: 'user created!'
                });
              })
              .catch(err=>{
                res.status(500).json({
                  error: err
                });
              });
          }});
      }
    })
    .catch(err=>{
      res.status(500).json({
        error: err
      });
    });
};
