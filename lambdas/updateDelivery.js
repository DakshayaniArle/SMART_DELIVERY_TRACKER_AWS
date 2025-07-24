const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const { getDistanceAndTime } = require('./utils/ors'); 

exports.handler = async (event) => {
  console.log("🚀 UpdateDelivery Lambda started");

  const orderId = event.orderId || (event.body && JSON.parse(event.body).orderId);
  console.log("🆔 Order ID:", orderId);

  if (!orderId) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing order Id' }) };
  }

  // Fetch delivery item
  const result = await dynamo.get({
    TableName: 'Deliveries',
    Key: { orderId }
  }).promise();

  const item = result.Item;
  console.log("📦 Existing Delivery:", item);

  if (!item) {
    return { statusCode: 404, body: JSON.stringify({ message: 'Package not found' }) };
  }

  // ✅ If distance is missing or 0, call ORS
  if (!item.distance || item.distance === 0 || item.distance === 50) {
    try {
      const apiKey = process.env.ORS_API_KEY;
      const { distanceKm, durationMin } = await getDistanceAndTime(item.from, item.to, apiKey);
      console.log("📍 ORS Distance:", distanceKm, "km | Duration:", durationMin, "min");

      item.distance = distanceKm;

      // Update distance in DB
      await dynamo.update({
        TableName: 'Deliveries',
        Key: { orderId },
        UpdateExpression: 'set distance = :d',
        ExpressionAttributeValues: { ':d': distanceKm }
      }).promise();
    } catch (err) {
      console.error("❌ ORS Failed:", err.message);
    }
  }

  // ⏱️ Calculate elapsed time
  const now = new Date();
  const createdAt = new Date(item.createdAt);
  const elapsedHours = (now - createdAt) / (1000 * 60 * 60);
  const avgSpeed = item.avgSpeed || 40;

  const distanceCovered = avgSpeed * elapsedHours;
  const progress = distanceCovered / item.distance;

  let newStatus = item.status;
  if (progress >= 1) {
    newStatus = 'Delivered';
  } else if (progress >= 0.9) {
    newStatus = 'Out for Delivery';
  } else if (progress >= 0.25) {
    newStatus = 'Shipped';
  } else {
    newStatus = 'Pending';
  }

  // Update status if changed
  if (newStatus !== item.status) {
    await dynamo.update({
      TableName: 'Deliveries',
      Key: { orderId },
      UpdateExpression: 'set #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': newStatus }
    }).promise();
    console.log(`🔄 Status updated from ${item.status} ➜ ${newStatus}`);
  }

  // 📬 Send email if delivered
  if (newStatus === 'Delivered') {
    await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: 'Package Delivered!',
      Message: `The package with ID ${orderId} has been successfully delivered.`
    }).promise();
  }

  // ✅ Return final status
  return {
    statusCode: 200,
    body: JSON.stringify({
      orderId,
      status: newStatus,
      createdAt: item.createdAt,
      distance: item.distance,
      avgSpeed
    })
  };
};
