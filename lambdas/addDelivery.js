const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {

  console.log("🚀 Lambda started");
  let { from, to, distance, email } = JSON.parse(event.body);

  distance = Number(distance)

  const now = new Date().toISOString();

  // Generate unique orderId (e.g., using timestamp or UUID)
  const orderId = Date.now().toString(); // ✅ Clean ID (e.g., "1720709769000")

  const item = {
    orderId,
    from,
    to,
    distance,
    createdAt: now,
    status: 'Pending',
  };

  console.log(item);

  // Save to DynamoDB
  await dynamo.put({
    TableName: 'Deliveries',
    Item: item,
  }).promise();

  // Send email using SNS
  const snsMessage = `Your order (${orderId}) from ${from} to ${to} has been placed successfully. Distance: ${distance} km. Status: Pending.`;

  await sns.publish({
    Subject: 'Delivery Placed',
    Message: snsMessage,
    TopicArn: process.env.SNS_TOPIC_ARN,
  }).promise();

  // ✅ Return the orderId to the frontend
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Delivery added and confirmation mail sent.',
      orderId: orderId,   // ✅ Return the orderId
    }),
  };
};