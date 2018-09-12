'use strict'

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
      hooks: {
          beforeCreate: object => {
            object.dataValues.id = null
            return object
          }
      }
  }
});

sequelize.authenticate()
    .then(r => console.log('Connected to database'))
    .catch(r => console.error('Failed to connect to database', r))

const closeConnection = () => sequelize.close()


const schemaIdentifiers = {
    application : "applicationSchema",
    element : "elementSchema",
    property : "propertySchema",
    picklist : "picklistSchema"
}

const applicationSchema = {
    orgSecret: { type: Sequelize.STRING, allowNull: false, field: 'org_secret', unique: true},
    notificationEmail: { type: Sequelize.STRING, allowNull: true, defaultValue:null, field: 'notification_email'},
    cssUrl: { type: Sequelize.STRING, allowNull: true, defaultValue:null, field: 'css_url'},
    helpUrl: { type: Sequelize.STRING, allowNull: true, defaultValue:null, field: 'help_url'},
    logoUrl: { type: Sequelize.STRING, allowNull: true, defaultValue:null, field: 'logo_url'},
}

const applications = sequelize.define(
    'applications', 
    applicationSchema,
    {
        tableName: "application",
        createdAt: "created_date",
        updatedAt: "updated_date", 
        hooks: {
            afterValidate: (object, options) => {
                object.id = null
            }
    }
})

const elementSchema = {
    applicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: applications,
            key: 'id'
        },
        field: "application_id"
    },
    key: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    authType: { type: Sequelize.ENUM, allowNull: false, field: 'auth_type', values: ['oauth2', 'oauth1', 'basic']}
}

const elements = sequelize.define(
    'elements',
    elementSchema, 
    {
        tableName: "element",
        createdAt: "created_date",
        updatedAt: "updated_date",
        hooks: {
            afterValidate: (object, options) => {
                object.id = null
            }
    }
}) 
applications.hasMany(elements, {onDelete: "cascade"})

const propertySchema =  {
    elementId: {
        type: Sequelize.INTEGER,
        references: {
            model: elements, 
            key: 'id'
        },
        field: 'element_id', 
        allowNull: false
    },
    dataType:{
        type: Sequelize.ENUM,
        allowNull: false,
        field: 'data_type',
        values: ['text', 'password', 'picklist']
    }, 
    description: { type: Sequelize.STRING },
    displayName: { type: Sequelize.STRING, field: 'display_name' },
    display: { type: Sequelize.BOOLEAN, defaultValue: false },
    key: { type: Sequelize.STRING, allowNull: false },
    defaultValue: { type: Sequelize.TEXT, field: 'default_value' },
    oauthUrlParam: { type: Sequelize.STRING, field: 'oauth_url_param' }
}

const properties = sequelize.define(
    'properties', 
    propertySchema,
    {
        tableName: "element_property",
        createdAt: "created_date",
        updatedAt: "updated_date",
        hooks: {
            afterValidate: (object, options) => {
                object.id = null
            }
    }
})
elements.hasMany(properties, {onDelete: "cascade"})

const picklistSchema = {
    propertyId: {
        type: Sequelize.INTEGER,
        references: {
            model: properties,
            key: 'id'
        },
        field: 'element_property_id',
        allowNull: false
    },
    display: { type: Sequelize.STRING, allowNull: false },
    value: { type: Sequelize.STRING, allowNull: false },
}

const picklistOptions = sequelize.define(
    'picklistOptions', 
    picklistSchema,
    {
        tableName: "picklist_option",
        createdAt: "created_date",
        updatedAt: "updated_date",
        hooks: {
            afterValidate: (object, options) => {
                object.id = null
            }
    }
})
properties.hasMany(picklistOptions, {onDelete: "cascade"})

sequelize.sync()


module.exports = {
    elements,
    applications,
    applicationSchema,
    properties, 
    picklistOptions,
    schemaIdentifiers,
    closeConnection
}