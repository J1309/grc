export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || 'https://accounts.grocerycart.com.au',
      applicationID: 'convex',
    },
  ],
}
