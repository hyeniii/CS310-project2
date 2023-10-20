// app.get('/download/:assetid', async (req, res) => {...});
//
// downloads an asset from S3 bucket and sends it back to the
// client as a base64-encoded string.
//
const dbConnection = require('./database.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_download = async (req, res) => {

  console.log("call to /download...");
  let assetid = req.params.assetid;

  try {
    // async function to fetch bucket key of assetID
    const result = await fetchBucketKey(assetid);
    // catch for error where no such assetID exists
    if (!result.length) {
      throw new Error("no such asset...");
    }
    // unpack s3 request results
    const { userid, assetname, bucketkey } = result[0];
    // create param dict for s3 request
    const s3Params = {
      Bucket: s3_bucket_name,
      Key: bucketkey,
    };

    console.log("/download: calling S3...")
    const s3Response = await s3.send(new GetObjectCommand(s3Params));
    var datastr = await s3Response.Body.transformToString("base64");
    console.log("/download: S3 request done & data converted to base64-encoded string");

    res.json({
      "message": "success",
      "user_id": userid,
      "asset_name": assetname,
      "bucket_key": bucketkey,
      "data": datastr,
    });

  }//try
  catch (err) {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function:
    //
    res.status(400).json({
      "message": err.message,
      "user_id": -1,
      "asset_name": "?",
      "bucket_key": "?",
      "data": []
    });
  }//catch

}//get'

// define async function to fetch bucket key for assetID
async function fetchBucketKey(assetid) {
  return new Promise((resolve, reject) => {
    console.log("/download: calling RDS...");
    const sql = `SELECT userid, assetname, bucketkey FROM assets WHERE assetid = ?;`;
    
    // async query to RDS
    dbConnection.query(sql,[assetid], (err, results) => {
      if (err) {
        reject(err);
        return
      };

      console.log("/download RDS query done");
      resolve(results);
    });
  });
};