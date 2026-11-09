import assert from 'node:assert/strict';

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:3079');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'This check only runs against a local candidate.');
const read = (path, options = {}) => fetch(new URL(path, base), { redirect: 'manual', ...options });
const home = await read('/');
assert.equal(home.status, 200);
const html = await home.text();
assert.ok(html.includes('让 AI 成为'));
assert.ok(html.includes('公司暂称'));
for (const old of ['Personal OS', 'Weiyu Dang', 'Doraemon', 'Owner Cockpit', '量子计算平台']) assert.ok(!html.includes(old), `Unexpected old/unsupported content: ${old}`);
assert.match(html, /<html lang="zh-CN"/);
const canonical = html.match(/rel="canonical" href="([^"]+)"/);
assert.ok(canonical, "Missing canonical URL");
assert.equal(new URL(canonical[1]).href, "https://weiyudang.com/");
assert.ok(html.includes('mailto:dangweiyu0516@gmail.com'));
for (const label of ['企业 AI 平台', '智能体构建', '企业知识', '业务语义', '语音交互', '个性化服务', '专家经验采集', '持续评测与改进']) assert.ok(html.includes(label), `Missing capability: ${label}`);

const retired = ['/about', '/projects', '/projects/doraemon-agent-system', '/journal/photography-walks', '/lab/example', '/dora', '/dora/office', '/dora/team/example', '/dora/knowledge', '/app', '/app/settings', '/app/trading', '/login', '/api/login', '/api/logout', '/visuals/personal-os-portal-v2.png'];
await Promise.all(retired.map(async (path) => {
  const response = await read(path);
  assert.equal(response.status, 410, `${path} must be retired`);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  const body = await response.text();
  assert.ok(body.includes('页面已下线'));
  assert.ok(!body.includes('APP_ACCESS_TOKEN'));
}));
for (const path of ['/api/login', '/api/logout']) {
  const response = await read(path, { method: 'POST', body: '' });
  assert.equal(response.status, 410, `${path} POST must be disabled`);
}
for (const path of ['/mobius', '/mobius-lab', '/company/mobius-particles.webp', '/company/mobius-cycle.webp', '/icon.svg']) {
  assert.equal((await read(path)).status, 200, `${path} must remain available`);
}
const contact = await read('/contact');
assert.equal(contact.status, 308);
assert.equal(contact.headers.get('location'), '/#contact');
const sitemap = await read('/sitemap.xml');
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
assert.equal((xml.match(/<url>/g) ?? []).length, 1);
assert.ok(xml.includes('https://weiyudang.com/'));
const robots = await read('/robots.txt');
assert.equal(robots.status, 200);
assert.ok((await robots.text()).includes('https://weiyudang.com/sitemap.xml'));
assert.equal((await read('/missing-company-page')).status, 404);
console.log(`PASS: company content, 8 capability directions, ${retired.length} retired paths, disabled login POSTs, prototypes, assets, contact redirect and search metadata.`);
