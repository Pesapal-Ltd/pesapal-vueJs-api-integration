// once payment status changes on Pesapal, Pesapal automatically triggers an IPN with orderNotificationType, orderTrackingId and orderMerchantReference 
// passed as Get queries to this url. Use the ordertracking to check for the transaction status.
// The query parameters can also be passed as POST if your register your type as POST.