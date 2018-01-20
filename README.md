# LitPay
### Like BitPay, but more 'lit'

This project is a work in progress. 

Designed to provide a [Lit](https://github.com/mit-dci/lit) based payment gateway. Lit is a multicoin LN payment channel client
(working on BTC, LTC and VTC). A user makes a channel with a LitPay gateway ahead of time, and then makes a free and instant `push`
at the time of payment as opposed to an additional on-chain payment. This would be especially useful for Bitcoin whose transaction
fees and confirmation times are prohibitively high for small payments. The effective fee from using this scheme is `(2*txfee)/nTxs`, or in other words, cheaper than an on-chain transaction as long as the channel is used more than twice. 

#### Components (so far)

- [litpay-webapp](https://github.com/mit-dci/litpay/tree/master/webapp): an angular/express web application for the frontend control of LitPay
- [litpay-watcher](https://github.com/mit-dci/litpay/tree/master/watcher): a node daemon for managing Lit channels with users and updating their states for the frontend
- [lit](https://github.com/mit-dci/lit): MIT LN daemon
