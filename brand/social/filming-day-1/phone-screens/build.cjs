// Phone screens for filming day 1: full-screen PNGs styled like the DriveSchoolPro app,
// shown on a phone (Photos app, full screen) in close-ups where the real app isn't needed.
// Fictional demo data only: Ace Driving School, instructor John, pupil Emily Thompson.
//
// Run: PLAYWRIGHT=/Users/john/Projects-code/driveschoolpro/node_modules/playwright \
//        node brand/social/filming-day-1/phone-screens/build.cjs
// Output: png/<id>.png at 1179x2556 (iPhone 15/16 size; fine on any modern phone).

const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const OUT = path.join(__dirname, 'png');
const FONTS = path.resolve(__dirname, '../../../fonts');
const RED = '#E5383B';

const icon = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  today: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  home: '<path d="m12 14 4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
  lessons: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  book: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/>',
  messages: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  sparkles: '<path d="M9.9 15.5A2 2 0 0 0 8.5 14.1L2.4 12.5a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 10 16 6H8l-2.4 4-2.1 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  pound: '<path d="M18 7c0-5.3-8-5.3-8 0v10M6 13h8M6 21h12"/>',
};
const svg = (name, size = 22, color = 'currentColor', sw = 2) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${icon[name]}</svg>`;

const statusBar = (time, dark = false) => `
<div class="status ${dark ? 'dark' : ''}">
  <span class="time">${time}</span>
  <span class="right">
    <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
    <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.2 6.7a6.8 6.8 0 0 1 9.6 0l-1.4 1.4a4.8 4.8 0 0 0-6.8 0zM.8 4.3a10.2 10.2 0 0 1 14.4 0l-1.4 1.4a8.2 8.2 0 0 0-11.6 0z"/></svg>
    <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="9" rx="2"/><rect x="24.5" y="4.5" width="1.5" height="4" rx=".75" opacity=".4"/></svg>
  </span>
</div>`;

const staffHeader = (title, back = false) => `
<div class="appbar">
  <span class="l">${back ? svg('back', 22) + '<span class="backtxt">Back</span>' : svg('menu', 24)}</span>
  <span class="c">${title || ''}</span>
  <span class="r">${svg('bell', 22)}<span class="avatar">JP</span></span>
</div>`;
const pupilHeader = () => `
<div class="appbar">
  <span class="l">${svg('back', 22)}<span class="backtxt">Back</span></span>
  <span class="c">Ace Driving School</span>
  <span class="r"><span class="avatar">ET</span></span>
