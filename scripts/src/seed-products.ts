import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  try {
    const stripe = await getUncachableStripeClient();

    console.log('Creating AfroDeep Ent event ticket products in Stripe...');

    const existingStandard = await stripe.products.search({
      query: "name:'All White Boat Party - Standard Entry' AND active:'true'"
    });

    if (existingStandard.data.length === 0) {
      const standardProduct = await stripe.products.create({
        name: 'All White Boat Party - Standard Entry',
        description: 'General admission to the AfroDeep Ent All White Boat Party. 15th August 2025, Westminster Pier.',
        metadata: {
          event: 'all-white-boat-party',
          tier: 'standard',
          date: '2025-08-15',
        },
      });

      await stripe.prices.create({
        product: standardProduct.id,
        unit_amount: 3500,
        currency: 'gbp',
      });

      console.log(`Created Standard Entry product: ${standardProduct.id}`);
    } else {
      console.log('Standard Entry product already exists, skipping.');
    }

    const existingVip = await stripe.products.search({
      query: "name:'All White Boat Party - VIP Table for 3' AND active:'true'"
    });

    if (existingVip.data.length === 0) {
      const vipProduct = await stripe.products.create({
        name: 'All White Boat Party - VIP Table for 3',
        description: 'VIP Table for 3 people at the AfroDeep Ent All White Boat Party. Includes reserved seating, premium spirits & food platter.',
        metadata: {
          event: 'all-white-boat-party',
          tier: 'vip',
          date: '2025-08-15',
        },
      });

      await stripe.prices.create({
        product: vipProduct.id,
        unit_amount: 50000,
        currency: 'gbp',
      });

      console.log(`Created VIP Table product: ${vipProduct.id}`);
    } else {
      console.log('VIP Table product already exists, skipping.');
    }

    console.log('Done! Webhooks will sync products to the database automatically.');
  } catch (error: any) {
    console.error('Error creating products:', error.message);
    process.exit(1);
  }
}

createProducts();
