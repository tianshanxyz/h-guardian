// Cloudflare Pages Functions Middleware
// 处理根域名重定向到 www，解决访问慢问题

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 1. 根域名立即重定向到 www（最高优先级）
  if (url.hostname === 'h-guardian.com') {
    url.hostname = 'www.h-guardian.com';
    url.protocol = 'https:';
    
    return new Response(null, {
      status: 301,
      headers: {
        'Location': url.toString(),
        'Cache-Control': 'public, max-age=86400',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      }
    });
  }
  
  // 2. HTTP 重定向到 HTTPS
  if (url.protocol === 'http:' && url.hostname === 'www.h-guardian.com') {
    url.protocol = 'https:';
    
    return new Response(null, {
      status: 301,
      headers: {
        'Location': url.toString(),
        'Cache-Control': 'public, max-age=86400',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      }
    });
  }
  
  // 继续处理其他请求
  const response = await context.next();
  
  // 添加安全响应头
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('X-XSS-Protection', '1; mode=block');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