</div>`;
const tabs = (items, active) => `
<div class="tabs">${items
  .map(([ic, label]) => `<div class="tab ${label === active ? 'on' : ''}">${svg(ic, 26, 'currentColor', 1.8)}<span>${label}</span></div>`)
  .join('')}</div>`;
const staffTabs = (a) => tabs([['today', 'Today'], ['calendar', 'Calendar'], ['users', 'Students'], ['wallet', 'Money']], a);
const pupilTabs = (a) => tabs([['home', 'Home'], ['lessons', 'Lessons'], ['book', 'Book'], ['messages', 'Messages']], a);
const toast = (text) => `<div class="toast">${svg('check', 22, '#fff')}<span>${text}</span></div>`;

const css = `
@font-face{font-family:Inter;src:url(file://${FONTS}/Inter[opsz,wght].ttf);font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:393px;height:852px;overflow:hidden}
body{font-family:Inter,sans-serif;background:#F6F7F9;color:#111827;-webkit-font-smoothing:antialiased;position:relative}
.status{height:54px;display:flex;justify-content:space-between;align-items:center;padding:14px 30px 0 36px;font-weight:600;font-size:17px;background:#fff}
.status .right{display:flex;gap:6px;align-items:center}.status svg{fill:currentColor}
.status.dark{background:transparent;color:#fff}
.appbar{height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:#fff;border-bottom:1px solid #E5E7EB}
.appbar .l,.appbar .r{display:flex;align-items:center;gap:14px;min-width:90px}.appbar .r{justify-content:flex-end}
.appbar .c{font-weight:600;font-size:16px}.backtxt{font-size:16px;margin-left:-8px}
.avatar{width:38px;height:38px;border-radius:50%;background:${RED};color:#fff;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center}
.tabs{position:absolute;left:0;right:0;bottom:0;height:84px;background:#fff;border-top:1px solid #E5E7EB;display:flex;padding-top:8px}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:#374151}.tab.on{color:${RED}}
.page{padding:16px}
h1{font-size:28px;font-weight:700;letter-spacing:-.02em}
.sub{color:#6B7280;font-size:15px;margin-top:4px}
.card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px;margin-top:14px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6B7280;font-weight:600}
.row{display:flex;justify-content:space-between;align-items:center}
.muted{color:#6B7280}.small{font-size:13px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;height:50px;border-radius:12px;font-weight:600;font-size:16px}
.btn.red{background:${RED};color:#fff}.btn.out{border:1px solid #D1D5DB;background:#fff}.btn.black{background:#000;color:#fff}
.badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600}
.b-green{background:#DCFCE7;color:#15803D}.b-blue{background:#DBEAFE;color:#1D4ED8}.b-amber{background:#FEF3C7;color:#B45309}.b-red{background:#FEE2E2;color:#B91C1C}.b-grey{background:#F3F4F6;color:#374151}
.toast{position:absolute;left:14px;right:14px;bottom:100px;background:#1F2937;color:#fff;border-radius:14px;padding:16px 18px;display:flex;gap:12px;align-items:center;font-size:15px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.lesson{border-left:4px solid ${RED};padding-left:12px}
.big{font-size:40px;font-weight:700;letter-spacing:-.02em}
.bar{height:10px;border-radius:99px;background:#E5E7EB;overflow:hidden}.bar i{display:block;height:100%;background:#F5B700;border-radius:99px}
.skill{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid #F3F4F6;font-size:15px}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:10px}
.field{border:1px solid #D1D5DB;border-radius:10px;height:48px;display:flex;align-items:center;padding:0 14px;font-size:16px;margin-top:6px;background:#fff}
.flabel{font-size:14px;font-weight:600;margin-top:14px}
`;

const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;

// ---------- screens ----------
const S = {};

S['01a-instructor-invoice'] = page(`${statusBar('16:58')}${staffHeader('', true)}
<div class="page">
  <div class="row" style="justify-content:flex-start;gap:10px"><h1>INV-0012</h1><span class="badge b-amber">Sent</span></div>
  <div class="sub">Lesson · Tue 20 Oct, 16:00 · 1 hour</div>
  <div style="display:flex;gap:10px;margin-top:16px">
    <div class="btn red" style="flex:1.2">${svg('pound', 20, '#fff')} Request Payment</div>
    <div class="btn out" style="flex:1">Record Payment</div>
  </div>
  <div class="card"><div class="label">Bill to</div>
    <div style="font-size:19px;font-weight:600;margin-top:8px">Emily Thompson</div>
    <div class="muted" style="margin-top:4px">emily.thompson@example.com</div>
    <div class="row" style="margin-top:18px"><span class="muted">Driving lesson (60 min)</span><span>£38.00</span></div>
    <div class="row" style="margin-top:12px;padding-top:12px;border-top:1px solid #E5E7EB;font-weight:700;font-size:18px"><span>Total due</span><span>£38.00</span></div>
  </div>
  <div class="card small muted">Emily gets a pay link by email. Card payments go straight to your bank through Stripe.</div>
</div>${staffTabs('Money')}`);

S['01b-pupil-pay'] = page(`${statusBar('16:59')}
<div style="background:#fff;height:798px;padding:28px 22px">
  <div class="row" style="justify-content:flex-start;gap:12px"><span class="avatar" style="width:44px;height:44px">A</span><div><div style="font-weight:600;font-size:17px">Ace Driving School</div><div class="muted small">Invoice INV-0012</div></div></div>
  <div class="muted" style="margin-top:34px">Pay Ace Driving School</div>
  <div style="font-size:46px;font-weight:700;letter-spacing:-.02em;margin-top:4px">£38.00</div>
  <div class="muted" style="margin-top:6px">Driving lesson · Tue 20 Oct, 16:00</div>
  <div class="btn black" style="margin-top:34px;height:54px;font-size:18px">Pay with phone wallet</div>
  <div class="row muted small" style="margin:22px 0"><span style="flex:1;height:1px;background:#E5E7EB"></span><span style="padding:0 12px">Or pay with card</span><span style="flex:1;height:1px;background:#E5E7EB"></span></div>
  <div class="flabel">Card number</div><div class="field muted">1234 1234 1234 1234</div>
  <div style="display:flex;gap:10px"><div style="flex:1"><div class="flabel">Expiry</div><div class="field muted">MM / YY</div></div><div style="flex:1"><div class="flabel">CVC</div><div class="field muted">CVC</div></div></div>
  <div class="btn red" style="margin-top:26px;height:54px;font-size:18px">Pay £38.00</div>
  <div class="row muted small" style="justify-content:center;gap:6px;margin-top:18px">${svg('lock', 14)} Secure payment powered by Stripe</div>
</div>`);

S['01c-pupil-paid'] = page(`${statusBar('16:59')}
<div style="background:#fff;height:798px;padding:120px 26px 0;text-align:center">
  <div style="display:inline-flex;width:96px;height:96px;border-radius:50%;background:#DCFCE7;align-items:center;justify-content:center">${svg('check', 56, '#16A34A', 2)}</div>
  <div style="font-size:30px;font-weight:700;margin-top:26px">Payment successful</div>
  <div class="muted" style="font-size:17px;margin-top:10px">£38.00 paid to Ace Driving School</div>
  <div class="card" style="text-align:left;margin-top:34px">
    <div class="row"><span class="muted">Lesson</span><span>Tue 20 Oct, 16:00</span></div>
    <div class="row" style="margin-top:10px"><span class="muted">Invoice</span><span>INV-0012</span></div>
    <div class="row" style="margin-top:10px"><span class="muted">Receipt</span><span>Sent to your email</span></div>
  </div>
</div>`);

S['01d-instructor-paid'] = page(`${statusBar('17:00')}${staffHeader('', true)}
<div class="page">
  <div class="row" style="justify-content:flex-start;gap:10px"><h1>INV-0012</h1><span class="badge b-green">Paid</span></div>
  <div class="sub">Lesson · Tue 20 Oct, 16:00 · 1 hour</div>
  <div class="card"><div class="label">Bill to</div>
    <div style="font-size:19px;font-weight:600;margin-top:8px">Emily Thompson</div>
    <div class="row" style="margin-top:18px"><span class="muted">Driving lesson (60 min)</span><span>£38.00</span></div>
    <div class="row" style="margin-top:12px;padding-top:12px;border-top:1px solid #E5E7EB;font-weight:700;font-size:18px"><span>Balance</span><span style="color:#15803D">£0.00</span></div>
  </div>
  <div class="card"><div class="label">Payments</div>
    <div class="row" style="margin-top:12px"><span>Card · 20 Oct, 16:59</span><span style="font-weight:600">£38.00</span></div>
  </div>
</div>${toast('Payment received: £38.00 from Emily')}${staffTabs('Money')}`);

S['02a-pupil-packages'] = page(`${statusBar('20:41')}${pupilHeader()}
<div class="page">
  <h1>Lesson blocks</h1><div class="sub">Buy hours in advance and they come off each lesson.</div>
  ${[['10 hour block', '£350', 'Save £30'], ['5 hour block', '£180', 'Save £10'], ['2 hour mock test', '£76', '']]
    .map(([n, p, s]) => `<div class="card"><div class="row"><div><div style="font-weight:600;font-size:18px">${n}</div><div class="muted small" style="margin-top:4px">${s || 'Includes test route practice'}</div></div><div style="font-size:22px;font-weight:700">${p}</div></div><div class="btn red" style="margin-top:14px;height:46px">Buy</div></div>`)
    .join('')}
</div>${pupilTabs('Home')}`);

S['02b-pupil-package-active'] = page(`${statusBar('20:42')}${pupilHeader()}
<div class="page">
  <div class="card" style="background:#F0FDF4;border-color:#BBF7D0;margin-top:0"><div class="row" style="justify-content:flex-start;gap:10px;color:#15803D;font-weight:600">${svg('check', 22, '#16A34A')} Paid £350.00. Thank you!</div></div>
  <h1 style="margin-top:20px">My packages</h1>
  <div class="card"><div class="row"><div style="font-weight:600;font-size:18px">10 hour block</div><span class="badge b-green">Active</span></div>
    <div class="row" style="margin-top:16px"><span class="muted">Hours left</span><span style="font-weight:700;font-size:20px">10h / 10h</span></div>
    <div class="bar" style="margin-top:10px"><i style="width:100%;background:#2563EB"></i></div>
    <div class="muted small" style="margin-top:10px">Comes off each lesson automatically</div>
  </div>
</div>${pupilTabs('Home')}`);

S['03a-pupil-book-slot'] = page(`${statusBar('23:04')}${pupilHeader()}
<div class="page">
  <h1>Book a lesson</h1><div class="sub">with John · 1 hour · £38</div>
  <div class="row" style="margin-top:18px;gap:8px">${[['Tue', '20'], ['Wed', '21'], ['Thu', '22'], ['Fri', '23'], ['Sat', '24']]
    .map(([d, n]) => `<div style="flex:1;text-align:center;padding:10px 0;border-radius:12px;${n === '22' ? `background:${RED};color:#fff` : 'background:#fff;border:1px solid #E5E7EB'}"><div class="small">${d}</div><div style="font-weight:700;font-size:20px">${n}</div></div>`)
    .join('')}</div>
  <div class="label" style="margin-top:22px">Available on Thursday</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">${['09:00', '11:00', '13:30', '16:00', '17:00', '18:00']
    .map((t) => `<div class="btn ${t === '16:00' ? 'red' : 'out'}" style="height:52px">${t}</div>`)
    .join('')}</div>
  <div class="card"><div class="row"><span class="muted">Pickup</span><span>Home</span></div><div class="row" style="margin-top:8px"><span class="muted">Pay</span><span>From my 10 hour block</span></div></div>
  <div class="btn red" style="margin-top:18px;height:54px">Confirm booking · Thu 22 Oct, 16:00</div>
</div>${pupilTabs('Book')}`);

S['03b-pupil-booked'] = page(`${statusBar('23:05')}${pupilHeader()}
<div class="page" style="text-align:center;padding-top:80px">
  <div style="display:inline-flex;width:90px;height:90px;border-radius:50%;background:#DCFCE7;align-items:center;justify-content:center">${svg('check', 52, '#16A34A')}</div>
  <div style="font-size:28px;font-weight:700;margin-top:22px">You're booked in</div>
  <div class="muted" style="font-size:17px;margin-top:8px">Thursday 22 October, 16:00–17:00</div>
  <div class="card" style="text-align:left;margin-top:28px"><div class="row"><span class="muted">Instructor</span><span>John</span></div><div class="row" style="margin-top:10px"><span class="muted">Pickup</span><span>Home</span></div><div class="row" style="margin-top:10px"><span class="muted">Reminder</span><span>By email before the lesson</span></div></div>
</div>${pupilTabs('Book')}`);

const todayLesson = (time, name, note, badge) => `<div class="card lesson" style="border-left-color:${RED}">
  <div class="row"><span style="font-weight:700;font-size:20px">${time}</span>${badge || ''}</div>
  <div style="font-weight:600;font-size:17px;margin-top:6px">${name}</div>
  <div class="muted small" style="margin-top:4px;display:flex;gap:6px;align-items:center">${svg('pin', 14)} ${note}</div></div>`;

S['03c-instructor-today'] = page(`${statusBar('07:32')}${staffHeader('')}
<div class="page">
  <h1>Good morning, John</h1><div class="sub">Thursday 22 October · 5 lessons</div>
  ${todayLesson('09:00', 'Oliver Bennett', 'Pickup: Hill Street', '<span class="badge b-green">Confirmed</span>')}
  ${todayLesson('11:00', 'Sophie Ahmed', 'Pickup: college', '<span class="badge b-green">Confirmed</span>')}
  ${todayLesson('13:30', 'Harry Williams', 'Test route practice', '<span class="badge b-amber">Awaiting confirmation</span>')}
  ${todayLesson('16:00', 'Emily Thompson', 'Pickup: home', '<span class="badge b-blue">Booked online 23:04</span>')}
  ${todayLesson('18:00', 'Jack Patel', 'Pickup: Station Road', '<span class="badge b-green">Confirmed</span>')}
</div>${staffTabs('Today')}`);

S['04a-messages-move'] = page(`${statusBar('12:17')}
<div style="background:#fff;height:798px">
  <div style="text-align:center;padding:10px 0 14px;border-bottom:1px solid #E5E7EB"><span class="avatar" style="display:inline-flex;width:46px;height:46px;background:#9CA3AF">ET</span><div class="small" style="margin-top:6px;font-weight:600">Emily (pupil)</div></div>
  <div style="padding:18px 14px;display:flex;flex-direction:column;gap:10px;font-size:17px">
    <div class="muted small" style="text-align:center">Today 12:16</div>
    <div style="align-self:flex-start;background:#E9E9EB;padding:11px 15px;border-radius:20px;max-width:78%">Hi John! So sorry, can we move Thursday? I've got a shift at work</div>
    <div style="align-self:flex-start;background:#E9E9EB;padding:11px 15px;border-radius:20px;max-width:78%">Friday any time after 3 would be perfect</div>
  </div>
</div>`);

S['04b-instructor-calendar-moved'] = page(`${statusBar('12:18')}${staffHeader('')}
<div class="page">
  <h1>Calendar</h1>
  <div class="row" style="margin-top:12px;gap:8px">${[['Mon', '19'], ['Tue', '20'], ['Wed', '21'], ['Thu', '22'], ['Fri', '23']]
    .map(([d, n]) => `<div style="flex:1;text-align:center;padding:9px 0;border-radius:12px;${n === '23' ? `background:${RED};color:#fff` : 'background:#fff;border:1px solid #E5E7EB'}"><div class="small">${d}</div><div style="font-weight:700;font-size:19px">${n}</div></div>`)
    .join('')}</div>
  ${['14:00', '15:00'].map((t) => `<div class="card row" style="padding:14px 16px"><span>${t}</span><span class="muted small">+ book</span></div>`).join('')}
  <div class="card lesson" style="border-left-color:${RED}"><div class="row"><span style="font-weight:700;font-size:20px">16:00 – 17:00</span><span class="badge b-blue">Moved from Thu</span></div>
    <div style="font-weight:600;font-size:17px;margin-top:6px">Emily Thompson</div><div class="muted small" style="margin-top:4px">Pickup: home · Ford Fiesta</div></div>
  ${['17:00', '18:00'].map((t) => `<div class="card row" style="padding:14px 16px"><span>${t}</span><span class="muted small">+ book</span></div>`).join('')}
</div>${toast('Lesson rescheduled')}${staffTabs('Calendar')}`);

S['05a-email-reminder'] = page(`${statusBar('18:30')}
<div style="background:#fff;height:798px">
  <div style="padding:10px 18px 14px;border-bottom:1px solid #E5E7EB"><div style="font-weight:700;font-size:20px">Your driving lesson is tomorrow</div>
    <div class="row" style="margin-top:12px;justify-content:flex-start;gap:10px"><span class="avatar" style="width:36px;height:36px;font-size:13px">A</span><div><div style="font-weight:600;font-size:15px">Ace Driving School</div><div class="muted small">to Emily · 18:30</div></div></div></div>
  <div style="padding:22px 20px;font-size:16px;line-height:1.5">
    <p>Hi Emily,</p><p style="margin-top:12px">Just a reminder about your lesson:</p>
    <div class="card" style="margin-top:14px"><div style="font-weight:700;font-size:18px">Thursday 22 October</div><div style="margin-top:4px">16:00 – 17:00 with John</div><div class="muted small" style="margin-top:4px">Pickup: home</div></div>
    <p style="margin-top:18px">Please confirm you can make it:</p>
    <div class="btn red" style="margin-top:12px;height:54px;font-size:17px">Confirm lesson</div>
    <p class="muted small" style="margin-top:18px">Can't make it? Reply to this email or message John.</p>
  </div>
</div>`);

S['05b-lesson-confirmed'] = page(`${statusBar('18:31')}
<div style="background:#fff;height:798px;padding:130px 26px 0;text-align:center">
  <div style="display:inline-flex;width:96px;height:96px;border-radius:50%;background:#DCFCE7;align-items:center;justify-content:center">${svg('check', 56, '#16A34A')}</div>
  <div style="font-size:30px;font-weight:700;margin-top:26px">Lesson Confirmed!</div>
  <div class="muted" style="font-size:17px;margin-top:10px">Thanks Emily. See you on Thursday 22 October at 16:00.</div>
</div>`);

const sk = (name, level) => {
  const c = { Independent: ['b-green', '#16A34A'], Prompted: ['b-amber', '#F59E0B'], Helped: ['b-red', '#DC2626'], Introduced: ['b-grey', '#9CA3AF'] }[level];
  return `<div class="skill"><span><span class="dot" style="background:${c[1]}"></span>${name}</span><span class="badge ${c[0]}">${level}</span></div>`;
};

S['06a-instructor-rate-skills'] = page(`${statusBar('17:01')}${staffHeader('Record lesson', true)}
<div class="page">
  <div class="row"><div><div style="font-weight:700;font-size:20px">Emily Thompson</div><div class="muted small">Today 16:00 · 60 min</div></div><span class="badge b-green">Completed</span></div>
  <div class="card"><div class="label">Skills covered today</div>
    ${sk('Roundabouts', 'Prompted')}${sk('Meeting oncoming traffic', 'Independent')}${sk('Parallel parking', 'Prompted')}${sk('Use of mirrors', 'Independent')}${sk('Dual carriageways', 'Introduced')}
  </div>
  <div class="flabel">Note for next time</div>
  <div class="field" style="height:74px;align-items:flex-start;padding-top:12px;font-size:15px">Roundabouts much better. Try the dual carriageway next week.</div>
  <div class="btn red" style="margin-top:16px;height:54px">Save lesson</div>
</div>${staffTabs('Calendar')}`);

S['07a-pupil-progress'] = page(`${statusBar('17:05')}${pupilHeader()}
<div class="page">
  <div class="card" style="margin-top:0"><div class="label">Test readiness</div><div class="big" style="margin-top:6px">67%</div>
    <div class="muted small">Average level 3.3 of 5 · 15 of 27 at Level 4+</div><div class="bar" style="margin-top:12px"><i style="width:67%"></i></div></div>
  ${[['The Basics', 'All 4 skills at Reflection: brilliant!', '4/4', true], ['Control and Positioning', 'All 3 skills at Independent or above', '3/3', true], ['Junctions, Roundabouts and Crossings', '2 of 3 at Independent', '2/3', false], ['Manoeuvres', 'Keep practising', '1/4', false]]
    .map(([n, s, x, done]) => `<div class="card" style="${done ? 'background:#F0FDF4;border-color:#BBF7D0' : ''}"><div class="row"><div><div style="font-weight:600;font-size:16px;color:${done ? '#166534' : '#111827'}">${n}</div><div class="small" style="margin-top:4px;color:${done ? '#15803D' : '#6B7280'}">${s}</div></div><span style="font-weight:600">${x}</span></div></div>`)
    .join('')}
</div>${pupilTabs('Home')}`);

S['08a-instructor-briefing'] = page(`${statusBar('15:52')}${staffHeader('', true)}
<div class="page">
  <div style="font-weight:700;font-size:20px">Emily Thompson · 16:00</div><div class="muted small">Pickup: home · Ford Fiesta</div>
  <div class="card" style="background:#EFF6FF;border-color:#BFDBFE;font-size:15.5px;line-height:1.5">
    <div class="row" style="justify-content:flex-start;gap:8px;color:#1D4ED8;font-weight:600;font-size:17px">${svg('sparkles', 20, '#1D4ED8')} Lesson briefing</div>
    <div style="color:#1D4ED8;font-weight:700;font-size:13px;letter-spacing:.06em;margin-top:12px">WHERE EMILY IS</div>
    <p style="margin-top:4px">About two thirds of the way there. Junctions and town driving are now independent. Roundabouts improved last week but still need prompting on lane choice.</p>
    <div style="color:#1D4ED8;font-weight:700;font-size:13px;letter-spacing:.06em;margin-top:12px">TODAY'S LESSON</div>
    <p style="margin-top:4px">Start with a quick recap of the big roundabout, then take her onto the dual carriageway for the first time. Keep the pace calm and let her plan ahead on the slip roads.</p>
    <div class="muted small" style="margin-top:12px">From 6 recorded lessons · updated today</div>
  </div>
</div>${staffTabs('Today')}`);

S['09a-instructor-clash'] = page(`${statusBar('19:12')}${staffHeader('New lesson', true)}
<div class="page">
  <div class="flabel" style="margin-top:0">Pupil</div><div class="field">Emily Thompson</div>
  <div class="flabel">Date</div><div class="field">Thursday 22 October</div>
  <div class="flabel">Time</div><div class="field" style="border-color:${RED}">16:00 – 17:00</div>
  <div class="flabel">Car</div><div class="field">${svg('car', 18)}&nbsp; Ford Fiesta</div>
  <div class="card" style="background:#FEF2F2;border-color:#FECACA;color:#991B1B"><div class="row" style="justify-content:flex-start;gap:10px;font-weight:700">${svg('alert', 22, '#DC2626')} Clash: you already have a lesson</div>
    <div style="margin-top:8px;font-size:15px">Harry Williams is booked 15:30 – 16:30 in the Ford Fiesta. Pick another time.</div></div>
  <div class="label" style="margin-top:18px">Free times on Thursday</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px">${['13:30', '17:00', '18:00'].map((t) => `<div class="btn out" style="height:48px">${t}</div>`).join('')}</div>
</div>${staffTabs('Calendar')}`);

S['10a-instructor-week-sorted'] = page(`${statusBar('21:14')}${staffHeader('')}
<div class="page">
  <h1>This week</h1><div class="sub">Mon 26 – Sun 1 November</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
    ${[['Lessons', '24', '#2563EB'], ['Cancellations', '0', RED], ['Unconfirmed', '0', '#D97706'], ['Utilisation', '78%', '#16A34A']]
      .map(([l, v, c]) => `<div class="card" style="margin-top:0"><div class="small muted">${l}</div><div style="font-size:30px;font-weight:700;color:${c};margin-top:4px">${v}</div></div>`)
      .join('')}
  </div>
  <div class="card"><div class="row" style="justify-content:flex-start;gap:10px;font-weight:600;color:#15803D">${svg('check', 22, '#16A34A')} Reminders are going out by email</div><div class="muted small" style="margin-top:6px">Every pupil gets one before each lesson.</div></div>
  <div class="card"><div class="row"><span class="muted">Ford Fiesta MOT</span><span class="badge b-green">OK until 14 Mar</span></div></div>
</div>${staffTabs('Today')}`);

S['11a-instructor-record-cash'] = page(`${statusBar('17:02')}${staffHeader('Record payment', true)}
<div class="page">
  <div class="card" style="margin-top:0"><div class="row"><div><div style="font-weight:600">Lesson · 22/10/2026 16:00</div><div class="muted small">Emily Thompson</div></div><span style="font-weight:700">£38.00</span></div></div>
  <div class="flabel">Amount (£)</div><div class="field">38.00</div>
  <div class="flabel">Payment method</div><div class="field">Cash</div>
  <div class="flabel">Date</div><div class="field">22/10/2026</div>
  <div class="btn red" style="margin-top:22px;height:54px">Save payment</div>
</div>${toast('Payment recorded successfully.')}${staffTabs('Money')}`);

S['12a-texts-many'] = page(`<div style="background:linear-gradient(160deg,#1E293B,#334155);height:852px;color:#fff">${statusBar('21:47', true)}
<div style="text-align:center;margin-top:40px;font-size:86px;font-weight:600;letter-spacing:-.02em">21:47</div>
<div style="text-align:center;font-size:19px;opacity:.85">Wednesday 21 October</div>
<div style="padding:40px 12px;display:flex;flex-direction:column;gap:10px">${[['Jack', 'what time is my lesson tomorrow?', 'now'], ['Sophie', 'is it 11 or 12 on thursday??', '3m ago'], ['Harry', 'what time are we on fri', '9m ago'], ['Oliver', 'Hi John is my lesson still on tmrw', '14m ago'], ['Emily', 'what time thursday x', '22m ago']]
  .map(([n, t, a]) => `<div style="background:rgba(255,255,255,.82);color:#111;border-radius:20px;padding:13px 16px;backdrop-filter:blur(10px)"><div class="row"><span style="font-weight:600">${n}</span><span class="small muted">${a}</span></div><div style="margin-top:3px;font-size:15.5px">${t}</div></div>`)
  .join('')}</div></div>`);

S['12b-pupil-home'] = page(`${statusBar('21:48')}${pupilHeader()}
<div class="page">
  <h1>Hello, Emily</h1><div class="sub">Welcome to your student portal</div>
  <div class="card"><div class="label">Next lesson</div><div style="font-weight:700;font-size:20px;margin-top:10px">Thursday 22 October</div>
    <div style="font-size:18px;margin-top:4px">16:00 – 17:00</div><div class="muted small" style="margin-top:6px">with John · Ford Fiesta · Pickup: home</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:2px">
    ${[['Test readiness', '67%'], ['Hours left', '8h'], ['Skills at Level 4+', '15/27'], ['Total hours', '24h']]
      .map(([l, v]) => `<div class="card"><div class="small muted">${l}</div><div style="font-size:26px;font-weight:700;margin-top:4px">${v}</div></div>`)
      .join('')}
  </div>
</div>${pupilTabs('Home')}`);

S['13a-instructor-passed-review'] = page(`${statusBar('11:46')}${staffHeader('')}
<div class="page">
  <h1>Today</h1><div class="sub">Friday 23 October</div>
  <div class="card" style="background:#F0FDF4;border-color:#BBF7D0">
    <div class="row" style="justify-content:flex-start;gap:10px;font-weight:700;color:#166534;font-size:18px">${svg('star', 22, '#16A34A')} Emily passed today</div>
    <div style="margin-top:8px;font-size:15px;color:#166534">This is the best day to ask for a Google review.</div>
    <div class="card" style="margin-top:12px;font-size:15px;line-height:1.45">"Congratulations Emily! If you've got a minute, a Google review would really help other learners find me. John"</div>
    <div class="btn red" style="margin-top:12px;height:50px">Send review request</div>
  </div>
  ${todayLesson('14:00', 'Sophie Ahmed', 'Pickup: college', '<span class="badge b-green">Confirmed</span>')}
</div>${staffTabs('Today')}`);

S['13b-review-sent'] = page(S['13a-instructor-passed-review'].replace('</body>', `${toast('Review request sent to Emily')}</body>`));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3 });
  const pg = await ctx.newPage();
  for (const [id, html] of Object.entries(S)) {
    await pg.setContent(html, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, `${id}.png`) });
    console.log('wrote', id);
  }
  await browser.close();
})();
