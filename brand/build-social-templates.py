"""Build the DriveSchoolPro social post templates.

    python3 brand/build-social-templates.py

Writes brand/social-templates/{png,svg}/<type>-<WxH>-{bg,sample}.{png,svg} and contact-sheet.png.
Templates take sample=True (placeholder copy) or a dict of real copy (see build-social-posts.py).
  -bg      no placeholder copy: background, label, decoration, logo footer (upload to Canva/Metricool)
  -sample  same plus placeholder copy ("Headline goes here") showing where text goes and how big
PNGs are rendered from outlined text (exact). SVGs keep text as editable <text> (Lexend / Inter).

Needs: pip install --user cairosvg uharfbuzz fonttools pillow  (and brew cairo)
"""
import math, os
from PIL import Image, ImageDraw
from brandlib import *

OUT = os.path.join(BRAND, 'social-templates')
SIZES = [(1080, 1080), (1080, 1350), (1080, 1920)]
LEX, INTER, INTER_SB, INTER_B = (face(n) for n in ('Lexend-Bold', 'Inter-Regular', 'Inter-SemiBold', 'Inter-Bold'))

M = 80                 # side margin
LOGO_H = 52            # footer logo height
STORY_TOP, STORY_BOTTOM = 250, 340   # Instagram/Facebook/TikTok story UI zones (keep clear)

class Frame:
    def __init__(s, W, H):
        s.W, s.H = W, H
        s.story = H == 1920
        s.top = STORY_TOP if s.story else M
        s.bottom = H - STORY_BOTTOM if s.story else H - M   # bottom of footer
        s.divider = s.bottom - LOGO_H - 34
        s.content_top = s.top + 56 + (70 if s.story else 56)  # below label pill
        s.content_bottom = s.divider - (60 if s.story else 48)
        s.cw = W - 2 * M
    def by(s, sq, pt, st):   # pick per-size value
        return {1080: sq, 1350: pt, 1920: st}[s.H]

def pill(F, label, mode, fill, color, stroke=None, x=None, y=None):
    x = M if x is None else x; y = F.top if y is None else y
    size, tr, h = 24, 0.1, 56
    w = INTER_B.width(label, size, tr) + 52
    st = f' stroke="{stroke}" stroke-width="2.5"' if stroke else ''
    return (f'<rect x="{x}" y="{y}" width="{w:.1f}" height="{h}" rx="{h/2}" fill="{fill}"{st}/>'
            + text(INTER_B, label, size, x + 26, y + h / 2 + size * 0.36, color, mode, tracking=tr, ident='label'))

def footer(F, mode, dark, page=None):
    """page=(k, n) on carousel slides: a small 27-segment progress ring and "k / n" replace the URL
    (the last slide keeps the URL)."""
    rule = OFF_DARK if dark else OFF_LIGHT
    logo, lw, _ = place('logo-horizontal-reversed' if dark else 'logo-horizontal', M, F.bottom - LOGO_H, h=LOGO_H)
    base = F.bottom - LOGO_H + LOGO_H * 62 / 80   # wordmark baseline inside the logo
    muted = MUTED_ON_DARK if dark else MUTED_ON_LIGHT
    if page and page[0] < page[1]:
        k, n = page
        r = 24; cx = F.W - M - r - 4; cy = F.bottom - LOGO_H / 2
        right = (ring(cx, cy, r, 9, RED, OFF_DARK if dark else OFF_LIGHT, gap=4.5, done=max(1, round(N * k / n)))
                 + text(INTER_SB, f'{k} / {n}', 28, cx - r - 22, base, muted, mode, anchor='end'))
    else:
        right = text(INTER_SB, 'driveschoolpro.com', 28, F.W - M, base, muted, mode, anchor='end', ident='url')
    return f'<rect x="{M}" y="{F.divider}" width="{F.cw}" height="2" fill="{rule}"/>' + logo + right

def stack(F, items, top, bottom, center=True):
    """items: list of (height, gap_after, fn(y)->svg). Vertically centre (or top-align) in [top,bottom]."""
    total = sum(h for h, _, _ in items) + sum(g for _, g, _ in items[:-1])
    y = top + max(0, (bottom - top - total) / 2) if center else top
    out = []
    for h, g, fn in items:
        out.append(fn(y)); y += h + g
    return ''.join(out)

def tb(fc, txt, size, maxw, color, mode, lh=1.15, x=M, ident=None, anchor='start'):
    """(height, fn) for a wrapped text block, for use in stack()."""
    h = block_height(fc, txt, size, maxw, lh)
    return h, (lambda y: block(fc, txt, size, x, y, maxw, color, mode, lh, anchor=anchor, ident=ident)[0])

def item(gap, h, fn):
    return (h, gap, fn)

def accent(x=M, w=120):
    return 10, (lambda y: f'<rect x="{x}" y="{y:.1f}" width="{w}" height="10" rx="5" fill="{RED}"/>')

# ======================================================================= templates
def tpl_tip(F, sample, mode):
    W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{NAVY}"/>'
    r = F.by(330, 380, 430)
    b += ring(W - 40, F.top + r * 0.55, r, F.by(56, 62, 70), FAINT_ON_DARK, FAINT_ON_DARK, done=N)
    if isinstance(sample, dict):
        return b + slide_body(F, sample, 'navy', mode, label_default='ADI TIP')
    b += pill(F, 'ADI TIP', mode, RED, WHITE)
    if sample:
        hs = F.by(84, 92, 96)
        b += stack(F, [
            item(44, *tb(LEX, 'Headline goes here, up to three short lines', hs, F.cw, WHITE, mode, 1.12, ident='headline')),
            item(44, *accent()),
            item(0, *tb(INTER, 'Supporting text goes here. One or two plain-English sentences that explain the tip.',
                                           F.by(36, 38, 40), F.by(860, 880, 900), MUTED_ON_DARK, mode, 1.4, ident='body')),
        ], F.content_top, F.content_bottom)
    return b + footer(F, mode, True)

