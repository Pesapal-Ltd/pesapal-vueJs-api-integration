import axios from 'axios';

const pesapalApiClient = axios.create({
  baseURL: 'https://cybqa.pesapal.com/pesapalv3', // Demo -- https://pay.pesapal.com/v3 --Live
  headers: {
    'Accept': 'text/plain',
    'Content-Type': 'application/json',
  },
});

export default pesapalApiClient;
