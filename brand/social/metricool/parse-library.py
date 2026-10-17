"""Parse brand/social/november-2026.md into metricool/november-posts.json.

    python3 brand/social/metricool/parse-library.py

One entry per post: id, title, date (ISO, Europe/London), channels (facebook/instagram),
format, fb_text, ig_text, fb_link, ig_link, flags ([JOHN: confirm] notes, placeholders).
FB text: the caption with the "→ ... (Link in bio)" line replaced by the tracked FB URL.
IG text: the caption as written (ends "Link in bio").
"""
import json, os, re
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'november-2026.md')
MONTHS = {'November': 11, 'October': 10, 'December': 12}

def quote_block(lines):
    out = []
    for l in lines:
        if l.startswith('>'):
            out.append(l[1:].lstrip(' ') if l != '>' else '')
        elif out:
            break
    return '\n'.join(out).strip()

def section(body, header):
    i = body.find(header)
    if i < 0: return None
    rest = body[i + len(header):].split('\n')[1:]
    while rest and not rest[0].startswith('>'): rest = rest[1:]
    return quote_block(rest)

def main():
    md = open(SRC).read()
    chunks = re.split(r'\n(?=### N\d\d · )', md)
    posts, seen = [], set()
    for ch in chunks:
        m = re.match(r'### (N\d\d) · (.+)', ch)
        if not m: continue
        pid, title = m.group(1).lower(), m.group(2).strip()
        if pid in seen: continue
        body = ch.split('\n---')[0]
        if '**Date / time:**' not in body: continue
        seen.add(pid)
        dt = re.search(r'\*\*Date / time:\*\* \w+ (\d+) (\w+), (\d\d):(\d\d)', body)
        date = datetime(2026, MONTHS[dt.group(2)], int(dt.group(1)), int(dt.group(3)), int(dt.group(4))).strftime('%Y-%m-%dT%H:%M:00')
        chan = re.search(r'\*\*Channels:\*\* (.+)', body).group(1)
        fmt = re.search(r'\*\*Format:\*\* (.+)', body).group(1)
        channels = ['facebook'] if chan.startswith('FB') else ['facebook', 'instagram']
        fb_link = re.search(r'FB: (https://\S+)', body)
        ig_link = re.search(r'IG(?: \(if used\))?: (https://\S+)', body)
        cap = section(body, '**Caption**') or section(body, '**Caption (FB)**')
        if cap is None:   # N43 customer-story template: handled by hand
            print('skip', pid, '(no standard caption)'); continue
        ig_cap = cap
        fb_cap = cap
        if fb_link:
            fb_cap = re.sub(r'^→ .*$', fb_link.group(1), cap, flags=re.M)
            if fb_cap == cap and fb_link.group(1) not in cap:
                pass
        flags = re.findall(r'\[JOHN: confirm[^\]]*\]', body) + re.findall(r'\[CUSTOMER STORY PLACEHOLDER[^\]]*\]', body)
        posts.append(dict(id=pid, title=title, date=date, channels=channels, channels_raw=chan, format=fmt,
                          video='Video' in fmt, fb_text=fb_cap, ig_text=ig_cap,
                          fb_link=fb_link.group(1) if fb_link else None,
                          ig_link=ig_link.group(1) if ig_link else None, flags=flags))
    json.dump(posts, open(os.path.join(HERE, 'november-posts.json'), 'w'), indent=1, ensure_ascii=False)
    print(len(posts), 'posts')
    for p in posts:
        bad = '→' in p['fb_text'] and p['fb_link']
        print(p['id'], p['date'][5:16], ','.join(c[:2] for c in p['channels']), 'VID' if p['video'] else 'img',
              len(p['fb_text']), 'FB-ARROW-LEFT' if bad else '', 'FLAGS' if p['flags'] else '')

if __name__ == '__main__':
    main()
