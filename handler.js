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
  console.info(item)
  const newPost = await databaseManager.saveItem(item)
  console.info("Handler 21", newPost)  
  return createResponse(200, newPost)
};

module.exports.getItem = (event, context, callback) => {
  const itemId = event.pathParamaters.itemID

  databaseManager.getItem(itemId)
  .then(response => {
    callback(null, createResponse(200, response))
  })
};

module.exports.deleteItem = (event, context, callback) => {
  const itemId = event.pathParamaters.itemID

  databaseManager.deleteItem(itemId)
  .then(response => {
    callback(null, createResponse(200, "Item was deleted"))
  })
};

module.exports.updateItem = (event, context, callback) => {
  const itemId = event.pathParamaters.itemID

  const body = JSON.parse(event.body)
  const paramName = body.paramName
  const paramValue = body.paramValue

  databaseManager.updateItem(itemId, paramName, paramValue)
  .then(response => {
    callback(null, createResponse(200, response))
  })
};