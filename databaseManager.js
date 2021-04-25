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

module.exports.updateItem = async (itemID, paramsName, paramsValue) => {
  
  const params = {
    TableName: TABLE_NAME,
    Key: {
      ID: itemID
    },
    UpdateExpression: `set ${paramsName} = :updateValue`,
    ExpressionAttributeValues: {
      ':updateValue': paramsValue
    },
    ReturnValues: 'ALL_OLD'
  }
  const data = await dynamo.update(params).promise()
  return data.Attributes;
}