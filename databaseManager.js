'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.tableName;

module.exports.saveItem = async (item) => {
  const params = {
    TableName: TABLE_NAME,
    Item: item
  }

  const res =await dynamo.put(params).promise()
  return item;
}

module.exports.getItem = async (itemID) => {
  const params = {
    Key: {
      ID: itemID
    },
    TableName: TABLE_NAME
  };

  const data = await dynamo.get(params).promise()
  if(Object.entries(data).length < 0) {
    return null;
  }
  return data.Item;
}

module.exports.deleteItem = itemID => {
  const params = {
    Key: {
      ID: itemID
    },
    TableName: TABLE_NAME
  }

  return dynamo.delete(params).promise()
}

module.exports.updateItem = (itemID, paramsName, paramsValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      itemID
    },
    ConditionExpression: 'attribute_exits(itemID)',
    UpdateExpression: 'set ' + paramsName + ' =:v',
    ExpressionAttributeValues: {
      ':v': paramsValue
    },
    ReturnValues: 'ALL_NEW'
  }

  return dynamo.update(params).promise()
  .then(response => {
    return response.Attributes;
  })
}