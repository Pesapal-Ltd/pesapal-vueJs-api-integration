<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <img alt="Pesapal logo" src="./assets/pp-logo.png">
  <h3>Hallo from Pesapal. Enjoy our VueJs Pesapal API Integration</h3>
  <p>In this quick demo integration, I have added only the Script part. Feel to extend it to build your template part!</p>
</template>

<script>
import pesapalApiClient from './services/pesapalApi.js';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid package

export default {
  data() {
    return {
      consumerKey: "TDpigBOOhs+zAl8cwH2Fl82jJGyD8xev", //Ug demo key, replace with your live once ready for production. https://developer.pesapal.com/api3-demo-keys.txt
      consumerSecret: "1KpqkfsMaihIcOlhnBo/gBZ5smw=",
      IPNUrl: "http://localhost:4200/yourIPNUrl",
      accessToken: null,
      notificationId: null, //your can persist this to database once generated
      request: {
        "merchant_reference": uuidv4(), //Required.This represents your Unique ID which you send to us. It should be unique for every order request.
        "currency": "UGX",//Reqiured EG USD, KES OR TZS
        "amount": 100, //Required
        "description": "TEST Transanction", //Required -- you can replace this according to your requirement
        "callback_url": "http://localhost:4200/your_callback_url", //Required
        "notification_id": this.notificationId, //Required. This is the we got as response in the register IPN URL endpoint.
        "language": "", //optional
        "terms_and_conditions_id": "", //optional
        "account_number": "", //optional field to set up recurring payments
        "phone_number": "+254333222111", //Either an email or a phone number is required. One must be provided
        "email_address": "john.doe@example.com", //Reqired if phone number is not provided
        "country_code": "KE", //Optional
        "first_name": "John", //Optional
        "middle_name": "", //Optional
        "last_name": "Doe", //Optional
        "line_1": "Nairobi", //Optional
        "line_2": "Crescent", //Optional
        "city": "Nairobi", //Optional
        "state": "", //Optional
        "postal_code": "12345", //Optional
        "zip_code": "" //Optional 
      },
    };
  },
  methods: {
    requestAccessToken() {
      const tokenRequest = {
        consumer_key: this.consumerKey,
        consumer_secret: this.consumerSecret
      };

      pesapalApiClient
        .post('/api/Auth/RequestToken', tokenRequest)
        .then((response) => {
          this.accessToken = response.data.token;
          this.notificationId ? this.getMerchantOrderURL() : this.generateNotificationId(this.IPNUrl);
        })
        .catch((error) => {
          console.error("Error getting access token: ", error);
        });
    },

    generateNotificationId(IPNUrl) {
      const postData = {
        url: IPNUrl,
        ipn_notification_type: "GET" //Can be a GET or a POST
      };
      const headers = {
        authorization: 'Bearer ' + this.accessToken,
      };

      pesapalApiClient
        .post('/api/URLSetup/RegisterIPN', postData, { headers })
        .then((response) => {
          this.notificationId = response.data.ipn_id;
          this.getMerchantOrderURL();
        })
        .catch((error) => {
          console.error("Error generating Notification ID: ", error);
        });
    },

    getMerchantOrderURL() {
      const postData = {
        language: "EN",
        currency: this.request.currency,
        amount: this.request.amount,
        id: this.request.merchant_reference,
        description: this.request.description,
        billing_address: {
          phone_number: this.request.phone_number,
          email_address: this.request.email_address,
          country_code: this.request.country_code,
          first_name: this.request.first_name,
          middle_name: this.request.middle_name,
          last_name: this.request.last_name,
          line_1: this.request.line_1,
          line_2: this.request.line_2,
          city: this.request.city,
          state: this.request.state,
          postal_code: this.request.postal_code,
          zip_code: this.request.zip_code
        },
        callback_url: this.request.callback_url ? this.request.callback_url : "",
        cancellation_url: this.request.cancellation_url,
        notification_id: this.notificationId,
        terms_and_conditions_id: ""
      };
      const headers = {
        authorization: 'Bearer ' + this.accessToken,
      };

      console.log('SAMPLE POST DATA', postData);

      pesapalApiClient
        .post('/api/Transactions/SubmitOrderRequest', postData, { headers })
        .then((response) => {
          // the response should include a redirect url/payment link. 
          // Load directly on your browser or as an iframe to complete your payment
          // in the response, you also receive orderTrackingId, orderMerchantReference & 200 status code 
          // you can proceed to persist data to your database for future reference
          console.log('SubmitOrderRequest Response', response.data);
        })
        .catch((error) => {
          console.error("Error requesting Merchant Order URL: ", error);
        });
    },

    getTransactionStatus() {
      const headers = {
        authorization: 'Bearer ' + this.accessToken,
      };

      pesapalApiClient
        .post(`/api/Transactions/GetTransactionStatus?orderTrackingId=${this.orderTrackingId}`, { headers })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error getting Transaction Status: ", error);
        });
    }
  },
  mounted() {
    //you can decide to call function on your form submit your own flexibilty
    this.requestAccessToken();
  }
};
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