def phone(x, y, w, sample, mode, shot=None):
    h = w * 2.05; bz = w * 0.04; rx = w * 0.16
    s = (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx:.1f}" fill="{NAVY}"/>'
         f'<rect x="{x+bz:.1f}" y="{y+bz:.1f}" width="{w-2*bz:.1f}" height="{h-2*bz:.1f}" rx="{rx-bz:.1f}" fill="{SCREEN}"/>'
         f'<rect x="{x+w*0.36:.1f}" y="{y+bz+w*0.035:.1f}" width="{w*0.28:.1f}" height="{w*0.075:.1f}" rx="{w*0.0375:.1f}" fill="{NAVY}"/>')
    if shot:   # path to a demo-data screenshot, clipped to the screen
        import base64
        data = base64.b64encode(open(shot, 'rb').read()).decode()
        cid = 'scr' + str(abs(hash(shot)) % 10**6)
        s += (f'<clipPath id="{cid}"><rect x="{x+bz:.1f}" y="{y+bz:.1f}" width="{w-2*bz:.1f}" height="{h-2*bz:.1f}" rx="{rx-bz:.1f}"/></clipPath>'
              f'<image href="data:image/png;base64,{data}" x="{x+bz:.1f}" y="{y+bz:.1f}" width="{w-2*bz:.1f}" height="{h-2*bz:.1f}" '
              f'preserveAspectRatio="xMidYMin slice" clip-path="url(#{cid})"/>')
    elif sample:
        cx, cy = x + w / 2, y + h / 2
        sw, sh = w - 2 * bz - 60, h * 0.5
        s += (f'<rect x="{cx-sw/2:.1f}" y="{cy-sh/2:.1f}" width="{sw:.1f}" height="{sh:.1f}" rx="16" fill="none" '
              f'stroke="{OFF_LIGHT}" stroke-width="3" stroke-dasharray="12 10"/>')
        s += text(INTER_SB, 'Screenshot', 28, cx, cy - 4, MUTED_ON_LIGHT, mode, anchor='middle')
        s += text(INTER, 'goes here', 28, cx, cy + 34, MUTED_ON_LIGHT, mode, anchor='middle')
    return s, h

def tpl_feature(F, sample, mode):
    W, H = F.W, F.H
    c = sample if isinstance(sample, dict) else {}
    shot = c.get('screenshot')
    b = f'<rect width="{W}" height="{H}" fill="{WHITE}"/>'
    b += pill(F, c.get('label', 'HOW TO'), mode, NAVY, WHITE)
    if F.story:
        # headline full width on top, phone centred underneath
        hs = 80
        head_h = block_height(LEX, 'Headline goes here in two lines', hs, F.cw, 1.12)
        ph_top = F.content_top + head_h + 150
        pw = min(440, (F.content_bottom - ph_top) / 2.05)
        px = (W - pw) / 2
        b += f'<circle cx="{W/2}" cy="{ph_top + pw*1.025:.1f}" r="{pw*0.95:.1f}" fill="{LIGHT_RED}"/>'
        ps, _ = phone(px, ph_top, pw, sample, mode, shot); b += ps
        if sample:
            b += block(LEX, c.get('headline', 'Headline goes here in two lines'), hs, M, F.content_top, F.cw, NAVY, mode, 1.12, ident='headline')[0]
            b += block(INTER, c.get('body', 'One line of supporting text goes here'), 36, M, F.content_top + head_h + 36, F.cw, MUTED_ON_LIGHT, mode, 1.35, ident='body')[0]
    else:
        pw = F.by(370, 440, 0)
        ph = pw * 2.05
        px = W - M - pw
        py = F.content_top - 56 + (F.divider - 40 - (F.content_top - 56) - ph) / 2
        b += f'<circle cx="{px + pw/2:.1f}" cy="{py + ph/2:.1f}" r="{pw*0.78:.1f}" fill="{LIGHT_RED}"/>'
        ps, _ = phone(px, py, pw, sample, mode, shot); b += ps
        if sample:
            colw = px - M - 50
            hs = F.by(60, 62, 0)
            items = [item(36, *tb(LEX, c.get('headline', 'Headline goes here'), hs, colw, NAVY, mode, 1.12, ident='headline'))]
            for i, st in enumerate(c.get('steps', ['Step one goes here', 'Step two goes here', 'Step three goes here'])):
                def fn(y, i=i, st=st):
                    cx, cy = M + 24, y + 24
                    return (f'<circle cx="{cx}" cy="{cy:.1f}" r="24" fill="{RED}"/>'
                            + text(INTER_B, str(i + 1), 26, cx, cy + 9.5, WHITE, mode, anchor='middle')
                            + block(INTER, st, 30, M + 68, cy - 11.2, colw - 68, NAVY, mode, 1.3)[0])
                h = max(48, block_height(INTER, st, 30, colw - 68, 1.3) + 2)
                items.append((h, 26, fn))
            b += stack(F, items, F.content_top, F.content_bottom)
    return b + footer(F, mode, False, page=c.get('page'))

def tpl_quote(F, sample, mode):
    W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{WHITE}"/>'
    b += f'<rect x="0" y="0" width="{W}" height="{F.by(16, 16, 16)}" fill="{RED}"/>' if not F.story else ''
    qr = F.by(220, 260, 300)
    b += ring(W - 30, F.divider - qr - 40, qr, F.by(44, 50, 56), FAINT_ON_WHITE, FAINT_ON_WHITE, done=N)
    c = sample if isinstance(sample, dict) else {}
    b += pill(F, c.get('label', 'INSTRUCTOR STORY'), mode, NAVY, WHITE)
    qs = F.by(300, 340, 380)
    qy = F.content_top - 20 + qs * 0.72
    b += text(LEX, '“', qs, M - 12, qy, RED, 'outline')      # decorative, always outlined
    if sample:
        qt = F.content_top - 20 + qs * 0.5
        quote = c.get('quote', 'Quote goes here. Two or three short sentences, in the instructor’s own words.')
        fs = F.by(54, 60, 64)
        def attrib(y):
            cx, cy, r = M + 48, y + 48, 48
            return (ring(cx, cy, 56, 6, RED, OFF_LIGHT, gap=5)
                    + f'<circle cx="{cx}" cy="{cy}" r="{r-4}" fill="{LIGHT_RED}"/>'
                    + text(INTER_B, c.get('name', 'Name Surname'), 34, M + 136, cy - 6, NAVY, mode, ident='name')
                    + text(INTER, c.get('business', 'Driving school name, Town'), 28, M + 136, cy + 34, MUTED_ON_LIGHT, mode, ident='business'))
        b += stack(F, [
            item(F.by(48, 70, 90), *tb(LEX, quote, fs, F.cw, NAVY, mode, 1.24, ident='quote')),
            (100, 0, attrib),
        ], qt, F.content_bottom, center=F.H != 1080)
    return b + footer(F, mode, False)

def tpl_stat(F, sample, mode):
    W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{NAVY}"/>'
    r = F.by(300, 340, 400)
    cy = (F.content_top + F.content_bottom) / 2 - F.by(60, 60, 80)
    b += ring(W - 20, cy, r, F.by(60, 68, 78), FAINT_ON_DARK, FAINT_ON_DARK, done=N)
    c = sample if isinstance(sample, dict) else {}
    b += pill(F, c.get('label', 'BY THE NUMBERS'), mode, RED, WHITE)
    if sample:
        ns = c.get('number_size', F.by(320, 360, 400))
        number = c.get('number', '27')
        while LEX.width(number, ns) > F.cw: ns -= 8
        def num(y):
            return text(LEX, number, ns, M - ns * 0.04, y + ns * 0.72, RED, mode, ident='number')
        its = [(ns * 0.74, F.by(40, 50, 60), num),
               item(40, *accent()),
               item(28, *tb(LEX, c.get('caption', 'Caption goes here: what the number means'), F.by(60, 66, 70),
                            tidy_width(LEX, c['caption'], F.by(60, 66, 70), F.cw, balance=True) if c.get('caption') else F.cw, WHITE, mode, 1.14, ident='caption'))]
        src = c.get('source', None if c else 'Source or small print goes here')
        if src:
            its.append(item(0, *tb(INTER, src, 28, F.cw, MUTED_ON_DARK, mode, 1.4, ident='source')))
        if c.get('body'):
            its.insert(3, item(36, *tb(INTER, c['body'], 36, F.cw, MUTED_ON_DARK, mode, 1.4)))
        b += stack(F, its, F.content_top, F.content_bottom)
    return b + footer(F, mode, True, page=c.get('page'))

