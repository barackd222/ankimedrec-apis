# Anki-Medrec - External APIs - Node.js & MongoDB

This is an application example implementing Swagger API documentation for the Anki-Medrec Platform project.  For the internal MedRegNG APIs project see , [visit this link](http://anki.medrec.oracleau.cloud).


## Installation

Follow the next step-by-step instructions on how to get, configure and deploy this application.


### 1.Install NodeJS and MongoDB.

The first step is to insatll NodeJS and MongoDB in your environment in case you haven't insatlled them. A simple way to ensure that ytou have not installed NodeJS and MongoDb in your environment is by attempting to retrieve their versions:

For example:
```
nodejs --version
mongo --version
```
If this does not return a valid version. Then proceed with the following instruction to install the missing packages. Otherwsie feel free to move to step 2.


Note: The following steps are for Ubuntu Linux distibutions, adjust accordsingly if using other OS (e.g. "yum" if using OEL/RH).

#### 1.1 Install NodeJS

```
sudo apt-get install curl -y
sudo curl -sL https://deb.nodesource.com/setup_4.x |
sudo -E bash –
sudo apt-get install nodejs -y 
```
Validate the NodeJS installation:
```
mongo --version
```
You should get a valid version. I used NodeJS version 4.8.0 while building this application.

For more information about using NodeJS [visit to this blog](https://nodejs.org/en/download/package-manager/). 

#### 1.2 Install MongoDB:

```
sudo apt-get install mongodb
```

Validate the MongoDB installation:
```
mongo --version
```
You should get a valid version. I used MongDB shell version 2.6.10 while building this application

For more information about using MongoDB [visit to this blog](https://redthunder.blog/2017/02/28/teaching-how-to-use-mongodb-and-expose-it-via-nodejs-apis/). 


### Download zip or Clone repository and `cd` into it.

```
git clone git://github.com/barackd222/ankimedrec-apis.git
```

### Running the Application

Getting your local environment setup to work with this app is easy.  
After you configure your app with the steps above use this guide to
get it going locally.

1. Install the dependencies.

```
npm install
```

2. Launch local development webserver.

```
node app.js
```

3. Open browser to [http://server:PORT](http://server:PORT).


### 
#### Fastest Deploy

Use Oracle Application Container Cloud Service to deploy this app. [For more information](https://cloud.oracle.com/acc).

### 

## Meta

* No warranty expressed or implied.  Software is as is.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)

