"""Shared helpers for the DriveSchoolPro social templates and video kit.

Fonts come from brand/fonts (Lexend and Inter variable fonts from github.com/google/fonts, OFL).
Static instances (Lexend-Bold.ttf, Inter-*.ttf) are generated next to them on first run so they
can be installed on a Mac or uploaded to Canva / CapCut.

Text is shaped with HarfBuzz (kerning included) and either outlined to SVG paths (for PNG
rendering, no font needed) or written as editable <text> elements (for the editable SVGs).
The logo is reused verbatim from brand/svg (built by build-brand-kit.py).
"""
import math, os, re
from xml.sax.saxutils import escape
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb
import cairosvg

BRAND = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(BRAND, 'fonts')

NAVY = "#1A1A2E"; RED = "#E94560"; LIGHT_RED = "#FFE7EC"; WHITE = "#FFFFFF"
OFF_DARK = "#3A3A55"; OFF_LIGHT = "#D9D9E3"
MUTED_ON_DARK = "#C9C9DA"; MUTED_ON_LIGHT = "#55556E"
FAINT_ON_DARK = "#22223A"; FAINT_ON_WHITE = "#F3F3F7"; FAINT_ON_PINK = "#FCD7DF"
SCREEN = "#ECECF2"
N = 27; DONE = 19

# ---------------------------------------------------------------- fonts
STATIC = {
    # name: (variable file, axes, family, css weight)
    'Lexend-Bold':    ('Lexend[wght].ttf',     {'wght': 700},             'Lexend', 700),
    'Inter-Regular':  ('Inter[opsz,wght].ttf', {'wght': 400, 'opsz': 14}, 'Inter', 400),
    'Inter-SemiBold': ('Inter[opsz,wght].ttf', {'wght': 600, 'opsz': 14}, 'Inter', 600),
    'Inter-Bold':     ('Inter[opsz,wght].ttf', {'wght': 700, 'opsz': 14}, 'Inter', 700),
}

def ensure_static_fonts():
    for name, (src, axes, _, _) in STATIC.items():
        out = os.path.join(FONTS, f'{name}.ttf')
        if os.path.exists(out):
            continue
        vf = TTFont(os.path.join(FONTS, src))
        try:
            f = instancer.instantiateVariableFont(vf, axes, updateFontNames=True)
        except Exception:
            vf = TTFont(os.path.join(FONTS, src))
            f = instancer.instantiateVariableFont(vf, axes)
        f.save(out)

class Face:
    def __init__(self, name):
        ensure_static_fonts()
        path = os.path.join(FONTS, f'{name}.ttf')
        self.tt = TTFont(path)
        self.gs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.upm = self.tt['head'].unitsPerEm
        self.family, self.weight = STATIC[name][2], STATIC[name][3]
        blob = hb.Blob.from_file_path(path)
        self.hbfont = hb.Font(hb.Face(blob))

    def shape(self, txt):
        buf = hb.Buffer(); buf.add_str(txt); buf.guess_segment_properties()
        hb.shape(self.hbfont, buf, {"kern": True, "liga": True})
        return [(i.codepoint, p.x_advance, p.x_offset, p.y_offset)
                for i, p in zip(buf.glyph_infos, buf.glyph_positions)]

    def width(self, txt, size, tracking=0.0):
        s = size / self.upm
        g = self.shape(txt)
        return sum(a for _, a, _, _ in g) * s + tracking * size * max(len(g) - 1, 0)

    def paths(self, txt, size, x, baseline, tracking=0.0):
        s = size / self.upm; out = []
        for gid, adv, xo, yo in self.shape(txt):
            pen = SVGPathPen(self.gs)
            self.gs[self.order[gid]].draw(TransformPen(pen, (s, 0, 0, -s, x + xo * s, baseline - yo * s)))
            d = pen.getCommands()
            if d: out.append(d)
            x += adv * s + tracking * size
        return ' '.join(out)

_faces = {}
def face(name):
    if name not in _faces: _faces[name] = Face(name)
    return _faces[name]

def wrap(fc, txt, size, maxw, tracking=0.0):
    lines = []
    for para in txt.split('\n'):
        cur = ''
        for w in para.split(' '):
            t = (cur + ' ' + w).strip()
            if cur and fc.width(t, size, tracking) > maxw:
                lines.append(cur); cur = w
            else:
                cur = t
        lines.append(cur)
    return lines

