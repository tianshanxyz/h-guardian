// Cloudflare Worker for H-Guardian
// Handles root domain redirect and HTTPS enforcement

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 获取请求头信息
    const userAgent = request.headers.get('User-Agent') || '';
    
    // 1. 如果访问的是根域名 h-guardian.com，重定向到 www.h-guardian.com
    if (url.hostname === 'h-guardian.com') {
      url.hostname = 'www.h-guardian.com';
      url.protocol = 'https:';
      
      // 创建 301 永久重定向响应
      return new Response(null, {
        status: 301,
        headers: {
          'Location': url.toString(),
          'Cache-Control': 'public, max-age=86400',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        }
      });
    }
    
    // 2. 如果使用的是 HTTP，重定向到 HTTPS
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
    
    // 3. 添加安全响应头
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);
    
    // 安全头
    newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'DENY');
    newHeaders.set('X-XSS-Protection', '1; mode=block');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // 性能优化头
    newHeaders.set('Cache-Control', 'public, max-age=3600');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
