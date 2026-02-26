# Stripe Payment Integration

This document outlines the Stripe payment integration implemented in the NextRun application.

## Features Implemented

### 1. Database Schema Updates

- Added `stripeCredits` (integer, default 5) - tracks user's available credits
- Added `stripeCustomerId` (text, nullable) - Stripe customer ID
- Added `stripeCheckoutSessionId` (text, nullable) - last checkout session ID

### 2. User Actions (`src/actions/user.ts`)

- `getSessionUser()` - Enhanced to include Stripe data from database
- `updateUserStripeData()` - Updates user's Stripe information

### 3. Stripe Actions (`src/actions/stripe.ts`)

- `createPayment(priceId)` - Creates Stripe checkout session
- `listPricingProducts()` - Lists available pricing products
- `getCheckoutSession(sessionId)` - Retrieves checkout session details

### 4. Pages Created

- `/pricing` - Pricing page with product listing
- `/payment/success` - Payment success page
- `/payment/cancel` - Payment cancellation page
- Updated `/user` - Shows Stripe information and credits

### 5. API Routes

- `/api/payment/create` - Creates payment sessions
- `/api/webhooks/stripe` - Handles Stripe webhooks

### 6. Webhook Integration

- Handles `checkout.session.completed` events
- Automatically adds credits based on purchase
- Updates user's Stripe data

## Environment Variables Required

Add these to your `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Database Migration

Run the SQL migration to add Stripe fields:

```sql
-- See migrations/add-stripe-fields.sql
ALTER TABLE "user"
ADD COLUMN "stripeCredits" integer DEFAULT 5 NOT NULL,
ADD COLUMN "stripeCustomerId" text,
ADD COLUMN "stripeCheckoutSessionId" text;

UPDATE "user" SET "stripeCredits" = 5 WHERE "stripeCredits" IS NULL;
```

## Stripe Dashboard Setup

1. **Create Products and Prices** in Stripe Dashboard
2. **Set up Webhook** endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. **Configure Webhook Events**: `checkout.session.completed`
4. **Copy Webhook Secret** to `STRIPE_WEBHOOK_SECRET`

## Usage

### For Users

1. Sign in to the application
2. Visit `/pricing` to see available credit packages
3. Click "Purchase Credits" to start checkout
4. Complete payment on Stripe checkout page
5. Get redirected to success page with updated credits

### For Developers

1. Use `getSessionUser()` to get user with Stripe data
2. Use `createPayment(priceId)` to initiate payments
3. Use `updateUserStripeData()` to update user's Stripe information

## Credit System

- New users start with 5 credits
- Credits are added based on purchase amount
- Default: 1 credit per $1 spent
- Customizable in webhook handler based on price ID

## Security Notes

- Webhook signature verification implemented
- User authentication required for all payment operations
- Stripe customer creation on first purchase
- Session validation on success page

## Testing

1. Use Stripe test mode
2. Test with Stripe test cards
3. Verify webhook delivery in Stripe Dashboard
4. Check database updates after successful payments

## Next Steps

1. Set up Stripe products and prices
2. Configure webhook endpoint
3. Test payment flow
4. Customize credit amounts per product
5. Add more payment methods if needed
