/** Replace these public business details before using the site for a real shop.
 * Numbers must use international format. Never add secrets or customer data here.
 */
export const business = {
  name: 'FixLab',
  tagline: 'صيانة واضحة. جهاز يرجع يخدم.',
  city: 'YOUR_CITY',
  country: 'المغرب',
  whatsappNumber: 'YOUR_WHATSAPP_NUMBER',
  phoneNumber: 'YOUR_PHONE_NUMBER',
  address: 'YOUR_ADDRESS',
  openingHours: [
    { days: 'الإثنين – السبت', hours: '09:00 – 19:00' },
    { days: 'الأحد', hours: 'مغلق' },
  ],
  socialLinks: {
    instagram: 'YOUR_INSTAGRAM_URL',
    facebook: 'YOUR_FACEBOOK_URL',
  },
} as const
