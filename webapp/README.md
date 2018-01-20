# litpay-webapp

This is the frontend for LitPay and the backend API.

#### API Endpoints (so far)

- POST /api/authenticate - get a new JWT
- POST /api/users - register as a new user
- GET  /api/users/[user_id]/channels - list channels and their info
- GET  /api/users/[user_id]/channels/[channel_id] - get info about a specific channel
- POST /api/users/[user_id]/channels - create a new channel open request

#### Install

Assumes you already have Node.js, NPM and MongoDB installed for your platform.

```
npm install
npm install -g bower
bower install
```

#### Run

```
npm start
```
