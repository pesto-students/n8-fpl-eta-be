![Fantasy Portfilio League](https://github.com/pesto-students/n8-fpl-eta-fe/blob/demo/small-fixes/src/assets/logo-long-light.svg)

# Fantasy Portfolio League - React App

[![Netlify Status](https://api.netlify.com/api/v1/badges/a95a6607-715b-465d-a86d-f39f6e86a094/deploy-status)](https://app.netlify.com/sites/fpleague/deploys)

## Table of Content 
1. [Introduction](#introduction)
2. [Features](#features)
3. [Demo Credentials](#demo)
4. [Documents](#documents)
5. [Technical Details ](#technical-details)
6. [Installation](#installation)
7. [Contact](#contact)
8. [License](#license)


## Introduction 

### Status Quo
The retail participation in Indian stock markets is rising. A SBI report, pointing out that 44.7 lakh retails investor accounts have been added during the two months of the initial lockdown due to pandemic .The number of individual investors in the market has increased by 142 lakh in FY21, with 122.5 lakh new accounts at CDSL and 19.7 lakh in NSDL. Also, the share of individual investors in total turnover on the stock exchange has risen to 45% from 39% in Mar’20, as shown by NSE data.

We believe the reason for the jump in the numbers has been due to increased household savings, generated due to the pandemic that the new investors are putting into stocks.

Further we believe that we have a huge untapped potential for introducing the young age population to Investing in Indian Companies. These too serve as our idea users to learn and grow using our platform.

### Product Opportunity
While the retail investors are investing a majority of them are completely new to the Stocks Market and so there lies an opportunity to provide a  platform for them to learn by investing without substantially losing their hard earned money. 

### How does it work ?
Fantasy Premier League (FPL) is a stock portfolio challenge platform. Each challenge will have a criteria to select and create a portfolio of 5 stocks. The challenge has a cut off date, before which participants can submit their portfolio and an end date on which the user with maximum return on the portfolio will be rewarded in the form of coupons and discounts.

To participate in the challenge the users will have to subscribe to the app. Once subscribed, they will be provided with more tickets each month for the challenges that month. With 1 ticket they can participate in 1 challenge.

## Features 
![Demo Image of the application](https://github.com/pesto-students/n8-fpl-eta-fe/blob/master/src/assets/landing-img.png)

### User Stories
| Feature | Description | Priority |
| ---------------- | ------------ | -------- |
|Landing Page/Home Page | As a user, I should have a page where I can navigate and browse content of the  website. | P1 |
| Signup / Login | As a new user to the site I should be able to register my self. As a returning user I should be able to login to my account | P1 |
| Check Stock Details | As a user I can search Stocks and view details of a particular stock and company(Company Overview,Earnings,Income Statement, Balance Sheet, Cash Flow ) | P1 | 
| Submit Portfolio | As a Logged in user I should be able to use a ticket to select a portfolio challenge and submit a stock portfolio. Users can select from their basket or can  directly add from the stock details page | P1 |
| View Challenge Results | Submitted challenges can be viewed in this section, users cannot edit challenges once the challenge starts. | P1 |
| Subscription Plan | Users can opt for various plans to subscribe. Default free plan will be applied if not opted for any. | P2 |
| User Profile | As a user I should be able to view/update my profile details (Name/Email address) | P2 | 
| Manage Users | As an admin I should be able to manage users and their subscriptions. | Low |
| Disburse Awards to winners | As an admin I should be able to disburse the awards to the winners of a particular challenge. | Low |
Dashboard/Performance Page |  As an admin I should be able to view the performance of challenges, engagement of users in the challenges in a graphical view. | Low

### Workflow Walkthrough

[Walkthrough](https://youtu.be/PihX0ARCFGU)

## Demo Credentials 
app : Fantasy Portfolio League https://fpleague.netlify.app \
username: demo@pesto.com \
password: demopresto

## Documents 
Product Requirement Document :[FPL](https://drive.google.com/file/d/1Pd8VmqID5Ys5YQF64ecCNV5up6dmuHv_/view?usp=sharing) \
UI Design : [Figma](https://www.figma.com/proto/8FqBYcwDPaKWRtAwmGl0nt/FPL?node-id=34%3A20&scaling=min-zoom&page-id=34%3A19&starting-point-node-id=34%3A20) \
High Level Diagram : [HLD](https://drive.google.com/file/d/1iW1XGG8H2i9ffpqBp8cH03ebCsTm8qUo/view)


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

### Deploy fpl-backend app 
```
git clone https://github.com/pesto-students/n8-fpl-eta-be.git
cd n8-fpl-eta-be
npm install
npm start
```



### Deloy fpl-frontend app
```
git clone https://github.com/pesto-students/n8-fpl-eta-fe.git
cd n8-fpl-eta-fe
npm install
npm start
```
> **_Please Note:_**  to deploy the frontend on local backend server please change the REACT_APP_API_SERVER to localhost:8080


## Contact 
[Madan Patro](https://in.linkedin.com/in/madan-patro-1434916a) \
[Neil Doshi](https://in.linkedin.com/?trk=guest_homepage-basic_nav-header-logo)

## Liscence
[MIT](https://opensource.org/licenses/MIT) \
The code has been opensourced for others to view and fork