# ---------------------------------------------------------------- text output
def text(fc, txt, size, x, y, color, mode, anchor='start', tracking=0.0, ident=None, opacity=None):
    """One line. mode='outline' -> <path>, mode='edit' -> <text>. y is the baseline."""
    w = fc.width(txt, size, tracking)
    x0 = x - w / 2 if anchor == 'middle' else x - w if anchor == 'end' else x
    op = f' opacity="{opacity}"' if opacity is not None else ''
    if mode == 'outline':
        return f'<path d="{fc.paths(txt, size, x0, y, tracking)}" fill="{color}"{op}/>'
    idt = f' id="{ident}"' if ident else ''
    ls = f' letter-spacing="{tracking * size:.2f}"' if tracking else ''
    return (f'<text{idt} x="{x:.1f}" y="{y:.1f}" font-family="{fc.family}, sans-serif" font-weight="{fc.weight}" '
            f'font-size="{size}" fill="{color}" text-anchor="{anchor}"{ls}{op}>{escape(txt)}</text>')

def block(fc, txt, size, x, y_top, maxw, color, mode, lh=1.2, anchor='start', tracking=0.0, ident=None):
    """Wrapped paragraph whose first line's cap-top sits roughly at y_top. Returns (svg, bottom_y, lines)."""
    lines = wrap(fc, txt, size, maxw, tracking)
    asc = size * 0.74  # cap height-ish of Lexend/Inter
    parts = []
    if mode == 'edit':
        idt = f' id="{ident}"' if ident else ''
        ls = f' letter-spacing="{tracking * size:.2f}"' if tracking else ''
        tsp = ''.join(f'<tspan x="{x:.1f}" y="{y_top + asc + i * size * lh:.1f}">{escape(l)}</tspan>' for i, l in enumerate(lines))
        parts.append(f'<text{idt} font-family="{fc.family}, sans-serif" font-weight="{fc.weight}" font-size="{size}" '
                     f'fill="{color}" text-anchor="{anchor}"{ls}>{tsp}</text>')
    else:
        for i, l in enumerate(lines):
            parts.append(text(fc, l, size, x, y_top + asc + i * size * lh, color, mode, anchor, tracking))
    bottom = y_top + asc + (len(lines) - 1) * size * lh + size * 0.26
    return ''.join(parts), bottom, lines

def block_height(fc, txt, size, maxw, lh=1.2, tracking=0.0):
    n = len(wrap(fc, txt, size, maxw, tracking))
    return size * 0.74 + (n - 1) * size * lh + size * 0.26

# ---------------------------------------------------------------- logo + ring
def ring(cx, cy, r, w, on, off, gap=3.2, n=N, done=DONE, opacity=None):
    out = []
    op = f' opacity="{opacity}"' if opacity is not None else ''
    for i in range(n):
        a0 = -90 + i * 360 / n + gap / 2; a1 = -90 + (i + 1) * 360 / n - gap / 2
        p = lambda a: (cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
        (x0, y0), (x1, y1) = p(a0), p(a1)
        out.append(f'<path d="M{x0:.2f} {y0:.2f}A{r} {r} 0 0 1 {x1:.2f} {y1:.2f}" stroke="{on if i < done else off}" '
                   f'stroke-width="{w}" fill="none"{op}/>')
    return ''.join(out)

_svgcache = {}
def svg_inner(name):
    """(inner markup, vb_w, vb_h) of brand/svg/<name>.svg."""
    if name not in _svgcache:
        s = open(os.path.join(BRAND, 'svg', f'{name}.svg')).read()
        vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', s)
        inner = s.split('>', 1)[1].rsplit('</svg>', 1)[0]
        _svgcache[name] = (inner, float(vb.group(1)), float(vb.group(2)))
    return _svgcache[name]

def place(name, x, y, h=None, w=None, opacity=None):
    inner, vw, vh = svg_inner(name)
    s = h / vh if h else w / vw
    op = f' opacity="{opacity}"' if opacity is not None else ''
    return f'<g transform="translate({x:.2f} {y:.2f}) scale({s:.5f})"{op}>{inner}</g>', vw * s, vh * s

def logo_width(h):
    _, vw, vh = svg_inner('logo-horizontal'); return vw * h / vh

# ---------------------------------------------------------------- output
FONT_CSS = ('<style>@font-face{font-family:Lexend;font-weight:700;src:url(../../fonts/Lexend-Bold.ttf)}'
            '@font-face{font-family:Inter;font-weight:400;src:url(../../fonts/Inter-Regular.ttf)}'
            '@font-face{font-family:Inter;font-weight:600;src:url(../../fonts/Inter-SemiBold.ttf)}'
            '@font-face{font-family:Inter;font-weight:700;src:url(../../fonts/Inter-Bold.ttf)}</style>')

def svg_doc(w, h, body, css=False):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            + (FONT_CSS if css else '') + body + '</svg>\n')

def png(svg_str, path, w, h):
    cairosvg.svg2png(bytestring=svg_str.encode(), write_to=path, output_width=w, output_height=h)
