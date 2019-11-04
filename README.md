# Heimdall
Cloud Elements Provisioning App. 

Heimdall is authentication as a service. After configuring your "application" on Heimdall, embed a small
amount of javascript on your front end to enable authentication and instance creation to any element configured for your application. 

### Environments

Heimdall currently utilizes three environments: staging, production and EU production.  
Each Heimdall environment depends on a respective Cloud Elements environment:


|    |  Heimdall Base URL | CE Base URL | CE Login |
| :- |:- |:- |:- |
|US Staging:    | heimdall-staging.cloud-elements.com | staging.cloud-elements.com | my-staging.cloudelements.io |
|US Production: | heimdall.cloud-elements.com         | api.cloud-elements.com |  my.cloudelements.io |
|EU Production: | heimdall.cloud-elements.co.uk       | api.cloud-elements.co.uk | my.cloudelements.co.uk |

### Hosting 

Heimdall can be used/tested with our hosted version, free of charge, during your development. When it is time for you to use Heimdall at a production level, you have the option to license Cloud Elements to host your production application for you. To understand the costs associated with this, please talk to your Account Manager or Sales Executive. Alternatively, you can host it yourself on your own servers. Below you will learn more about testing with our hosted Heimdall or hosting it locally for testing.

# Table of Contents
1. [Configuring Your Application](#configureApp)
2. [Configuring Elements](#configureElements)
3. [Usage](#usage)
4. [Local Installation](#localInstallation)



## Configuring your application <a name="configureApp"></a>  

The Heimdall application will be tied to your Cloud Elements organization secret. Your organization secret will be stored in Heimdall and you can reference your application with either the application ID or your organization secret. Create your application with the following call: 

```bash
curl --request POST \
  --url 'https://heimdall.cloud-elements.com/v1/api/applications' \
  --header 'authorization: User N39frffS9rQEn6ir+sdNRg0SB3q3o875f3289u5HblwM=, Organization 81a64e5bbf4cf635523o783qhg' \
  --header 'content-type: application/json' \
  --data '{
    "notificationEmail": youremail@company.com,
    "cssUrl": "https://app.com/public/css/style.css",
  }
```
### Configuration Fields
1. notificationEmail: When an instance is created an email will be sent to this email address notifying you that an instance was created
2. cssUrl: This is for overriding the CSS for the generated forms. More on overriding css later

You can later find your application by calling GET /applications with your Cloud Elements authorization header. This will find your application based on your organization secret in the authorization header. 


## Configuring Elements <a name="configureElements"></a>  

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
        "defaultValue": "https://heimdall.cloud-elements.com/v1/application",
        "display": false,
        "key": "oauth.callback.url"
        }
    ],
    "name": "Box"
}'
```

This call will automatically tie this element to your application based on your authorization header. 
```bash 
{
    # The Cloud Elements element key. Can be found by calling GET /elements
    "key": "desk",
    
    # The name you want to display when creating an instance
    "name": "Desk.com",

    # Either: oauth1, oauth2, or basic
    "authType": "oauth1",     
  
    # Each property object will render a form field: 
    "properties": [
        {
            # Can be: text, password, or picklist.  
            "dataType": "text", 

            # If this property is set to display, the description will show as a tooltip.  
            "description": null, 

            # The text to display as the text box label.  
            "displayName": null, 

            # Whether or not to display or hide this form input. 
            # If all properties are configured to display false, no form will be shown and the defaultValues will be used for a pure oauth flow.  
            "display": false, 

            # An integer representing the order in which to display these fields on the generated form. 
            "displayOrder": 1, 

            # The configuration property key, can be found in developer documentation. 
            # This is the key that will be sent to POST /instances in the configuration body. 
            "key": "oauth.api.key", 

            # A default value. If this property is on a form it will display this value in the form input. 
            # Otherwise this property will always be the configured value. 
            "defaultValue": "Ob1sF24qy48f7eayf7NnE1OC", 
            
            # Used if there is a subdomain
            # Sends both "key:value" and "siteAddress:value" to GET elements/{elementKey}/oauth/url and will return with the value prepended on the url. 
            "oauthUrlParam": "siteAddress"
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
            "defaultValue": "https://heimdall.cloud-elements.com/v1/application",
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
            "defaultValue": "https://heimdall.cloud-elements.com/v1/application"
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
            "defaultValue": "https://<mycompany>.mybigcommerce.com/api/v2"
        }
    ]
}
```

## Usage <a name="usage"></a>

### Method One (Less Secure)

This method will expose the user secret on the frontend application. Only use this method within the following context: 
1. Your user is signed into your application
2. The signed in user has their own Cloud Elements user. That no other users have access to. This is important, the current user must own the user secret that is being exposed to them. 

To enable your application to use this configuration, embed this javascript on the front end of your application: 

```javascript
<script src="https://heimdall.cloud-elements.com/v1/public/javascripts/heimdall-sdk.js" type="text/javascript"></script>
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

### Method Two (Secure)
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
<script src="https://heimdall.cloud-elements.com/v1/public/javascripts/heimdall-sdk.js" type="text/javascript"></script>
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
### Updating Instances

If you need to update an existing instance for the purpose of re-authentication, you can provide an `instanceId` in either method, this will take the user through the same authentication flow, but instead of creating a new instance it will update the existing one.

```bash
curl --request GET \
  --url 'https://heimdall.cloud-elements.com/v1/api/url?elementKey=box&uniqueName=my%20new%20box&instanceId=12345' \
  --header 'authorization: User 267nUgE6l5PEFTJSRHDggukC/8x8ggCM5XDaIzBZ0zI=, Organization clx0ITgF4VgEDh96EU5pkgo/EkyuIUqxjb4dDtjt02Q=' \
  --header 'content-type: application/json' \

RESPONSE
{
	"url": "https://heimdall.cloud-elements.com/v1/application?token=81d02a15e5635dc089dee41c6efee48126548c67f521701f43bc1f45c",
    "token":"81d02a15e5635dc089dee41c6efee48126548c67f521701f43bc1f45c"
}
```

## Local Installation <a name="localInstallation"></a>
The Heimdall application will need to acess to a PostgreSQL database on your localhost. [Sequelize](https://www.npmjs.com/package/sequelize) sets up the necesary tables but you must first manually create the database and assign a role.

### 1. Install PostgreSQL
Follow the official documentation to [install postgresql](https://www.postgresql.org/download) or use the package manager [homebrew](https://formulae.brew.sh/formula/postgresql).


### 2. Create a Role and Database on Postgresql
Execute the following commands on the postgresql terminal:
```bash
    CREATE ROLE heimdall WITH LOGIN PASSWORD 'heimdalldb';
    ALTER ROLE heimdall CREATEDB;
    CREATE DATABASE heimdall;
```
When heimdall starts up, it will attempt to authenticate to the database specified by the `PGDATABASE` environment variable and will create the necessary schema defined in the [db/script.sql](./db/script.sql) file.

### 3. Enviroment Variables
In order to run or test your Heimdall application you must set a group of enviroment variables that heimdall will access. Here are the required variables:
```bash
PORT=4000,
CE_BASE_URL=https://staging.cloud-elements.com/elements/api-v2/, // base url for Cloud Elements
BASE_URL=localhost:4000, // base url for heimdall, used to generate the url returned by GET /url
SECRET_KEY=aj58fud430pslkrs87k5eu5ikjdeeujy, // secret for encrypting/decrypting tokens
EXPIRES_IN=3600, // time for tokens to live in seconds 
PGUSER=heimdall, // postgres username
PGPASSWORD=heimdalldb, // postgres password
PGDATABASE=heimdall, // postgres database
PGHOST=localhost, // postgres host URL 
PGPORT=5432, // postgres port
SENDGRID_USER=267nUgE6l5PzBZ0zI=, // Cloud Elements user secret that contains a sendgrid element to send emails. You can leave this blank if you are not going to be sending emails
SENDGRID_ORG=clx0ITgFjt02Q=, // Cloud Elements org secret that contains a sendgrid element to send emails. You can leave this blank if you are not going to be sending emails
SENDGRID_TOKEN=uvYpdJm1GVN3gYkQ= // Cloud Elements element token for a sendgrid instance. you can leave this blank if you are not going to be sending emails. 
```

### 4. Install and Run 
`npm install`
`npm start`

