# Heimdall
Cloud Elements Provisioning App. 

Heimdall is authentication as a service. You configure your "application" on Heimdall. Then embed a small
amount of javascript on your front end, which will enable authentication and instance creation to any element configured for your application. 

## Configuring your Database
The Heimdall application will need to acess a postgres database. We use Sequelize to set up all the necesary tables, but you must complete the next steps in order to set up your postgres enviroment.

### 0. Install Postgresql
You can follow the oficial documentation to install postgresql on this link: https://www.postgresql.org/download/

### 1. Create a Role and Database on Postgresql
Once completed the postgres installation you must create a role and a database based on the enviroment.json file.
Execute the following commands on the postgresql terminal.
CREATE ROLE heimdalltest WITH LOGIN PASSWORD 'heimdalltestdb';
ALTER ROLE heimdalltest CREATEDB;
CREATE DATABASE heimdalltest;

## Enviroment Variables
In order to run or test your Heimdall application you must set a group of enviroment variables that heimdall will access. Here are the required variables:

### Database Enviroment Variables
The host, port, user, database and password necesary to connect to your own postgres instance.
#### PGHOST=<host> PGPORT=<port> PGDATABASE=<db> PGUSER=<user> PGPASSWORD=<password>

### Cloud Elements Creadentials (Only Required for running tests)
In order to execute a group of test, we need you to set a set of Cloud Elements credentials as enviroment variables. This is only necesary if you want to run "npm test" and execute our tests. 
#### TEST_USER_SECRET=<user secret> TEST_ORG_SECRET=<org secret>

### Other Required Enviroment Variables
We will need you to provide the url where your heimdall is going to be runing and also the Heimdall enviroment (staging or production).
#### BASE_URL=<url> CE_BASE_URL=<staging or production> 

## Configuring your application

### 0. Environments

Heimdall currently has two environments, staging and production. These are tied to Cloud Elements staging and production environments respectively  
Staging: https://heimdall.stgc0.uswest2.c-e.works   
Production: https://heimdall.cloud-elements.com  

### 1. Create an application. 
The Heimdall application will be tied to your Cloud Elements organization secret. Your organization secret will be stored in Heimdall and you will reference your application with the application ID. Create your application with the following call: 

```bash
curl --request POST \
  --url 'https://heimdall.cloud-elements.com/v1/api/applications' \
  --header 'authorization: User N39frffS9rQEn6ir+sdNRg0SB3q3o875f3289u5HblwM=, Organization 81a64e5bbf4cf635523o783qhg' \
  --header 'content-type: application/json'
```
You can later find your application by calling GET /applications with your Cloud Elements authorization header. This will find your application based on your organization secret in the authorization header. 

### 2. Configure Elements

You can enable provisioning of an element for your application with the following call: 

```bash
curl --request POST \
  --url https://heimdall.cloud-elements.com/v1/api/elements \
  --header 'authorization: User N39frffS9rQEn6ir+sdNRg0SB3q3o875f3289u5HblwM=, Organization 81a64e5bbf4cf635523o783qhg' \
  --header 'content-type: application/json' \
  --data '{
	"key":"box",
	"authType": "oauth2",
    "properties": [
        {
        "dataType": "text",
        "defaultValue": "tfyvgvmvs5wzr8xx1dzm2pmsh5kqtx00",
        "display": false,
        "key": "oauth.api.key"
        },
        {
        "dataType": "text",
        "defaultValue": "YOO55vewjwMZTn7Q7Z3TAM0hbm8REHPP",
        "display": false,
        "key": "oauth.api.secret"
        },
        {
        "dataType": "text",
        "defaultValue": "https://heimdall.stgc0.uswest2.c-e.works/v1/application",
        "display": false,
        "key": "oauth.callback.url"
        }
    ],
    "name": "Box"
}'
```

This will automatically tie this element to your application based on your authorization header. More on configuring elements later.

### 3. Usage

#### Method One (Less Secure)

This method will expose the user secret on the frontend application. Only use this method within the following context: 
1. Your user is signed into your application
2. The signed in user has their own Cloud Elements user. That no other users have access to. This is important, the current user must own the user secret that is being exposed to them. 

To enable your application to use this configuration, embed this javascript on the front end of your application: 

```javascript
<script src="https://heimdall.cloud-elements.com/v1/public/javascripts/heimdall-sdk-staging.js" type="text/javascript"></script>
<script>
    const callback = function(instance) {
        //Handle the created instance here. Save it in your DB...
        console.log(instance)
    }
    const create = () => {
        CE.createInstance({
            elementKey: 'box', 
            applicationId: 1,
            userSecret: '<userSecret>',
            uniqueName: 'My custom instance name'
        }, callback);
    }
</script>
```

This will open up another window or tab and take the user through the authentication flow for that element. When its completed and instance will be created for you and returned to the callback function. 

#### Method Two (Secure)
You will make a server side API call to get a URL to redirect the user to. This url will have an encrypted token that will expire, instead of exposing the user secret. 

