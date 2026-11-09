import { NextResponse } from "next/server";

// Retire the complete former personal site, including deep links, login APIs
// and direct personal-artwork URLs. Source recovery is documented in README.
export function proxy() {
  return new NextResponse(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>页面已下线｜莫比乌斯</title><style>body{margin:0;background:#080b12;color:#f1f2f4;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}main{max-width:44rem;margin:16vh auto;padding:32px}h1{font-size:clamp(32px,6vw,48px);line-height:1.3}p{max-width:32rem;color:#a6aaba;font-size:18px;line-height:1.8}a{display:inline-block;margin-top:20px;padding:14px 22px;border-radius:3px;background:#b9d9f4;color:#080b12;text-decoration:none;font-size:18px}a:focus-visible{outline:3px solid #f1f2f4;outline-offset:6px}</style></head><body><main><h1>页面已下线。</h1><p>这个地址已停止提供内容。你可以前往莫比乌斯项目官网，了解我们的企业 AI 应用与交付服务。</p><a href="/">前往公司官网</a></main></body></html>`, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" }
  });
}

export const config = {
  matcher: ["/about/:path*", "/projects/:path*", "/journal/:path*", "/lab/:path*", "/dora/:path*", "/app/:path*", "/login/:path*", "/api/:path*", "/visuals/:path*"]
};
