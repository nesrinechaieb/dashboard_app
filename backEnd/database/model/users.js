const conn = require("../index")
const bcrypt = require('bcrypt')


function findByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE user_email = ?'
    conn.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error retrieving user from database: ' + err)
        callback(err)
        return;
      }
      callback(null, results)
    })
  }
  function createUser(username, password, email, Birthday, Number, Type, Image,callback) {
    if (typeof Birthday !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(Birthday)) {
      const error = new Error('Invalid Birthday format. It should be in the format MM/DD/YYYY.')
      console.error(error)
      callback(error, null)
      return
    }
    const [month, day, year] = Birthday.split('/')
    const birthdayDate = new Date(`${year}-${month}-${day}`)
  
    const formattedBirthday = birthdayDate.toISOString().slice(0, 10)
  
  const query = 'INSERT INTO users (user_name, user_password, user_email, user_birthday, user_number, user_image, user_type) VALUES (?, ?, ?, ?, ?,"https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg" ,"user")'

    conn.query(query, [username, password, email, formattedBirthday, Number, Type,Image], (err, result) => {
      if (err) {
        console.error('Error creating user: ' + err)
        callback(err, null)
      } else {
        callback(null, result)
      }
    })
  }
  
  
  
  
  
  
  const updateUserPassword = (email, password, callback) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
  
    const sql = 'UPDATE users SET user_password = ? WHERE user_email = ?';
  
    conn.query(sql, [hash, email], (err, result) => {
      if (err) {
        callback(err, null);
      } else if (result.affectedRows === 0) {
        callback(null, false)
      } else {
        callback(null, true)
      }
    });
  };

  module.exports = { findByEmail,
    createUser,
    updateUserPassword
 };
  