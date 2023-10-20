//
// app.get('/assets', async (req, res) => {...});
//
// Return all the assets from the database:
//
const dbConnection = require('./database.js')

exports.get_assets = async (req, res) => {

  console.log("call to /assets...");

  // async call to get all assets from RDS
  const fetchAssets = new Promise((resolve, reject) => {

    console.log("/assets: calling RDS...");

    const sql = "SELECT * FROM assets ORDER BY assetid ASC;";

    // async RDS call
    dbConnection.query(sql, (err, results) => {
      if (err) {
        // throw err if query fails
        reject(err);
        return;
      }

      console.log("/assets query done");
      resolve(results);
    });
  });

  try {
    // wait for RDS promise query
    const users = await fetchAssets;
    res.json({
      "message": "success",
      "data": users
    });
  } catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
