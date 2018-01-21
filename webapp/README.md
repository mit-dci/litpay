# litpay-webapp

This is the frontend for LitPay and the backend API.

#### API Endpoints (so far)

- User Management
    - POST /api/authenticate - get a new JWT
    - POST /api/users - register as a new user

- Channel Management
    - GET  /api/users/[user_id]/channels - list channels and their info
    - GET  /api/users/[user_id]/channels/[channel_id] - get info about a specific channel
    - POST /api/users/[user_id]/channels - create a new channel open request

- Payments
    - GET /api/users/[user_id]/payments - list of payments associated with this user and their info
    - GET /api/users/[user_id]/payments/[payment_id] - get info about a specific payment
    - POST /api/users/[user_id]/payments - create a new payment invoice from this user to the given user

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