def tpl_announce(F, sample, mode):
    W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{WHITE}"/>'
    bh = F.by(190, 210, 230)
    area = F.content_bottom - F.content_top
    by_ = F.content_top + area * F.by(0.50, 0.50, 0.50) - bh / 2
    # decoration: ring on the band's right end
    b += ring(W - 70, by_ - F.by(120, 160, 260), F.by(170, 200, 240), F.by(38, 42, 48), FAINT_ON_WHITE, FAINT_ON_WHITE, done=N)
    b += f'<rect x="0" y="{by_:.1f}" width="{W}" height="{bh}" fill="{RED}"/>'
    b += f'<rect x="0" y="{by_ + bh:.1f}" width="{W}" height="10" fill="{NAVY}"/>'
    b += pill(F, 'NEWS', mode, NAVY, WHITE)
    if sample:
        c = sample if isinstance(sample, dict) else {}
        hs = F.by(72, 80, 88)
        b += stack(F, [item(0, *tb(LEX, c.get('headline', 'Announcement headline goes here'), hs, F.cw, NAVY, mode, 1.12, ident='headline'))],
                   F.content_top, by_ - 50)
        bs = F.by(64, 68, 70)
        b += text(LEX, c.get('band', 'Free until 31 March 2027'), bs, W / 2, by_ + bh / 2 + bs * 0.36, WHITE, mode, anchor='middle', ident='band')
        b += stack(F, [item(0, *tb(INTER, c.get('body', 'Supporting detail goes here. Keep it to one or two lines.'), F.by(34, 36, 40), F.cw, MUTED_ON_LIGHT, mode, 1.4, ident='body'))],
                   by_ + bh + 10 + 50, F.content_bottom)
    return b + footer(F, mode, False)

TICK = '<path d="M47 65l12 12 24-26" fill="none" stroke="{c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'

def tpl_mtd(F, sample, mode):
    W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{LIGHT_RED}"/>'
    r = F.by(280, 320, 380)
    b += ring(W - 40, F.top + r * 0.5, r, F.by(52, 58, 66), FAINT_ON_PINK, FAINT_ON_PINK, done=N)
    b += pill(F, 'MAKING TAX DIGITAL', mode, 'none', NAVY, stroke=NAVY)
    if sample:
        c = sample if isinstance(sample, dict) else {}
        hs = F.by(72, 78, 84)
        items = [item(30, *tb(LEX, c.get('headline', 'Guide headline goes here'), hs, F.cw, NAVY, mode, 1.12, ident='headline')),
                 item(F.by(44, 56, 64), *tb(INTER, c.get('body', 'A calm, plain-English line explaining what this means for instructors.'), F.by(34, 36, 40), F.by(880, 900, 920), OFF_DARK, mode, 1.4, ident='body'))]
        for pt in c.get('points', ['Key point one goes here', 'Key point two goes here', 'Key point three goes here']):
            def fn(y, pt=pt):
                s = 44 / 128
                return (f'<g transform="translate({M} {y:.1f}) scale({s:.4f})"><circle cx="64" cy="64" r="64" fill="{WHITE}"/>'
                        + TICK.format(c=RED).replace('stroke-width="10"', 'stroke-width="13"') + '</g>'
                        + text(INTER_SB, pt, 32, M + 64, y + 22 + 11.5, NAVY, mode))
            items.append((44, 24, fn))
        if c.get('source'):
            h, g, f0 = items[-1]; items[-1] = (h, 48, f0)
            items.append(item(0, *tb(INTER, c['source'], 26, F.cw, MUTED_ON_LIGHT, mode, 1.4, ident='source')))
        b += stack(F, items, F.content_top, F.content_bottom)
    return b + footer(F, mode, False)

# ======================================================================= finished-post slides
# Used by build-social-posts.py. tpl_slide is the general carousel/single-image slide; tpl_quiet is the
# calm, no-selling design for remembrance days. Copy dict keys (all optional):
#   theme 'navy' | 'white' | 'pink'   label (pill, None = no pill)   badge (light pill, top right)
#   number (big red, top left)   hero (big text)   headline   sub (red)   body   graphic   body2   cta   source
#   page (k, n) set by the builder   ring True (large faint ring, cover style)   clock m (minutes 0-10 ring)
#   align 'center' | 'top'   order [keys]   hs/ss/bs/hero_size/number_size   gaps {key: px}
GREY_ON_DARK = "#5C5C78"; OFF_PINK = "#F2C3CE"; GREY_TEXT = "#9A9AB0"
TH = {
    'navy':  dict(bg=NAVY, head=WHITE, body=MUTED_ON_DARK, faint=FAINT_ON_DARK, panel=LIGHT_RED, ptext=NAVY,
                  off=GREY_ON_DARK, dark=True, pill=(RED, WHITE, None), badge=(LIGHT_RED, NAVY)),
    'white': dict(bg=WHITE, head=NAVY, body=MUTED_ON_LIGHT, faint=FAINT_ON_WHITE, panel=LIGHT_RED, ptext=NAVY,
                  off=OFF_LIGHT, dark=False, pill=(NAVY, WHITE, None), badge=(LIGHT_RED, NAVY)),
    'pink':  dict(bg=LIGHT_RED, head=NAVY, body=OFF_DARK, faint=FAINT_ON_PINK, panel=WHITE, ptext=NAVY,
                  off=OFF_PINK, dark=False, pill=('none', NAVY, NAVY), badge=(WHITE, NAVY)),
}
ORDER = ['number', 'hero', 'headline', 'accent', 'sub', 'body', 'graphic', 'body2', 'graphic2', 'cta', 'source']
GAPS = dict(number=34, hero=34, headline=36, accent=40, sub=40, body=50, graphic=50, body2=44, graphic2=44, cta=34, source=0)

def badge(F, label, th, mode):
    size, tr, h = 24, 0.1, 56
    w = INTER_B.width(label, size, tr) + 52
    x = F.W - M - w
    fill, col = th['badge']
    return (f'<rect x="{x:.1f}" y="{F.top}" width="{w:.1f}" height="{h}" rx="{h/2}" fill="{fill}"/>'
            + text(INTER_B, label, size, x + 26, F.top + h / 2 + size * 0.36, col, mode, tracking=tr))

