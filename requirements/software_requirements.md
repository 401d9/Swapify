# Swapo (Services Website )
​
## Software Requirements : 

​
###  Summary of the Idea 
Swapo is an online platform that allows people to conveniently exchange, or simply give out services for free. We provide you with an easy-to-use and free platform to swap your services for needed ones. We trade, by barter! Visit Swapo to swap, and give out any service.

### Vision: 
Why pay if you can swap!
​

## Scope (In/Out)
### INs : 
* The web app will provide information to the users about all the different needed    services 
* The web app will allow users to see the top-ranked profiles 
* The web app will allow users to Sign up using basic auth 
* The web app will allow users to Sign in using bearer auth 
* The web app will Authenticate users through google/facebook oauth 
* The app accounts will run on Role based access control 
* The web app will have its own API for saving and editing events happening soon and adding new events. 
* Authenticated users will be able to “Star” their favorite service providers. 
* Authenticated user can save the products in wish list
* The app will allow Chat for the users.
* The app will give a notification for users for some status.
​
​
### OUTs  :
* our web app will never turn into an IOS or Android app
* our web app will never turn into a social media platform 
​
​
## Minimum Viable Product ( vs ) 

*  Normal signup and sign in.
* The user can signup using third-party providers like Google, Facebook.
* The user can add their own service to be added to the API and be available for other users to swap
* Authenticated users will be able to “Star” their favorite service providers.
* users can send massages in order to swap
* users can receive a notification in some status
​
​
​
## Stretch
* Provides many options for communication, such as voice and video calls 
* The main service provider will have sub-providers

## Functional Requirements
* An admin can create and delete user accounts
* A user can update their profile information
* A user can search all of the services in the inventory
​
​
## Data Flow

The user will enter the website and see the main page that contains the categories of services, then if the user wants to swap, he must register on the website through an email and password or by google/Facebook, then the account will be created and saved it in the database, and after signing in the user will be able to view the whole website and search for services, the user will also be able to create their own profile and becoming the service admin and controlling their own content, also the user will also be able to send message to another user and rate the users.
​
​
## Non-Functional Requirements
​
#### Security 
​
Our app will be secured with basic auth for sign up , bearer auth for sign in and oauth for authentication of users  ,and role based access control for each role defined in the website 
​
#### Testability 
​
Our app will be tested for each functionality added up to at least 80% covered 