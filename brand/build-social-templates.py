"""Build the DriveSchoolPro social post templates.

    python3 brand/build-social-templates.py

Writes brand/social-templates/{png,svg}/<type>-<WxH>-{bg,sample}.{png,svg} and contact-sheet.png.
Templates take sample=True (placeholder copy) or a dict of real copy (see build-social-posts.py).
  -bg      no placeholder copy: background, label, decoration, logo footer (upload to Canva/Metricool)
  -sample  same plus placeholder copy ("Headline goes here") showing where text goes and how big
PNGs are rendered from outlined text (exact). SVGs keep text as editable <text> (Lexend / Inter).

Needs: pip install --user cairosvg uharfbuzz fonttools pillow  (and brew cairo)
"""
import os
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

def footer(F, mode, dark):
    rule = OFF_DARK if dark else OFF_LIGHT
    logo, lw, _ = place('logo-horizontal-reversed' if dark else 'logo-horizontal', M, F.bottom - LOGO_H, h=LOGO_H)
    base = F.bottom - LOGO_H + LOGO_H * 62 / 80   # wordmark baseline inside the logo
    url = text(INTER_SB, 'driveschoolpro.com', 28, F.W - M, base, MUTED_ON_DARK if dark else MUTED_ON_LIGHT,
               mode, anchor='end', ident='url')
    return f'<rect x="{M}" y="{F.divider}" width="{F.cw}" height="2" fill="{rule}"/>' + logo + url

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

def phone(x, y, w, sample, mode):
    h = w * 2.05; bz = w * 0.04; rx = w * 0.16
    s = (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx:.1f}" fill="{NAVY}"/>'
         f'<rect x="{x+bz:.1f}" y="{y+bz:.1f}" width="{w-2*bz:.1f}" height="{h-2*bz:.1f}" rx="{rx-bz:.1f}" fill="{SCREEN}"/>'
         f'<rect x="{x+w*0.36:.1f}" y="{y+bz+w*0.035:.1f}" width="{w*0.28:.1f}" height="{w*0.075:.1f}" rx="{w*0.0375:.1f}" fill="{NAVY}"/>')
    if sample:
        cx, cy = x + w / 2, y + h / 2
        sw, sh = w - 2 * bz - 60, h * 0.5
        s += (f'<rect x="{cx-sw/2:.1f}" y="{cy-sh/2:.1f}" width="{sw:.1f}" height="{sh:.1f}" rx="16" fill="none" '
              f'stroke="{OFF_LIGHT}" stroke-width="3" stroke-dasharray="12 10"/>')
        s += text(INTER_SB, 'Screenshot', 28, cx, cy - 4, MUTED_ON_LIGHT, mode, anchor='middle')
        s += text(INTER, 'goes here', 28, cx, cy + 34, MUTED_ON_LIGHT, mode, anchor='middle')
    return s, h

