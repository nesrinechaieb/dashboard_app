const conn = require("../index")

function getAllProfile(callback) {
    const query = 'UPDATE users SET user_name = ? user_email = ? user_password = ? user_birthday   0= ? WHERE idusers = ?'
    conn.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error retrieving user from database: ' + err)
        callback(err)
        return;
      }
      callback(null, results)
    })
  }