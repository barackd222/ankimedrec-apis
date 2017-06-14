# Anki-Medrec - External APIs - Node.js & MongoDB

This is an application example implementing Swagger API documentation for the Anki-Medrec Platform project.  For the internal MedRegNG APIs project see , [visit this link](http://anki.medrec.oracleau.cloud).


## Installation

This sections will help you deploy the different packages required to run this Application. This includes: NodeJS, MongoDB and Git.

Note: I use Ubuntu Linux distibution, adjust accordingly if using other OS (e.g. "yum" if using OEL/RH).

### 1. Install NodeJS, MongoDB and Git.

The first step is to ensure that you have installed NodeJS, MongoDB and Git in your environment. In case you know that you have already installed them, feel free to move to step 2. Othwerwise if you are unsure, continue with the following assessment.

Validate the installation of the required components one by one:
```
nodejs --version
mongo --version
git --version
```

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

