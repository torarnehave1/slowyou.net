
Konto: slowyou.net@gmail.com
+4790914095

https://dashboard.clicksend.com/profile


from __future__ import print_function
import clicksend_client
from clicksend_client.rest import ApiException

# Configure HTTP basic authorization: BasicAuth
configuration = clicksend_client.Configuration()
configuration.username = 'USERNAME'
configuration.password = 'API_KEY'

# create an instance of the API class
api_instance = clicksend_client.AccountApi(clicksend_client.ApiClient(configuration))

try:
    # Get account information
    api_response = api_instance.account_get()
    print(api_response)
except ApiException as e:
    print("Exception when calling AccountApi->account_get: %s\n" % e)

    Response

{
  "http_code": 200,
  "response_code": "SUCCESS",
  "response_msg": "Here's your account",
  "data": {
    "user_id": 3819,
    "username": "ULXHP",
    "user_email": "PNUMB@VAPXX.com",
    "active": 1,
    "banned": 0,
    "balance": "1117.461060",
    "user_phone": "+61433333888",
    "user_first_name": "fffff",
    "user_last_name": "llll",
    "account": 0,
    "account_name": "FTHCQ~!@#$ %^&*()XQMPO",
    "account_billing_email": "XDVXC@SJRJU.com",
    "account_billing_mobile": "+61433333888",
    "country": "AU",
    "default_country_sms": "AU",
    "auto_recharge": 0,
    "auto_recharge_amount": "20.00",
    "low_credit_amount": "0.00",
    "setting_unicode_sms": 0,
    "setting_email_sms_subject": 0,
    "setting_fix_sender_id": 0,
    "setting_sms_message_char_limit": 8,
    "old_dashboard": 0,
    "balance_commission": "2.330130",
    "timezone": "Australia/Melbourne",
    "private_uploads": 0,
    "fax_quality": 0,
    "setting_sms_hide_your_number": 0,
    "setting_sms_hide_business_name": 1,
    "_currency": {
      "currency_name_short": "AUD",
      "currency_prefix_d": "$",
      "currency_prefix_c": "c",
      "currency_name_long": "Australian Dollars"
    },
    "_subaccount": {
      "subaccount_id": 1716,
      "api_username": "KCIHOYEYGM",
      "email": "ICMGR@VBSPT.com",
      "phone_number": "+61433333333",
      "first_name": "Firstname40710",
      "last_name": "Lastname3672",
      "api_key": "IJVEGTCF-VOHU-GSVF-KNKK-XHTARJXMQTXK",
      "access_users": 1,
      "access_billing": 1,
      "access_reporting": 1,
      "access_contacts": 0,
      "access_settings": 1,
      "access_sms": 0,
      "access_email": 0,
      "access_voice": 0,
      "access_fax": 0,
      "access_post": 0,
      "access_reseller": 0,
      "access_mms": 1,
      "share_campaigns": 1,
      "notes": null
    }
  }
}

GET https://rest.clicksend.com/v3/account

Get account information

Get account details

Refer to Status Codes for definitions of HTTP status code responses.
This endpoint requires authentication, more info...
View Account Usage