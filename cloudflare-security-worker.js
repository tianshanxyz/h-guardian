// Cloudflare Worker for Security Headers
// Deploy this worker to add comprehensive security headers to all responses

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Fetch the original response
  const response = await fetch(request)
  
  // Create a new response with modified headers
  const newResponse = new Response(response.body, response)
  
  // Copy all original headers
  response.headers.forEach((value, key) => {
    newResponse.headers.set(key, value)
  })
  
  // Add Security Headers
  
  // 1. HTTP Strict Transport Security (HSTS)
  // Forces HTTPS connections for 1 year, includes subdomains, enables preload
  newResponse.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  
  // 2. Prevent MIME type sniffing
  // Prevents browsers from interpreting files as different MIME types
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  
  // 3. Clickjacking protection
  // Prevents page from being displayed in iframe
  newResponse.headers.set('X-Frame-Options', 'DENY')
  
  // 4. XSS Protection
  // Enables browser's built-in XSS filter
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')
  
  // 5. Referrer Policy
  // Controls how much referrer information is sent
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // 6. Permissions Policy (formerly Feature Policy)
  // Restricts which browser features can be used
  newResponse.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  )
  
  // 7. Content Security Policy (CSP)
  // Controls which resources can be loaded
  // Note: This should be tailored to your specific needs
  newResponse.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.emailjs.com https://www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://api.emailjs.com https://www.h-guardian.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  )
  
  // 8. Cache Control for sensitive pages
  // Prevents caching of HTML pages
  if (response.headers.get('Content-Type')?.includes('text/html')) {
    newResponse.headers.set(
      'Cache-Control',
      'public, max-age=3600, must-revalidate'
    )
  }
  
  // 9. Cross-Origin Policies
  newResponse.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  newResponse.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  
  // 10. Remove server version disclosure
  newResponse.headers.delete('Server')
  newResponse.headers.delete('X-Powered-By')
  
  return newResponse
}
