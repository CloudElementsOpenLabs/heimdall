'use strict'

const POST_APPLICATION = {
    notificationEmail: 'test.notification@email.com',
    cssUrl: null,
    helpUrl: 'http://test/url',
    logoUrl: null
}

const PUT_APPLICATION = {
    orgSecret: 'testOrgSecret',
    notificationEmail: 'test.notification@email.com',
    cssUrl: null,
    logoUrl: 'http://test'
}

const POST_ELEMENT = {
    key: 'bigcommerce',
    name: 'BigCommerce',
    authType: 'basic',
    created_date: '2018-07-08T03:28:54.879Z',
    updated_date: '2018-07-11T17:37:08.588Z',
    properties:[
        {
           dataType:'text',
           description:'Username for the API user',
           displayName:'Username',
           display:true,
           key:'username',
           defaultValue:null,
           oauthUrlParam:null,
           created_date:'2018-07-08T03:28:54.893Z',
           updated_date:'2018-07-11T17:37:08.593Z'
        },
        {
           dataType:'text',
           description:'The API token from BigCommerce',
           displayName:'API Token',
           display:true,
           key:'password',
           defaultValue:null,
           oauthUrlParam:null,
           created_date:'2018-07-08T03:28:54.893Z',
           updated_date:'2018-07-11T17:37:08.594Z'
        },
        {
           dataType:'text',
           description:'Format like: https://mycompany.mybigcommerce.com/api/v2',
           displayName:'API Path',
           display:true,
           key:'store.url',
           defaultValue:'https://<mycompany>.mybigcommerce.com/api/v2',
           oauthUrlParam:null,
           created_date:'2018-07-08T03:28:54.894Z',
           updated_date:'2018-07-11T17:37:08.594Z'
        }
     ]
}

const PUT_ELEMENT = (elementId) => ({
    id: elementId,
    key: 'bigcommerce',
    name: 'BigCommerce',
    authType: 'basic',
    created_date: '2018-07-08T03:28:54.879Z',
    updated_date: '2018-07-11T17:37:08.588Z',
    properties:[
        {
           elementId: elementId,
           dataType:'text',
           description:'Username for the API user',
           displayName:'Username',
           display:true,
           key:'username',
           defaultValue:null,
           oauthUrlParam:null,
           created_date:'2018-07-08T03:28:54.893Z',
           updated_date:'2018-07-11T17:37:08.593Z'
        },
        {
           elementId: elementId,
           dataType:'text',
           description:'The API token from BigCommerce',
           displayName:'API Token',
           display:true,
           key:'password',
           defaultValue:null,
           oauthUrlParam:null,
           created_date:'2018-07-08T03:28:54.893Z',
           updated_date:'2018-07-11T17:37:08.594Z'
        },
        {
           elementId: elementId,
           dataType:'picklist',
           description:'Format like: picklist',
           displayName:'Picklist Option',
           display:true,
           key:'picklist',
           defaultValue:'true',
           oauthUrlParam:null,
           created_date:'2018-07-08T03:28:54.894Z',
           updated_date:'2018-07-11T17:37:08.594Z',
           picklistOptions: [
            {                     
                display:'Super True!',
                value:true
            },
            {
                display:'Extra False!',
                value:false
            }
           ]
        }
     ]
})

module.exports = {
    POST_APPLICATION,
    PUT_APPLICATION,
    POST_ELEMENT,
    PUT_ELEMENT
}