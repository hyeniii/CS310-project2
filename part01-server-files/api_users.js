//
// app.get('/users', async (req, res) => {...});
//
// Return all the users from the database:
//
const dbConnection = require('./database.js')

exports.get_users = async (req, res) => {

  console.log("call to /users...");

  // async call to get all users from RDS
  const fetchUsers = new Promise((resolve, reject) => {
    console.log("/users: calling RDS...");
    const sql = "SELECT * FROM users ORDER BY userid ASC;";

    // async RDS call
    dbConnection.query(sql, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("/users query done");
      resolve(results);
    });
  });

  try {
    // wait for RDS promise query
    const users = await fetchUsers;
    res.json({
      "message": "success",
      "data": users
    });
  } catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }
}

