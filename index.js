const fs = require("fs");
const path = require("path");
require("dotenv").config();
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

// s3.listBuckets((err, data) => {
//     if(err) console.log(err, err.stack);
//     else console.log(data);
// })

const listBuckets = async () => {
    try {
        const data = await s3.listBuckets().promise();
        console.log(data);
    } catch (error) {
        console.log(error, error.stack);
    }
};

const uploadFiletoS3 = (filePath, bucketName) => {
    const file = fs.readFileSync(filePath);
    const params = {
        Bucket: bucketName, 
        Key: path.basename(filePath), //name of the file to be stored on AWS
        Body: file
    };
    
    s3.upload(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
};

uploadFiletoS3("./profile.jpg", "aicurate-bucket");