def tpl_feature(F, sample, mode):
    W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{WHITE}"/>'
    b += pill(F, 'HOW TO', mode, NAVY, WHITE)
    if F.story:
        # headline full width on top, phone centred underneath
        hs = 80
        head_h = block_height(LEX, 'Headline goes here in two lines', hs, F.cw, 1.12)
        ph_top = F.content_top + head_h + 150
        pw = min(440, (F.content_bottom - ph_top) / 2.05)
        px = (W - pw) / 2
        b += f'<circle cx="{W/2}" cy="{ph_top + pw*1.025:.1f}" r="{pw*0.95:.1f}" fill="{LIGHT_RED}"/>'
        ps, _ = phone(px, ph_top, pw, sample, mode); b += ps
        if sample:
            b += block(LEX, 'Headline goes here in two lines', hs, M, F.content_top, F.cw, NAVY, mode, 1.12, ident='headline')[0]
            b += block(INTER, 'One line of supporting text goes here', 36, M, F.content_top + head_h + 36, F.cw, MUTED_ON_LIGHT, mode, 1.35, ident='body')[0]
    else:
        pw = F.by(370, 440, 0)
        ph = pw * 2.05
        px = W - M - pw
        py = F.content_top - 56 + (F.divider - 40 - (F.content_top - 56) - ph) / 2
        b += f'<circle cx="{px + pw/2:.1f}" cy="{py + ph/2:.1f}" r="{pw*0.78:.1f}" fill="{LIGHT_RED}"/>'
        ps, _ = phone(px, py, pw, sample, mode); b += ps
        if sample:
            colw = px - M - 50
            hs = F.by(60, 62, 0)
            items = [item(36, *tb(LEX, 'Headline goes here', hs, colw, NAVY, mode, 1.12, ident='headline'))]
            for i, st in enumerate(['Step one goes here', 'Step two goes here', 'Step three goes here']):
                def fn(y, i=i, st=st):
                    cx, cy = M + 24, y + 24
                    return (f'<circle cx="{cx}" cy="{cy:.1f}" r="24" fill="{RED}"/>'
                            + text(INTER_B, str(i + 1), 26, cx, cy + 9.5, WHITE, mode, anchor='middle')
                            + block(INTER, st, 30, M + 68, cy - 11.2, colw - 68, NAVY, mode, 1.3)[0])
                h = max(48, block_height(INTER, st, 30, colw - 68, 1.3) + 2)
                items.append((h, 26, fn))
            b += stack(F, items, F.content_top, F.content_bottom)
    return b + footer(F, mode, False)

def tpl_quote(F, sample, mode):
    W, H = F.W, F.H
    b = f'<rect width="{W}" height="{H}" fill="{WHITE}"/>'
    b += f'<rect x="0" y="0" width="{W}" height="{F.by(16, 16, 16)}" fill="{RED}"/>' if not F.story else ''
    qr = F.by(220, 260, 300)
    b += ring(W - 30, F.divider - qr - 40, qr, F.by(44, 50, 56), FAINT_ON_WHITE, FAINT_ON_WHITE, done=N)
    b += pill(F, 'INSTRUCTOR STORY', mode, NAVY, WHITE)
    qs = F.by(300, 340, 380)
    qy = F.content_top - 20 + qs * 0.72
    b += text(LEX, '“', qs, M - 12, qy, RED, 'outline')      # decorative, always outlined
    if sample:
        qt = F.content_top - 20 + qs * 0.5
        quote = 'Quote goes here. Two or three short sentences, in the instructor’s own words.'
        fs = F.by(54, 60, 64)
        def attrib(y):
            cx, cy, r = M + 48, y + 48, 48
            return (ring(cx, cy, 56, 6, RED, OFF_LIGHT, gap=5)
                    + f'<circle cx="{cx}" cy="{cy}" r="{r-4}" fill="{LIGHT_RED}"/>'
                    + text(INTER_B, 'Name Surname', 34, M + 136, cy - 6, NAVY, mode, ident='name')
                    + text(INTER, 'Driving school name, Town', 28, M + 136, cy + 34, MUTED_ON_LIGHT, mode, ident='business'))
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
    b += pill(F, 'BY THE NUMBERS', mode, RED, WHITE)
    if sample:
        ns = F.by(320, 360, 400)
        def num(y):
            return text(LEX, '27', ns, M - ns * 0.04, y + ns * 0.72, RED, mode, ident='number')
        b += stack(F, [
            (ns * 0.74, F.by(40, 50, 60), num),
            item(40, *accent()),
            item(28, *tb(LEX, 'Caption goes here: what the number means', F.by(60, 66, 70), F.cw, WHITE, mode, 1.14, ident='caption')),
            item(0, *tb(INTER, 'Source or small print goes here', 28, F.cw, MUTED_ON_DARK, mode, 1.4, ident='source')),
        ], F.content_top, F.content_bottom)
    return b + footer(F, mode, True)

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
        b += stack(F, items, F.content_top, F.content_bottom)
    return b + footer(F, mode, False)

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
