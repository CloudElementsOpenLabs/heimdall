"use strict";

const models = require("../db/model");
const { sort } = require('ramda')
const diff = (a, b) => a.displayOrder - b.displayOrder

module.exports = async (elementKey, applicationId) => {
  let element = await models.elements.findOne({
    where: { key: elementKey, applicationId: applicationId },
    include: {
      model: models.properties,
      include: [models.picklistOptions]
    }
  });
  element.properties = sort(diff, element.properties)
  return element
};
