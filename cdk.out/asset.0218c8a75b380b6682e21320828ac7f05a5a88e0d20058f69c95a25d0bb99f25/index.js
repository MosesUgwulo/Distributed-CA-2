"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lambdas/processImage.ts
var processImage_exports = {};
__export(processImage_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(processImage_exports);

// utils.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
function createDDbDocClient() {
  const ddbClient = new import_client_dynamodb.DynamoDBClient({ region: process.env.REGION });
  const marshallOptions = {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  };
  const unmarshallOptions = {
    wrapNumbers: false
  };
  const translateConfig = { marshallOptions, unmarshallOptions };
  return import_lib_dynamodb.DynamoDBDocumentClient.from(ddbClient, translateConfig);
}

// lambdas/processImage.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var import_lib_dynamodb2 = require("@aws-sdk/lib-dynamodb");
var s3 = new import_client_s3.S3Client();
var ddbDocClient = createDDbDocClient();
var handler = async (event) => {
  try {
    console.log("Event ", event);
    for (const record of event.Records) {
      const recordBody = JSON.parse(record.body);
      console.log("Raw SNS message ", JSON.stringify(recordBody));
      if (recordBody.Records) {
        for (const messageRecord of recordBody.Records) {
          const s3e = messageRecord.s3;
          const srcBucket = s3e.bucket.name;
          const srcKey = decodeURIComponent(s3e.object.key.replace(/\+/g, " "));
          const typeMatch = srcKey.match(/\.([^.]*)$/);
          if (!typeMatch) {
            console.log("Could not determine the image type.");
            throw new Error("Could not determine the image type. ");
          }
          const imageType = typeMatch[1].toLowerCase();
          if (imageType != "jpeg" && imageType != "png") {
            console.log(`Unsupported image type: ${imageType}`);
            throw new Error("Unsupported image type: ${imageType. ");
          }
          const imageName = srcKey.split("/");
          await ddbDocClient.send(
            new import_lib_dynamodb2.PutCommand({
              TableName: process.env.TABLE_NAME,
              Item: {
                imageName
              }
            })
          );
        }
      }
    }
  } catch (error) {
    console.log("Error ", error);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