def clock(F, m, th, mode):
    r = 52; cx = F.W - M - r - 7; cy = F.top + 40
    return (ring(cx, cy, r, 14, RED, th['off'], gap=7, n=10, done=m)
            + text(LEX, str(m), 40, cx, cy + 14, th['head'], mode, anchor='middle')
            + text(INTER_SB, 'minutes used', 28, cx - r - 24, cy + 10, th['body'], mode, anchor='end'))

def fit(fc, txt, size, maxw):
    while max(fc.width(l, size) for l in txt.split('\n')) > maxw: size -= 4
    return size

def tidy_width(fc, txt, size, maxw, balance=False):
    """Width to wrap at so the last line isn't a lone word; balance=True also evens out line lengths (headlines)."""
    n = len(wrap(fc, txt, size, maxw))
    if n < 2: return maxw
    cands = {n: [], n + 1: []}; w = maxw
    while w >= maxw * 0.45:
        ls = wrap(fc, txt, size, w)
        if len(ls) > n + 1: break
        if len(ls[-1].split(' ')) >= 2 and max(fc.width(l, size) for l in ls) <= w: cands[len(ls)].append(w)
        w -= 8
    for k in (n, n + 1):   # prefer keeping the line count; else accept one more line
        if cands[k]: return cands[k][-1] if balance else cands[k][0]
    return maxw

def slide_body(F, c, theme, mode, label_default=None):
    """Label/badge/clock + content stack + footer for a finished slide."""
    th = TH[theme]; b = ''
    label = c.get('label', label_default)
    if label:
        f, col, st = th['pill']; b += pill(F, label, mode, f, col, stroke=st)
    if c.get('badge'): b += badge(F, c['badge'], th, mode)
    if c.get('clock') is not None: b += clock(F, c['clock'], th, mode)
    top = F.content_top if (label or c.get('badge') or c.get('clock') is not None) else F.top + 10
    if c.get('number') and not label: top = F.top + 4
    b += content(F, c, th, mode, top, F.content_bottom)
    return b + footer(F, mode, th['dark'], page=c.get('page'))

def content(F, c, th, mode, top, bottom):
    cw = F.cw; items = []
    gaps = dict(GAPS, **c.get('gaps', {}))
    for k in c.get('order', ORDER):
        if k == 'accent':
            if c.get('accent'): items.append((*accent(), gaps[k]))
            continue
        v = c.get(k)
        if v is None or v is False: continue
        if k == 'number':
            ns = c.get('number_size', 300)
            items.append((*tb(LEX, v, ns, cw, RED, mode, 1.0, x=M - ns * 0.03), gaps[k]))
        elif k == 'hero':
            hs = fit(LEX, v, c.get('hero_size', 190), cw)
            items.append((*tb(LEX, v, hs, cw, c.get('hero_color', RED), mode, 1.04, x=M - hs * 0.02), gaps[k]))
        elif k == 'headline':
            hs = c.get('hs', 100 if c.get('number') else F.by(84, 88, 96))
            items.append((*tb(LEX, v, hs, tidy_width(LEX, v, hs, cw, balance=True), th['head'], mode, 1.12), gaps[k]))
        elif k == 'sub':
            ss = c.get('ss', 50)
            items.append((*tb(LEX, v, ss, tidy_width(LEX, v, ss, cw, balance=True), RED, mode, 1.18), gaps[k]))
        elif k in ('body', 'body2'):
            bs = c.get('bs', 42 if c.get('number') else 40)
            items.append((*tb(INTER, v, bs, tidy_width(INTER, v, bs, c.get('bw', 900)), th['body'], mode, 1.42), gaps[k]))
        elif k in ('graphic', 'graphic2'):
            name, kw = v
            items.append((*GRAPHICS[name](F, th, mode, **kw), gaps[k]))
        elif k == 'cta':
            items.append((*g_box(F, th, mode, v), gaps[k]))
        elif k == 'source':
            items.append((*tb(INTER, v, 26, cw, th['body'], mode, 1.4), gaps[k]))
    total = sum(h for h, _, _ in items) + sum(g for _, _, g in items[:-1])
    if total > bottom - top + 0.5:
        print(f'  !! overflow by {total - (bottom - top):.0f}px: {c.get("headline") or c.get("hero")}')
    align = c.get('align', 'split' if c.get('number') else 'center')
    out = []
    if align == 'split' and len(items) > 1:
        # first item (the big number) pinned top-left, the rest sits on the bottom edge
        h0, fn0, _ = items[0]; out.append(fn0(top))
        items = items[1:]
        total = sum(h for h, _, _ in items) + sum(g for _, _, g in items[:-1])
        y = bottom - total
    else:
        y = top + max(0, (bottom - top - total) / 2) if align == 'center' else top
    for h, fn, g in items:
        out.append(fn(y)); y += h + g
    return ''.join(out)

def tpl_slide(F, c, mode):
    th = TH[c.get('theme', 'navy')]; W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{th["bg"]}"/>'
    if c.get('ring'):
        r = F.by(330, 380, 430)
        b += ring(W - 40, F.top + r * 0.55, r, F.by(56, 62, 70), th['faint'], th['faint'], done=N)
    return b + slide_body(F, c, c.get('theme', 'navy'), mode)

def tpl_quiet(F, c, mode):
    """Remembrance days: navy, one simple drawing, white text, small mono mark only. No CTA, no URL."""
    W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{NAVY}"/>'
    gh, gfn = GRAPHICS[c['graphic'][0]](F, TH['navy'], mode, **c['graphic'][1])
    hs = c.get('hs', 68)
    th_ = block_height(LEX, c['headline'], hs, F.cw - 60, 1.18)
    sh = block_height(INTER, c['sub'], 32, F.cw, 1.4) if c.get('sub') else 0
    total = gh + 90 + th_ + (40 + sh if sh else 0)
    y = (H - total) / 2 - 30
    b += gfn(y); y += gh + 90
    b += block(LEX, c['headline'], hs, W / 2, y, F.cw - 60, WHITE, mode, 1.18, anchor='middle')[0]; y += th_ + 40
    if sh: b += block(INTER, c['sub'], 32, W / 2, y, F.cw, MUTED_ON_DARK, mode, 1.4, anchor='middle')[0]
    mk, _, _ = place('mark-mono-white', W - M - 44, H - M - 44, h=44, opacity=0.55)
    return b + mk

# ---------------------------------------------------------------- graphics: fn(F, th, mode, **kw) -> (height, draw(y))
def g_box(F, th, mode, v, fill=None, color=None, fit_text=False):
    """CTA / note box. v = 'text' or ('Bold title', 'text')."""
    title, body = (v if isinstance(v, tuple) else (None, v))
    fill = fill or th['panel'] if th['bg'] != WHITE else fill or LIGHT_RED
    if th['bg'] == LIGHT_RED and fill == WHITE: pass
    color = color or NAVY
    px, py = 44, 36; size = 36
    tw = F.cw - 2 * px
    if fit_text:
        tw = max(INTER_SB.width(l, size) for l in (body.split('\n'))) + 2
    th1 = block_height(INTER_B, title, size, tw, 1.35) if title else 0
    th2 = block_height(INTER, body, size, tw, 1.38) if body else 0
    gap = 12 if title and body else 0
    h = th1 + gap + th2 + 2 * py
    w = tw + 2 * px
    def draw(y):
        s = f'<rect x="{M}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{min(28, h/2):.1f}" fill="{fill}"/>'
        yy = y + py
        if title:
            s += block(INTER_B, title, size, M + px, yy, tw, color, mode, 1.35)[0]; yy += th1 + gap
        if body:
            s += block(INTER_SB if fit_text else INTER, body, size, M + px, yy, tw, color, mode, 1.38)[0]
        return s
    return h, draw

