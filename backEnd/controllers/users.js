const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../database/model/users')
const secretKey = 'mysecretkey'
const conn = require('../database/index')
function login(req, res) {
  const { email, password } = req.body

  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error('Error retrieving user from database: ' + err);
      return res.sendStatus(500)
    }
    if (results.length === 0) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const user = results[0];
    bcrypt.compare(password, user.user_password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords: ' + err)
        return res.sendStatus(500)
      }

      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.User_Id }, secretKey, { expiresIn: '1h' });
      res.send({ token, User_Id: results[0].User_Id })
    });
  });
}
function register(req, res) {
  const { username, password, email, Birthday, Number ,Type ,Image} = req.body;

  User.findByEmail(email, (err, rows) => {
    if (err) {
      return res.status(500).send('Error retrieving user from database: ' + err);
    }
    if (rows.length > 0) {
      return res.status(400).send('Email address already in use');
    }
    if (!password) {
      return res.status(400).send('Password is required');
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).send('Error generating salt: ' + err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return res.status(500).send('Error hashing password: ' + err);
        }

        // Pass the callback function to createUser
        User.createUser(username, hash, email, Birthday, Number,Type,Image, (err, result) => {
          if (err) {
            return res.status(500).send('Error creating user: ' + err);
          }
          return res.sendStatus(200);
        });
      });
    });
  });
}

function getAll (callback) {
  const sql = 'SELECT * FROM users'
  conn.query(sql,  (err, results) =>{
    callback(err, results)
  });
}
const changePassword = (req, res) => {
  const { email, password } = req.body;

  User.updateUserPassword(email, password, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json('Could not update password')
    } else if (!result) {
      res.status(404).json('User not found')
    } else {
      res.json('Password updated successfully')
    }
  });
};

module.exports = { login , 
  register,
  getAll,
  changePassword
 };

