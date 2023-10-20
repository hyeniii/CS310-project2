//
// app.get('/bucket?startafter=bucketkey', async (req, res) => {...});
//
// Retrieves the contents of the S3 bucket and returns the 
// information about each asset to the client. Note that it
// returns 12 at a time, use startafter query parameter to pass
// the last bucketkey and get the next set of 12, and so on.
//
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_bucket = async (req, res) => {

  console.log("call to /bucket...");

  // Set variables
  const maxKeys = 12;
  let startAfter;

  // check for optional query parameter
  if (req.query.startafter) {
    startAfter = req.query.startafter;
  }

  try {
    // params to send to s3
    const params = {
      Bucket: s3_bucket_name,
      MaxKeys: maxKeys,
    };

    // add query param if it exists
    if (startAfter) {
      params.StartAfter = startAfter;
    };

    const command = new ListObjectsV2Command(params);
    const s3Response = await s3.send(command); // async call

    // handle case when KeyCount is 0

    let dataContents = s3Response.KeyCount > 0 ? s3Response.Contents : [];
    
    res.json({
      "message": "success",
      "data": dataContents,
  });
  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch
}//get