def g_numlist(F, th, mode, items):
    """Compact numbered tips: [(num, head, body)]."""
    rows = []
    nx = 150; tw = F.cw - nx
    for num, head, body in items:
        hw = tidy_width(LEX, head, 66, tw, balance=True); bw = tidy_width(INTER, body, 40, tw)
        hh = block_height(LEX, head, 66, hw, 1.12); bh = block_height(INTER, body, 40, bw, 1.4)
        rows.append((num, head, body, hh, bh, max(130, hh + 22 + bh), hw, bw))
    total = sum(r[5] for r in rows) + 80 * (len(rows) - 1)
    def draw(y):
        s = ''
        for num, head, body, hh, bh, rh, hw, bw in rows:
            s += text(LEX, num, 150, M - 6, y + 150 * 0.72, RED, mode)
            s += block(LEX, head, 66, M + nx, y + 4, hw, th['head'], mode, 1.12)[0]
            s += block(INTER, body, 40, M + nx, y + 4 + hh + 22, bw, th['body'], mode, 1.4)[0]
            y += rh + 80
        return s
    return total, draw

TICK_PATH = 'M{x0} {y0}l{a} {a} {b} -{b}'
def tickbox(x, y, s, fill, stroke):
    return (f'<rect x="{x}" y="{y:.1f}" width="{s}" height="{s}" rx="{s*0.22:.1f}" fill="{fill}"/>'
            f'<path d="M{x+s*0.27:.1f} {y+s*0.52:.1f}l{s*0.16:.1f} {s*0.16:.1f} {s*0.31:.1f} -{s*0.33:.1f}" fill="none" '
            f'stroke="{stroke}" stroke-width="{s*0.12:.1f}" stroke-linecap="round" stroke-linejoin="round"/>')

def g_check(F, th, mode, items):
    """Checklist items with navy tick boxes: [(head, body)]."""
    bx = 76; tx = bx + 40; tw = F.cw - tx; hs, bs = (76, 44) if len(items) == 1 else (64, 40)
    rows = []
    for head, body in items:
        hw = tidy_width(LEX, head, hs, tw, balance=True); bw = tidy_width(INTER, body, bs, tw) if body else tw
        hh = block_height(LEX, head, hs, hw, 1.12); bh = block_height(INTER, body, bs, bw, 1.4) if body else 0
        rows.append((head, body, hh, bh, hh + (24 + bh if body else 0), hw, bw))
    total = sum(r[4] for r in rows) + 72 * (len(rows) - 1)
    def draw(y):
        s = ''
        for head, body, hh, bh, rh, hw, bw in rows:
            s += tickbox(M, y - 2 + (hs * 0.74 - bx) / 2, bx, NAVY, WHITE)
            s += block(LEX, head, hs, M + tx, y, hw, th['head'], mode, 1.12)[0]
            if body: s += block(INTER, body, bs, M + tx, y + hh + 24, bw, th['body'], mode, 1.4)[0]
            y += rh + 72
        return s
    return total, draw

def g_rows(F, th, mode, items, highlight=None, marker=None, size=36, tag_size=26):
    """Panel rows. items: 'text' or ('TAG', 'text'). marker: None | 'num' | 'dot'."""
    px, py = 36, 30
    mx = 72 if marker else 0
    tw = F.cw - 2 * px - mx
    rows = []
    for i, it in enumerate(items):
        tag, txt = it if isinstance(it, tuple) else (None, it)
        tgh = block_height(INTER_B, tag, tag_size, tw, 1.3) + 12 if tag else 0
        tww = tidy_width(INTER_SB, txt, size, tw)
        h = tgh + block_height(INTER_SB, txt, size, tww, 1.35) + 2 * py
        rows.append((tag, txt, tgh, h, tww))
    total = sum(r[3] for r in rows) + 20 * (len(rows) - 1)
    def draw(y):
        s = ''
        for i, (tag, txt, tgh, h, tww) in enumerate(rows):
            hl = i == highlight
            fill = RED if hl else th['panel']; col = WHITE if hl else th['ptext']
            s += f'<rect x="{M}" y="{y:.1f}" width="{F.cw}" height="{h:.1f}" rx="22" fill="{fill}"/>'
            x = M + px
            if marker == 'num':
                s += f'<circle cx="{x + 24}" cy="{y + h/2:.1f}" r="26" fill="{WHITE if hl else RED}"/>'
                s += text(INTER_B, str(i + 1), 28, x + 24, y + h / 2 + 10, RED if hl else WHITE, mode, anchor='middle')
            elif marker == 'dot':
                s += f'<circle cx="{x + 16}" cy="{y + py + (tag_size*0.5 if tag else size*0.4):.1f}" r="11" fill="{WHITE if hl else RED}"/>'
            if tag:
                s += block(INTER_B, tag, tag_size, x + mx, y + py, tw, col if hl else RED, mode, 1.3, tracking=0)[0]
            s += block(INTER_SB, txt, size, x + mx, y + py + tgh, tww, col, mode, 1.35)[0]
            y += h + 20
        return s
    return total, draw

def g_clock(F, th, mode, total=45, done=40, big='45', small='minutes'):
    r = 165; h = 2 * r + 50
    def draw(y):
        cx, cy = F.W / 2, y + r + 25
        return (ring(cx, cy, r, 42, RED, th['off'], gap=2.6, n=total, done=done)
                + text(LEX, big, 130, cx, cy + 30, th['head'], mode, anchor='middle')
                + text(INTER_SB, small, 32, cx, cy + 82, th['body'], mode, anchor='middle'))
    return h, draw

def g_scorebar(F, th, mode):
    zones = [('Fail', '0–30', 31, OFF_LIGHT, NAVY), ('Grade B', '31–42', 12, NAVY, WHITE), ('Grade A', '43–51', 9, RED, WHITE)]
    bh = 150; h = bh + 80
    def draw(y):
        s = ''; x = M; tot = sum(z[2] for z in zones)
        for i, (name, rng, n, fill, col) in enumerate(zones):
            w = F.cw * n / tot
            rx = 0
            s += f'<rect x="{x:.1f}" y="{y:.1f}" width="{w - (6 if i < 2 else 0):.1f}" height="{bh}" rx="18" fill="{fill}"/>'
            s += text(INTER_B, name, 32, x + w / 2 - 3, y + bh / 2 + 12, col, mode, anchor='middle')
            s += text(LEX, rng, 40, x + w / 2 - 3, y + bh + 62, th['head'], mode, anchor='middle')
            x += w
        return s
    return h, draw

