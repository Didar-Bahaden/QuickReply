import { Snippet, Category } from './types';

export const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 1,
    category: 'Shipping',
    title: 'Order Tracking Link',
    body: 'Hey {customer_name}! 📦 Your order #{order_number} is on its way. You can track its progress here: https://track.quickreply.io/{tracking_id}'
  },
  {
    id: 2,
    category: 'Shipping',
    title: 'International Shipping Policy',
    body: 'Yes, we ship globally to {country}! 🌍 International delivery usually takes between 7 to 14 business days depending on customs.'
  },
  {
    id: 3,
    category: 'Returns',
    title: '30-Day Policy Details',
    body: 'We offer a 30-day return policy! 🔄 Items must be in their original packaging. Start your return at returns.quickreply.io'
  },
  {
    id: 4,
    category: 'Returns',
    title: 'Damaged Items Procedure',
    body: 'I am so sorry to hear that, {customer_name}! 🥺 Please share your order number along with a photo of the damaged item so we can ship a replacement.'
  },
  {
    id: 5,
    category: 'Pricing',
    title: 'First Order Discount',
    body: 'Welcome aboard, {customer_name}! 🎉 You can use the promo code "{promo_code}" at checkout to get an extra 10% discount on your first purchase.'
  },
  {
    id: 6,
    category: 'Pricing',
    title: 'Bulk Pricing Inquiry',
    body: 'Thanks for reaching out! 💼 We offer discounts for wholesale orders of {minimum_quantity} units or more. Please email wholesale@quickreply.io'
  },
  {
    id: 7,
    category: 'General',
    title: 'name and place',
    body: 'hello {name} welcome to {Place}'
  },
  {
    id: 8,
    category: 'General',
    title: 'Variable Test',
    body: 'Hello {customer_name}, your order #{order_number} has been shipped!'
  },
  {
    id: 9,
    category: 'General',
    title: 'Closing Appreciation',
    body: 'Thank you for choosing us today, {customer_name}! 🙌 Let me know if you need help with anything else. Have a fantastic rest of your day!'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { name: 'Shipping', emoji: '📦' },
  { name: 'Returns', emoji: '🔄' },
  { name: 'Pricing', emoji: '💰' },
  { name: 'General', emoji: '💬' }
];
