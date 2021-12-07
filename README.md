# Fantasy Portfolio League

[![Netlify Status](https://api.netlify.com/api/v1/badges/a95a6607-715b-465d-a86d-f39f6e86a094/deploy-status)](https://app.netlify.com/sites/fpleague/deploys)

## Table of Contents 
1. [Introduction](#introduction)
3. [Demo ](#demo)
4. [Technical Details ](#technical-details)
5. [Installation](#installation)
6. [Contact](#contact)
7. [License](#license)


## Introduction 

While the retail investors are investing a majority of them are completely new to the Stocks Market and so there lies an opportunity to provide a  platform for them to learn by investing without substantially losing their hard earned money. 

Fantasy Premier League (FPL) is a stock portfolio challenge platform. Each challenge will have a criteria to select and create a portfolio of 5 stocks. The challenge has a cut off date, before which participants can submit their portfolio and an end date on which the user with maximum return on the portfolio will be rewarded in the form of coupons and discounts.

To participate in the challenge the users will have to subscribe to the app. Once subscribed, they will be provided with more tickets each month for the challenges that month. With 1 ticket they can participate in 1 challenge.

### Workflow Walkthrough - Demo
[Walkthrough](https://youtu.be/PihX0ARCFGU)
 
## Demo Credentials 
app : Fantasy Portfolio League https://fpleague.netlify.app \
username: demo@pesto.com \
password: demopresto

## Technical Details
### Technologies and API's
| Tech / API  | Description |
| ------------- | ------------- |
| Sentry  | Capture logs of the site  |
| TradingView  | Charting and Stock Details Application  |
| AlphaVantage | Stock Search and Base Price Data |
| Yahoo Finance | To stream live market price |
| Firebase Authentication | User and Login Management |
| Firebase Firestore | Application Database |
| Firebase Realtime Database | Live calculations |
| Nodejs | Application Server |

### Tools and Libraries 
| Library  | Description |
| ------------- | ------------- |
| reactjs  | Frontend Library  |
| redux  | State Management Library  |
| material ui| Base UI framework |
| redux persist | Persist redux state to Browser Local Storage|
| axios | API call and management |
| firebase | access and integrate firebase services |
| alphavantage | access aplhavantage api |
| react-circular-progressbar | used for challenge status component |


### Env variables
> **_Please Note:_**  All env variables to be prepended with `REACT_APP`

| Variable  | Description |
| ------------- | ------------- |
| GOOGLE_API_KEY  | firebase access key  |
| GOOGLE_AUTHDOMAIN  | firebase authdomain key  |
| GOOGLE_PROJECTID| firebase project id |
| GOOGLE_STORAGEBUCKET | firebase storage bucket |
| GOOGLE_MESSAGING_SENDERID | firebase key for notifications |
| GOOGLE_APPID | google app id |
| GOOGLE_MEASUREMENTID | google measurement key for resource use measurement |
| API_SERVER | nodejs deployment |
| ALPHAVANTAGE_KEY | alphavantage api key |
| ALPHAVANTAGE_URL | alphavantage url |
| DATABASE_URL | firebase realtime database url |


## Installation 

### Deloy fpl-backend app
```
git clone https://github.com/pesto-students/n8-fpl-eta-be.git
cd n8-fpl-eta-be
npm install
npm start
```

## Contact 
[Madan Patro](https://in.linkedin.com/in/madan-patro-1434916a) \
[Neil Doshi](https://www.linkedin.com/in/neil-doshi-a919ba69)

## License
[MIT](https://opensource.org/licenses/MIT) \
The code has been opensourced for others to view and fork