def g_bars(F, th, mode, bars):
    """bars: [(label, value, fraction, colour, tag or None, crossed)]"""
    bh = 110; lab = 52; gap = 44
    h = len(bars) * (lab + bh) + gap * (len(bars) - 1)
    def draw(y):
        s = ''
        for label, val, frac, col, tag, crossed in bars:
            s += text(INTER_SB, label, 32, M, y + 32, th['head'], mode)
            if tag: s += text(INTER_B, tag, 28, F.W - M, y + 32, RED, mode, anchor='end')
            yb = y + lab; w = F.cw * frac
            s += f'<rect x="{M}" y="{yb:.1f}" width="{w:.1f}" height="{bh}" rx="18" fill="{col}"/>'
            s += text(LEX, val, 56, M + 36, yb + bh / 2 + 20, WHITE, mode)
            if crossed:
                s += f'<path d="M{M - 10} {yb + bh/2:.1f}H{M + w + 10:.1f}" stroke="{RED}" stroke-width="6" stroke-linecap="round"/>'
            y += lab + bh + gap
        return s
    return h, draw

def g_plans(F, th, mode):
    cards = [('FREE', '£0', 'for ever', '1 instructor\nup to 60 lessons\na month', False),
             ('SOLO', '£22', 'a month', '1 instructor\nunlimited lessons', True),
             ('SCHOOL', '£22', 'a month', '+ £10 a month\nfor each extra\ninstructor', False)]
    g = 22; w = (F.cw - 2 * g) / 3; h = 560; tag_h = 50
    def draw(y):
        s = ''; y0 = y + tag_h / 2
        for i, (name, price, unit, det, hl) in enumerate(cards):
            x = M + i * (w + g)
            s += f'<rect x="{x:.1f}" y="{y0:.1f}" width="{w:.1f}" height="{h - tag_h/2:.1f}" rx="24" fill="{WHITE}"' + (f' stroke="{RED}" stroke-width="7"' if hl else '') + '/>'
            if hl:
                tl = 'For full-time ADIs'; tw_ = INTER_B.width(tl, 22) + 36
                s += f'<rect x="{x + w/2 - tw_/2:.1f}" y="{y:.1f}" width="{tw_:.1f}" height="{tag_h}" rx="{tag_h/2}" fill="{RED}"/>'
                s += text(INTER_B, tl, 22, x + w / 2, y + tag_h / 2 + 8, WHITE, mode, anchor='middle')
            cx = x + 24
            s += text(INTER_B, name, 28, cx, y0 + 84, RED, mode, tracking=0.1)
            s += text(LEX, price, 104, cx - 4, y0 + 206, NAVY, mode)
            s += text(INTER, unit, 30, cx, y0 + 258, MUTED_ON_LIGHT, mode)
            s += block(INTER_SB, det, 28, cx, y0 + 310, w - 40, NAVY, mode, 1.4)[0]
        return s
    return h, draw

def g_split(F, th, mode, done=18):
    r = 150; h = 2 * r + 40
    def draw(y):
        cx, cy = M + r + 20, y + r + 20
        s = ring(cx, cy, r, 46, RED, th['off'], gap=3.4, done=done)
        lx = M + 2 * r + 100; ly = cy - 70
        for col, a, bb in ((RED, 'Paid', 'Teaching time'), (th['off'], 'Unpaid', 'Travel, admin, uncharged cancellations')):
            s += f'<rect x="{lx}" y="{ly - 30:.1f}" width="34" height="34" rx="8" fill="{col}"/>'
            s += text(INTER_B, a, 40, lx + 56, ly, th['head'], mode)
            s += block(INTER, bb, 33, lx + 56, ly + 20, F.W - M - lx - 56, th['body'], mode, 1.35)[0]
            ly += 150
        return s
    return h, draw

def g_lines(F, th, mode, lines, size=96, lh=1.25):
    """Formula lines: [(text, colour_key)] colour_key 'head' | 'red'. Red operator prefix if text starts with ÷ / =."""
    h = size * 0.74 + (len(lines) - 1) * size * lh + size * 0.26
    def draw(y):
        s = ''
        for i, (t, ck) in enumerate(lines):
            bl = y + size * 0.74 + i * size * lh
            col = RED if ck == 'red' else th['head']
            if t[:1] in '÷=+' and ck != 'red':
                op = t[:1]; s += text(LEX, op, size, M, bl, RED, mode)
                s += text(LEX, t[1:].strip(), size, M + LEX.width(op + ' ', size), bl, col, mode)
            else:
                s += text(LEX, t, size, M, bl, col, mode)
        return s
    return h, draw

def g_chips(F, th, mode, items, size=34):
    ph, px, g = 74, 30, 16
    rows = [[]]; x = 0
    for t in items:
        w = INTER_SB.width(t, size) + 2 * px
        if x + w > F.cw and rows[-1]: rows.append([]); x = 0
        rows[-1].append((t, w)); x += w + g
    h = len(rows) * ph + (len(rows) - 1) * g
    def draw(y):
        s = ''
        for r in rows:
            x = M
            for t, w in r:
                s += f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{ph}" rx="{ph/2}" fill="{th["panel"]}"/>'
                s += text(INTER_SB, t, size, x + px, y + ph / 2 + size * 0.36, th['ptext'], mode)
                x += w + g
            y += ph + g
        return s
    return h, draw

def g_graph(F, th, mode):
    h = 420
    def draw(y):
        x0, x1 = M + 10, F.W - M - 10; yb = y + h - 50
        X = lambda f: x0 + (x1 - x0) * f
        Y = lambda f: yb - (h - 90) * f
        d = (f'M{X(0):.1f} {Y(0.02):.1f} C{X(0.12):.1f} {Y(0.1):.1f} {X(0.22):.1f} {Y(0.42):.1f} {X(0.34):.1f} {Y(0.48):.1f} '
             f'C{X(0.42):.1f} {Y(0.52):.1f} {X(0.56):.1f} {Y(0.5):.1f} {X(0.64):.1f} {Y(0.53):.1f} '
             f'C{X(0.76):.1f} {Y(0.58):.1f} {X(0.86):.1f} {Y(0.82):.1f} {X(1):.1f} {Y(1):.1f}')
        s = f'<path d="M{x0} {yb:.1f}H{x1}" stroke="{OFF_PINK}" stroke-width="4"/>'
        s += f'<path d="{d}" fill="none" stroke="{NAVY}" stroke-width="12" stroke-linecap="round"/>'
        s += f'<circle cx="{X(1):.1f}" cy="{Y(1):.1f}" r="16" fill="{RED}"/>'
        s += (f'<ellipse cx="{X(0.49):.1f}" cy="{Y(0.505):.1f}" rx="{(x1-x0)*0.2:.1f}" ry="62" fill="none" stroke="{RED}" '
              f'stroke-width="6" stroke-dasharray="16 10"/>')
        s += text(INTER_B, 'the wobble', 34, X(0.49), Y(0.505) + 112, RED, mode, anchor='middle')
        s += text(INTER_SB, 'Lesson 1', 26, x0, yb + 40, th['body'], mode)
        s += text(INTER_SB, 'Test-ready', 26, x1, yb + 40, th['body'], mode, anchor='end')
        return s
    return h, draw

