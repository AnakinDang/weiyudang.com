import assert from 'node:assert/strict';

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:3079');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'This check only runs against a local candidate.');
const read = (path, options = {}) => fetch(new URL(path, base), { redirect: 'manual', ...options });
const home = await read('/');
assert.equal(home.status, 200);
const html = await home.text();
assert.ok(html.includes('重塑世界的运行方式'));
assert.ok(html.includes('公司暂称'));
for (const old of ['Personal OS', 'Weiyu Dang', 'Doraemon', 'Owner Cockpit', '量子计算平台', '陕西', 'Fortune 500', '150M+']) assert.ok(!html.includes(old), `Unexpected old/unsupported content: ${old}`);
assert.match(html, /<html lang="zh-CN"/);
const canonical = html.match(/rel="canonical" href="([^"]+)"/);
assert.ok(canonical, "Missing canonical URL");
assert.equal(new URL(canonical[1]).href, "https://weiyudang.com/");
assert.ok(html.includes('mailto:dangweiyu0516@gmail.com'));
for (const label of ['企业 AI 平台', '智能体构建', '企业知识', '业务语义', '语音交互', '个性化服务', '专家经验采集', '持续评测与改进']) assert.ok(html.includes(label), `Missing capability: ${label}`);

const directions = [
  ['platform', '企业 AI 平台'], ['agents', '智能体构建'], ['knowledge', '企业知识'], ['semantics', '业务语义'],
  ['voice', '语音交互'], ['personalization', '个性化服务'], ['capture', '专家经验采集'], ['improvement', '持续评测与改进']
];
await Promise.all(directions.map(async ([slug, label]) => {
  const path = '/technology/' + slug;
  assert.ok(html.includes('href="' + path + '"'), 'Missing detail link: ' + label);
  const response = await read(path);
  assert.equal(response.status, 200, label + ' detail must be available');
  const body = await response.text();
  assert.ok(body.includes(label));
  assert.ok(body.includes('共同定义交付'));
  assert.ok(body.includes('项目评估后共同确定'));
  assert.ok((body.match(/<h2/g) ?? []).length >= 5, label + ' needs substantive sections');
  assert.ok(body.includes('href="https://weiyudang.com' + path + '"'), label + ' canonical mismatch');
  for (const term of ['陕西', 'Personal OS', '95%', '150M+', 'Fortune 500', 'Distillery', 'Context Mesh']) assert.ok(!body.includes(term), label + ' unexpected content: ' + term);
}));
assert.equal((await read('/technology/unknown-direction')).status, 404);

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
for (const path of ['/mobius', '/mobius-lab', '/company/mobius-particles.webp', '/company/mobius-cycle.webp', '/company/quantum-ribbon-v3.webp', '/company/knowledge-orbits-v3.webp', '/company/fonts/mobius-serif-sc-500.woff2', '/company/fonts/OFL.txt', '/icon.svg']) {
  assert.equal((await read(path)).status, 200, `${path} must remain available`);
}
const contact = await read('/contact');
assert.equal(contact.status, 308);
assert.equal(contact.headers.get('location'), '/#contact');
const sitemap = await read('/sitemap.xml');
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
assert.equal((xml.match(/<url>/g) ?? []).length, 9);
assert.ok(xml.includes('https://weiyudang.com/'));
for (const [slug] of directions) assert.ok(xml.includes('https://weiyudang.com/technology/' + slug));
const robots = await read('/robots.txt');
assert.equal(robots.status, 200);
assert.ok((await robots.text()).includes('https://weiyudang.com/sitemap.xml'));
assert.equal((await read('/missing-company-page')).status, 404);
console.log(`PASS: global vision, 8 detailed Chinese business pages, ${retired.length} retired paths, disabled login POSTs, prototypes, art/font assets, contact redirect and 9-page search metadata.`);