```bash
curl --request GET \
  --url 'https://heimdall.cloud-elements.com/v1/api/url?elementKey=box&uniqueName=my%20new%20box' \
  --header 'authorization: User 267nUgE6l5PEFTJSRHDggukC/8x8ggCM5XDaIzBZ0zI=, Organization clx0ITgF4VgEDh96EU5pkgo/EkyuIUqxjb4dDtjt02Q=' \
  --header 'content-type: application/json' \

RESPONSE
{
	"url": "https://heimdall.cloud-elements.com/v1/application?token=81d02a15e5635dc089dee41c6efee48126548c67f521701f43bc1f45c",
    "token":"81d02a15e5635dc089dee41c6efee48126548c67f521701f43bc1f45c"
}
```
Use the following JS with the returned token: 
```javascript
<script src="https://heimdall.cloud-elements.com/v1/public/javascripts/heimdall-sdk-staging.js" type="text/javascript"></script>
<script>
    const callback = function(instance) {
        //Handle the created instance here. Save it in your DB...
        console.log(instance)
    }
    const create = () => {
        CE.createInstance({
            token: '81d02a15e5635dc089dee41c6efee48126548c67f521701f43bc1f45c'
        }, callback);
    }
</script>
```

## Configuring Elements

```bash 
{
    // The Cloud Elements element key. Can be found by calling GET /elements
    "key": "desk",
    
    // The name you want to display when creating an instance
    "name": "Desk.com",
    
    // On oauth 1 or 2 Elements, optionally keep state on a cookie. Useful when an endpoint does not support a "state" parameter
    "cookieAuth": false,      

    // Either: oauth1, oauth2, or basic
    "authType": "oauth1",     
    "properties": [
        {
            // Can be: text, password, or picklist
            "dataType": "text", 

            // If this property is set to display, the description will show as a tooltip 
            "description": null, 

            // The text to display as the text box label
            "displayName": null, 

            // Whether or not to display this property on a form. If no properties are set to display no form will be shown. This would be for pure oauth
            "display": false, 

            // The configuration property key, can be found in developer documentation. This is the key that will be sent to POST /instances in the configuration body
            "key": "oauth.api.key", 

            // A default value. If this property is on a form it will display this value. Otherwise this property will always be the configured value 
            "defaultValue": "Ob1sF24qy48f7eayf7NnE1OC", 
            
            // This property will be sent as a query parameter with this name on the call to GET /oauth/url if this is set. Used if there is a subdomain
            "oauthUrlParam": null 
        }
    ]
}
```

### Examples

Hubspot
```bash
{
    "key":"hubspot",
    "authType": "oauth2",
    "properties": [
        {
            "dataType": "text",
            "defaultValue": "c75b327c-f054-4945-8a7c-f7f56ed3d980",
            "display": false,
            "key": "oauth.api.key"
        },
        {
            "dataType": "text",
            "defaultValue": "30216c94-3f9d-4947-868e-61652e874100",
            "display": false,
            "key": "oauth.api.secret"
        },
        {
            "dataType": "text",
            "defaultValue": "https://heimdall.stgc0.uswest2.c-e.works/v1/application",
            "display": false,
            "key": "oauth.callback.url"
        },
        {
            "dataType": "text",
            "defaultValue": "oauth2",
            "display": false,
            "key": "authentication.type"
        }
    ],
    "name": "Hubspot"
}
```
Desk.com
```bash
{
    "key": "desk",
    "name": "Desk.com",
    "cookieAuth": false,
    "authType": "oauth1",
    "properties": [
        {
            "dataType": "text",
            "display": false,
            "key": "oauth.api.key",
            "defaultValue": "Ob1sFoIr9efpZ7NnE1OC"
        },
        {
            "dataType": "text",
            "display": false,
            "key": "oauth.api.secret",
            "defaultValue": "KcDx0FpUijCLi5UcwBwSU2GQhJs7BrBaPW1vV6Bk"
        },
        {
            "dataType": "text",
            "display": false,
            "key": "oauth.callback.url",
            "defaultValue": "https://heimdall.stgc0.uswest2.c-e.works/v1/application"
        },
        {
            "dataType": "text",
            "description": "For site address: https://mycompany.desk.com/. Subdomain is: mycompany",
            "displayName": "Subdomain",
            "display": true,
            "key": "subdomain",
            "oauthUrlParam": "siteAddress"
        }
    ]
}
```
BigCommerce
```bash
{
    "key": "bigcommerce",
    "name": "BigCommerce",
    "cookieAuth": false,
    "authType": "basic",
    "properties": [
        {
            "dataType": "text",
            "description": "Username for the API user",
            "displayName": "Username",
            "display": true,
            "key": "username"
        },
        {
            "dataType": "text",
            "description": "The API token from BigCommerce",
            "displayName": "API Token",
            "display": true,
            "key": "password"
        },
        {
            "dataType": "text",
            "description": "Format like: https://mycompany.mybigcommerce.com/api/v2",
            "displayName": "API Path",
            "display": true,
            "key": "store.url",
            "defaultValue": "https://<mycompany>.mybigcommerce.com/api/v2",
        }
    ]
}
```