def g_bubbles(F, th, mode, items):
    px, py = 34, 30; tw = F.cw - 2 * px - 76
    rows = [(t, block_height(INTER_SB, t, 36, tw, 1.3) + 2 * py) for t in items]
    tail = 22
    total = sum(h + tail for _, h in rows) + 22 * (len(rows) - 1)
    def draw(y):
        s = ''
        for i, (t, h) in enumerate(rows):
            s += f'<rect x="{M}" y="{y:.1f}" width="{F.cw}" height="{h:.1f}" rx="30" fill="{LIGHT_RED}"/>'
            s += f'<path d="M{M + 50} {y + h - 2:.1f}l0 {tail + 2}l{tail + 14} -{tail + 2}z" fill="{LIGHT_RED}"/>'
            s += f'<circle cx="{M + px + 26}" cy="{y + h/2:.1f}" r="26" fill="{RED}"/>'
            s += text(INTER_B, str(i + 1), 28, M + px + 26, y + h / 2 + 10, WHITE, mode, anchor='middle')
            s += block(INTER_SB, t, 36, M + px + 76, y + py, tw, NAVY, mode, 1.3)[0]
            y += h + tail + 22
        return s
    return total, draw

def g_price(F, th, mode):
    ns = 300; h = ns * 0.74
    def draw(y):
        bl = y + ns * 0.72
        s = text(LEX, '£15', ns, M - 8, bl, NAVY, mode)
        x = M + LEX.width('£15', ns) + 40
        os_ = 110; w = LEX.width('£22', os_)
        s += text(LEX, '£22', os_, x, bl - 10, GREY_TEXT, mode)
        s += f'<path d="M{x - 6:.1f} {bl - 10 - os_*0.36:.1f}L{x + w + 6:.1f} {bl - 10 - os_*0.30:.1f}" stroke="{RED}" stroke-width="9" stroke-linecap="round"/>'
        s += text(INTER_SB, 'a month', 34, x + 4, bl - 10 - os_ - 28, OFF_DARK, mode) if False else ''
        return s
    return h, draw

def g_steps(F, th, mode, items, size=27):
    g = 44; w = (F.cw - g * (len(items) - 1)) / len(items); px = 20
    hh = max(block_height(INTER_SB, t, size, w - 2 * px, 1.3) for t in items) + 2 * 28
    def draw(y):
        s = ''
        for i, t in enumerate(items):
            x = M + i * (w + g)
            s += f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{hh:.1f}" rx="20" fill="{NAVY}"/>'
            s += block(INTER_SB, t, size, x + px, y + 28, w - 2 * px, WHITE, mode, 1.3)[0]
            if i < len(items) - 1:
                ax = x + w + g / 2; ay = y + hh / 2
                s += f'<path d="M{ax - 12:.1f} {ay - 14:.1f}l14 14 -14 14" fill="none" stroke="{RED}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
        return s
    return hh, draw

def g_calendar(F, th, mode, blocked=(), booked=(), first_weekday=1, days=31):
    g = 10; cw_ = (F.cw - 6 * g) / 7; ch = 78; head = 44
    nrows = (first_weekday + days + 6) // 7
    leg = 60
    h = head + nrows * (ch + g) - g + leg
    def draw(y):
        s = ''
        for i, d in enumerate('MTWTFSS'):
            s += text(INTER_B, d, 26, M + i * (cw_ + g) + cw_ / 2, y + 26, th['body'], mode, anchor='middle')
        for day in range(1, days + 1):
            idx = first_weekday + day - 1; r, col = divmod(idx, 7)
            x = M + col * (cw_ + g); yy = y + head + r * (ch + g)
            fill, tc = (RED, WHITE) if day in blocked else (LIGHT_RED, NAVY) if day in booked else (FAINT_ON_DARK, MUTED_ON_DARK)
            s += f'<rect x="{x:.1f}" y="{yy:.1f}" width="{cw_:.1f}" height="{ch}" rx="14" fill="{fill}"/>'
            s += text(INTER_SB, str(day), 28, x + 18, yy + 38, tc, mode)
        ly = y + head + nrows * (ch + g) - g + 46
        x = M
        for fill, lab in ((RED, 'Days off, blocked'), (LIGHT_RED, 'Booked')):
            s += f'<rect x="{x}" y="{ly - 24:.1f}" width="28" height="28" rx="7" fill="{fill}"/>'
            s += text(INTER_SB, lab, 28, x + 44, ly, th['body'], mode)
            x += 44 + INTER_SB.width(lab, 28) + 50
        return s
    return h, draw

def g_tiles(F, th, mode, items):
    g = 24; w = (F.cw - g) / 2; h1 = 230
    rows = (len(items) + 1) // 2
    h = rows * h1 + (rows - 1) * g
    def draw(y):
        s = ''
        for i, (letter, lab) in enumerate(items):
            r, c_ = divmod(i, 2); x = M + c_ * (w + g); yy = y + r * (h1 + g)
            s += f'<rect x="{x:.1f}" y="{yy:.1f}" width="{w:.1f}" height="{h1}" rx="26" fill="{NAVY}"/>'
            s += text(LEX, letter, 84, x + 34, yy + 34 + 84 * 0.74, RED, mode)
            s += block(INTER_SB, lab, 34, x + 36, yy + 140, w - 70, WHITE, mode, 1.25)[0]
        return s
    return h, draw

def g_ladder(F, th, mode, items):
    rh, g = 86, 12
    h = len(items) * (rh + g) - g
    def draw(y):
        s = ''; n = len(items)
        for i, t in enumerate(items):
            w = F.cw * (0.42 + 0.58 * i / (n - 1))
            last = i == n - 1
            s += f'<rect x="{M}" y="{y:.1f}" width="{w:.1f}" height="{rh}" rx="16" fill="{RED if last else LIGHT_RED}"/>'
            s += text(INTER_SB, t, 36, M + 30, y + rh / 2 + 13, WHITE if last else NAVY, mode)
            y += rh + g
        return s
    return h, draw

