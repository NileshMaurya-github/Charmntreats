# Razorpay Integration Summary

## Overview
Integrated Razorpay payment gateway into the checkout flow, replacing the dummy "UPI" payment method with a fully functional Razorpay checkout modal.

## Changes Implemented

### 1. New Hook: `src/hooks/useRazorpay.ts`
- Created a custom hook to dynamically load the Razorpay SDK script (`https://checkout.razorpay.com/v1/checkout.js`).
- Manages the loading state (`isLoaded`) and provides a helper function `displayRazorpay` to open the payment modal.

### 2. Updated Checkout Page: `src/pages/Checkout.tsx`
- **Integration**: Imported `useRazorpay` and integrated it into the `handlePlaceOrder` function.
- **Logic**:
  - When "Online Payment" is selected, it now triggers the Razorpay modal instead of a dummy timeout.
  - Uses `VITE_RAZORPAY_KEY_ID` from environment variables.
  - Passes customer details (name, email, phone) to prefill the Razorpay form.
  - On successful payment (`handler` callback), it proceeds to create the order in Supabase with `paymentMethod: 'online'` and the `razorpay_payment_id`.
- **UI Updates**:
  - Renamed "UPI Payment" to "Online Payment" to reflect that Razorpay supports Cards, Netbanking, Wallets, etc.
  - Updated the confirmation screen to show "Online Payment" instead of "UPI Payment".

## Configuration
- The integration uses the `VITE_RAZORPAY_KEY_ID` environment variable which was already present in `.env`.
- It uses a client-side integration flow (Standard Integration) suitable for the current architecture.

## Testing
- **COD**: Remains unchanged (simulated delay).
- **Online Payment**:
  - Checks if SDK is loaded.
  - Opens Razorpay modal with correct amount and customer details.
  - On success, creates order and redirects to confirmation.
