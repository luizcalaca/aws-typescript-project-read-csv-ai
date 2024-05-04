import { S3Event } from 'aws-lambda';
import { S3, DynamoDB } from 'aws-sdk';
import { parse } from 'papaparse'; 
import { CSVType } from './types/CSVType';
import { randomUUID } from 'crypto';

export const handler = async (event: S3Event, context: any) => {
  const s3 = new S3();
  const dynamoDB = new DynamoDB.DocumentClient();
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

  try {
    const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    const csvData = data.Body ? data.Body.toString('utf-8') : '';
    const parsedData = parse(csvData, { header: true }).data as unknown as CSVType[];

    for (const item of parsedData) {
      const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'csv-messages-chat',
        Item: {
          id: randomUUID(),
          channel: item.channel
        }
      };

      await dynamoDB.put(params).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Inserted into DynamoDB' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error to read in DynamoDB' })
    };
  }
};