def g_road(F, th, mode, h=430, sun=False, color=WHITE):
    def draw(y):
        cx = F.W / 2; top = y + (150 if sun else 20); bot = y + h
        s = ''
        if sun:
            s += f'<circle cx="{cx + 150:.1f}" cy="{top - 6:.1f}" r="96" fill="{RED}"/>'
            s += f'<rect x="{cx - 400:.1f}" y="{top:.1f}" width="800" height="110" fill="{NAVY}"/>'
            for k in range(1, 7):
                a = math.radians(-180 + k * 180 / 7)
                r0, r1 = 130, 175
                s += (f'<path d="M{cx + 150 + r0*math.cos(a):.1f} {top - 6 + r0*math.sin(a):.1f}L{cx + 150 + r1*math.cos(a):.1f} {top - 6 + r1*math.sin(a):.1f}" '
                      f'stroke="{RED}" stroke-width="10" stroke-linecap="round" opacity="0.7"/>')
            s += f'<path d="M{M} {top:.1f}H{F.W - M}" stroke="{color}" stroke-width="4" opacity="0.6"/>'
        vx = cx
        s += f'<path d="M{vx - 6:.1f} {top:.1f}L{cx - 330:.1f} {bot:.1f}M{vx + 6:.1f} {top:.1f}L{cx + 330:.1f} {bot:.1f}" stroke="{color}" stroke-width="5" stroke-linecap="round" fill="none"/>'
        # centre dashes shrinking into the distance
        t = 0.0
        for k in range(7):
            t0 = 1 - 0.62 ** k; t1 = 1 - 0.62 ** k * 0.55 if False else t0 + (1 - t0) * 0.22
            ya, yb = bot - (bot - top) * t0, bot - (bot - top) * t1
            wa = 10 * (1 - t0) + 1.5; 
            s += f'<path d="M{cx:.1f} {ya:.1f}L{cx:.1f} {yb:.1f}" stroke="{color}" stroke-width="{wa:.1f}" stroke-linecap="round"/>'
        return s
    return h, draw

def g_poppy(F, th, mode, r=82):
    h = r * 3.4
    def draw(y):
        cx, cy = F.W / 2, y + h / 2; o = r * 0.62
        s = ''
        for dx, dy, rr in ((0, -o, r), (-o, 0, r * 0.98), (o, 0, r * 0.98), (0, o, r * 1.02)):
            s += f'<circle cx="{cx + dx:.1f}" cy="{cy + dy:.1f}" r="{rr:.1f}" fill="{RED}"/>'
        s += f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r*0.36:.1f}" fill="#101020"/>'
        return s
    return h, draw

def g_fog(F, th, mode, s=260):
    """Rear fog light symbol, drawn in light lines (not a photo)."""
    h = s * 1.64
    def draw(y):
        cx, cy = F.W / 2, y + h / 2; u = s / 10
        col = LIGHT_RED; sw = u * 0.55
        lx = cx - 1.2 * u   # lamp flat side
        o = (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{s*0.82:.1f}" fill="{RED}" opacity="0.14"/>'
             f'<path d="M{lx:.1f} {cy - 2.6*u:.1f}C{lx - 4.6*u:.1f} {cy - 2.6*u:.1f} {lx - 4.6*u:.1f} {cy + 2.6*u:.1f} {lx:.1f} {cy + 2.6*u:.1f}Z" '
             f'fill="none" stroke="{col}" stroke-width="{sw:.1f}" stroke-linejoin="round"/>')
        for dy in (-1.7, 0, 1.7):
            o += f'<path d="M{lx + 0.9*u:.1f} {cy + dy*u:.1f}H{lx + 4.4*u:.1f}" stroke="{col}" stroke-width="{sw:.1f}" stroke-linecap="round"/>'
        wx = lx + 2.6 * u
        o += (f'<path d="M{wx:.1f} {cy - 3.2*u:.1f}c{-0.9*u:.1f} {0.8*u:.1f} {0.9*u:.1f} {1.6*u:.1f} 0 {2.4*u:.1f}'
              f's{0.9*u:.1f} {1.6*u:.1f} 0 {2.4*u:.1f}s{0.9*u:.1f} {1.6*u:.1f} 0 {1.6*u:.1f}" fill="none" stroke="{col}" stroke-width="{sw*0.8:.1f}" stroke-linecap="round"/>')
        return o
    return h, draw

GRAPHICS = dict(numlist=g_numlist, check=g_check, rows=g_rows, clock=g_clock, scorebar=g_scorebar, bars=g_bars,
                plans=g_plans, split=g_split, lines=g_lines, chips=g_chips, graph=g_graph, bubbles=g_bubbles,
                price=g_price, steps=g_steps, calendar=g_calendar, tiles=g_tiles, ladder=g_ladder, road=g_road,
                poppy=g_poppy, fog=g_fog, box=lambda F, th, mode, **kw: g_box(F, th, mode, **kw))


TEMPLATES = [('tip', tpl_tip), ('feature', tpl_feature), ('quote', tpl_quote),
             ('stat', tpl_stat), ('announcement', tpl_announce), ('mtd', tpl_mtd)]

def main():
    for d in ('png', 'svg'): os.makedirs(os.path.join(OUT, d), exist_ok=True)
    samples = {}
    for name, fn in TEMPLATES:
        for W, H in SIZES:
            for kind in ('bg', 'sample'):
                F = Frame(W, H); stem = f'{name}-{W}x{H}-{kind}'
                sm = kind == 'sample'
                open(os.path.join(OUT, 'svg', stem + '.svg'), 'w').write(svg_doc(W, H, fn(F, sm, 'edit'), css=True))
                p = os.path.join(OUT, 'png', stem + '.png')
                png(svg_doc(W, H, fn(F, sm, 'outline')), p, W, H)
                if sm: samples[(name, H)] = p
            print('built', name, f'{W}x{H}')
    contact_sheet(samples)

def contact_sheet(samples):
    sc = 0.3; gap = 36; lab = 70; pad = 50
    cols = [int(1080 * sc)] * 3
    row_h = int(1920 * sc)
    Wt = pad * 2 + sum(cols) + gap * 2
    Ht = pad * 2 + lab + len(TEMPLATES) * (row_h + gap)
    sheet = Image.new('RGB', (Wt, Ht), (236, 236, 242))
    d = ImageDraw.Draw(sheet)
    from PIL import ImageFont
    f1 = ImageFont.truetype(os.path.join(FONTS, 'Lexend-Bold.ttf'), 30)
    f2 = ImageFont.truetype(os.path.join(FONTS, 'Inter-SemiBold.ttf'), 20)
    d.text((pad, pad), 'DriveSchoolPro social templates (samples)', fill=NAVY, font=f1)
    for c, (W, H) in enumerate(SIZES):
        d.text((pad + c * (cols[0] + gap), pad + 44), f'{W}×{H}', fill=MUTED_ON_LIGHT, font=f2)
    for r, (name, _) in enumerate(TEMPLATES):
        y = pad + lab + r * (row_h + gap)
        for c, (W, H) in enumerate(SIZES):
            im = Image.open(samples[(name, H)]).convert('RGB')
            im = im.resize((int(W * sc), int(H * sc)), Image.LANCZOS)
            sheet.paste(im, (pad + c * (cols[0] + gap), y))
    sheet.save(os.path.join(OUT, 'contact-sheet.png'))
    print('contact sheet ok')

if __name__ == '__main__':
    main()
