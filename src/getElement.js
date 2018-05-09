"use strict";

const models = require("../db/model");

module.exports = async (elementKey, applicationId) => {
  return await models.elements.findOne({
    where: { key: elementKey, applicationId: applicationId },
    include: {
      model: models.properties,
      include: [models.picklistOptions]
    }
  });
};
