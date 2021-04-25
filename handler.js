'use strict';

const databaseManager = require('./databaseManager');

const randomID = function () {
  return Math.random().toString(36).substring(2,8)
}

const createResponse = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}

module.exports.saveItem = async (event) => {
  const item = JSON.parse(event.body)
  item.ID = randomID();
  const newPost = await databaseManager.saveItem(item)
  return createResponse(200, newPost)
};

module.exports.getItem = async (event) => {
  const itemId = event.pathParameters.itemID
  const getInfo = await databaseManager.getItem(itemId)
  if (!getInfo) {
    return createResponse(404, "Not Found!")
  }
  return createResponse(200, getInfo)
};

module.exports.deleteItem = async (event) => {
  const itemId = event.pathParameters.itemID

  const res = await databaseManager.deleteItem(itemId)
  
  return createResponse(200, "Item was deleted")
};

module.exports.updateItem = async (event) => {
  const itemId = event.pathParameters.itemID

  const body = JSON.parse(event.body)
  const paramName = body.paramName
  const paramValue = body.paramValue

  const data = await databaseManager.updateItem(itemId, paramName, paramValue)

  return createResponse(200, data)
};