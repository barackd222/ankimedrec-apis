# Anki-Medrec - External APIs - Node.js & MongoDB

This is an application provides a Swagger API documentation for the Anki-Medrec Platform project.  For more information, [visit this link](http://anki.medrec.oracleau.cloud).


## Installation

This sections will help you deploy the different packages required to run this Application. This includes: NodeJS, MongoDB and Git.

Note: I use Ubuntu Linux distribution, adjust accordingly if using other OS (e.g. "yum" if using Fedora based distributions).

### 1. Install NodeJS, MongoDB and Git.

The first step is to ensure that you have installed NodeJS, MongoDB and Git in your environment. In case you know that you have already installed them, feel free to move to step number 2. Otherwise if you are unsure, continue with the following assessment:

Validate the installation of the required components (one at a time):
```
nodejs --version
mongo --version
git --version
```

#### 1.1 Install NodeJS (if not already installed)

```
sudo apt-get install curl -y
sudo curl -sL https://deb.nodesource.com/setup_4.x |
sudo -E bash –
sudo apt-get install nodejs -y 
```
Validate the NodeJS installation:
```
node --version
```
You should get a valid version. I used NodeJS version 4.8.0 while building this application.

For more information about using NodeJS [visit to this page](https://nodejs.org/en/download/package-manager/). 

#### 1.2 Install MongoDB (if not already installed):

```
sudo apt-get install mongodb -y
```

Validate the MongoDB installation:
```
mongo --version
```
You should get a valid version. I used MongDB shell version 2.6.10 while building this application

For more information about using MongoDB [visit to this page](https://redthunder.blog/2017/02/28/teaching-how-to-use-mongodb-and-expose-it-via-nodejs-apis/). 


#### 1.3 Install Git (if not already installed):

```
sudo apt-get install git -y
```

Validate the Git installation:
```
git --version
```
You should get a valid version. I used Git version 2.7.4 while building this application

For more information about using installing Git [visit to this page](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-16-04). 


### 2. Cloning the Git repository

```
git clone git://github.com/barackd222/ankimedrec-apis.git
cd ankimedrec-apis
```

### 3. Running the Application

Getting your local environment setup to work with this app locally is easy.  

3.1 Install project package dependencies.

```
npm install
```

3.2. Launch Application.

```
node app.js
```

3.3 Open browser to [http://server:PORT](http://server:PORT).

Update `config.js` if you want to modify the default ports or add any other configuration property.


<br>

#### What next? 

If you want to move your application into the Cloud, consider Oracle Application Container Cloud Service as a simple way to fast-track its enablemnet and future scalability [Click here for more information](https://cloud.oracle.com/acc).

<br>
<br>

* No warranty expressed or implied.  Software is as is.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)

