# CS310-project2

Project 02 injects a web service tier between the Python-based client and the AWS services:
The web service will be written in JavaScript using Node.js and the Express framework. T
he client is still Python-based, rewritten to interact with the web service instead of AWS directly. 
The database and S3 bucket remain unchanged from CS310 - Project 01.

Major steps include:

1. Build the web service, running either in replit or on your local machine. This way it’s easy to run, test and debug. You will test using a web browser as the client, not the Python-based client.
2. Build the Python-based client, providing a better way to test. You’ll also be able to confirm images are downloaded properly by displaying.
3. Add another feature (image upload). Update web service, test. Update python client, test.
4. Package and deploy using AWS Elastic Beanstalk / EC2, making it available to the world.
