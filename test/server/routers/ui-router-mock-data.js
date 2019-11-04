'use strict'

const BIG_COMMERCE = 
{
    id: 1,
    applicationId: 1,
    key: "bigcommerce",
    name: "BigCommerce",
    authType: "basic",
    created_date: "2018-07-08T03:28:54.879Z",
    updated_date: "2018-07-11T17:37:08.588Z",
    properties: [
        {
            id: 1,
            elementId: 1,
            dataType: "text",
            description: "Username for the API user",
            displayName: "Username",
            display: true,
            key: "username",
            defaultValue: null,
            oauthUrlParam: null,
            created_date: "2018-07-08T03:28:54.893Z",
            updated_date: "2018-07-11T17:37:08.593Z"
        },
        {
            id: 2,
            elementId: 1,
            dataType: "text",
            description: "The API token from BigCommerce",
            displayName: "API Token",
            display: true,
            key: "password",
            defaultValue: null,
            oauthUrlParam: null,
            created_date: "2018-07-08T03:28:54.893Z",
            updated_date: "2018-07-11T17:37:08.594Z"
        },
        {
            id: 3,
            elementId: 1,
            dataType: "text",
            description: "Format like: https://mycompany.mybigcommerce.com/api/v2",
            displayName: "API Path",
            display: true,
            key: "store.url",
            defaultValue: "https://<mycompany>.mybigcommerce.com/api/v2",
            oauthUrlParam: null,
            created_date: "2018-07-08T03:28:54.894Z",
            updated_date: "2018-07-11T17:37:08.594Z"
        }
    ]
}

const BOX = {
    id: 2,
    applicationId: 1,
    key: "box",
    name: "Box",
    authType: "oauth2",
    created_date: "2018-07-11T20:09:27.538Z",
    updated_date: "2018-07-11T20:09:27.538Z",
    properties: [
        {
            id: 4,
            elementId: 2,
            dataType: "text",
            description: null,
            displayName: null,
            display: false,
            key: "oauth.api.key",
            defaultValue: "5jgzkn7wverxdc8gfcrjq44iwkppj2gp",
            oauthUrlParam: null,
            created_date: "2018-07-11T20:09:27.553Z",
            updated_date: "2018-07-11T20:09:27.553Z"
        },
        {
            id: 5,
            elementId: 2,
            dataType: "text",
            description: null,
            displayName: null,
            display: false,
            key: "oauth.api.secret",
            defaultValue: "dPUtYP7ZUPmUdnB94k0OgvHU7uMBXqSC",
            oauthUrlParam: null,
            created_date: "2018-07-11T20:09:27.553Z",
            updated_date: "2018-07-11T20:09:27.553Z"
        },
        {
            id: 6,
            elementId: 2,
            dataType: "text",
            description: null,
            displayName: null,
            display: false,
            key: "oauth.callback.url",
            defaultValue: "https://heimdall-staging.cloud-elements.com/v1/application",
            oauthUrlParam: null,
            created_date: "2018-07-11T20:09:27.554Z",
            updated_date: "2018-07-11T20:09:27.554Z"
        }
    ]
}

const DESK = 	{
    id: 3,
    applicationId: 1,
    key: "desk",
    name: "Desk.com",
    authType: "oauth1",
    created_date: "2018-07-12T19:40:55.579Z",
    updated_date: "2018-07-12T19:40:55.579Z",
    properties: [
        {
            id: 7,
            elementId: 3,
            dataType: "text",
            description: null,
            displayName: null,
            display: false,
            key: "oauth.api.key",
            defaultValue: "Ob1sFoIr9efpZ7NnE1OC",
            oauthUrlParam: null,
            created_date: "2018-07-12T19:40:55.584Z",
            updated_date: "2018-07-12T19:40:55.584Z"
        },
        {
            id: 8,
            elementId: 3,
            dataType: "text",
            description: null,
            displayName: null,
            display: false,
            key: "oauth.api.secret",
            defaultValue: "KcDx0FpUijCLi5UcwBwSU2GQhJs7BrBaPW1vV6Bk",
            oauthUrlParam: null,
            created_date: "2018-07-12T19:40:55.584Z",
            updated_date: "2018-07-12T19:40:55.584Z"
        },
        {
            id: 9,
            elementId: 3,
            dataType: "text",
            description: null,
            displayName: null,
            display: false,
            key: "oauth.callback.url",
            defaultValue: "https://heimdall-staging.cloud-elements.com/v1/application",
            oauthUrlParam: null,
            created_date: "2018-07-12T19:40:55.585Z",
            updated_date: "2018-07-12T19:40:55.585Z"
        },
        {
            id: 10,
            elementId: 3,
            dataType: "text",
            description: "For site address: https://mycompany.desk.com/. Subdomain is: mycompany",
            displayName: "Subdomain",
            display: true,
            key: "subdomain",
            defaultValue: null,
            oauthUrlParam: "siteAddress",
            created_date: "2018-07-12T19:40:55.585Z",
            updated_date: "2018-07-12T19:40:55.585Z"
        }
    ]
}

const credentials = {
    BIG_COMMERCE : {
        username: process.env.TEST_BIGCOMMERCE_USERNAME,
        password: process.env.TEST_BIGCOMMERCE_PASSWORD,
        storeUrl: process.env.TEST_BIGCOMMERCE_STORE_URL
    },
    BOX : {
        username: process.env.TEST_BOX_EMAIL,
        password: process.env.TEST_BOX_PASSWORD
    },
    DESK : {
        subdomain: process.env.TEST_DESK_SUBDOMAIN,
        username: process.env.TEST_DESK_EMAIL,
        password: process.env.TEST_DESK_PASSWORD
    }
}

module.exports =  {
    BIG_COMMERCE,
    BOX,
    DESK,
    credentials
}