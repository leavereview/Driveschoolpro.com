"""Build the DriveSchoolPro video kit.

    python3 brand/build-video-kit.py

Writes brand/video-kit/: intro/outro cards (1080x1920, 1920x1080), lower-third straps (transparent),
logo watermarks (transparent), a 9:16 safe-zone overlay and, if ffmpeg is on PATH, a 3-second
animated logo intro (MP4) in both orientations.
"""
import io, os, shutil, subprocess, tempfile
from PIL import Image, ImageFilter
import cairosvg
from brandlib import *

OUT = os.path.join(BRAND, 'video-kit')
LEX, INTER, INTER_SB = face('Lexend-Bold'), face('Inter-Regular'), face('Inter-SemiBold')
TAGLINE = 'Driving school software for UK instructors'

def render(svg_body, W, H):
    return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg_doc(W, H, svg_body).encode(),
                                                   output_width=W, output_height=H))).convert('RGBA')

def bg(W, H):
    r = min(W, H) * 0.62
    return (f'<rect width="{W}" height="{H}" fill="{NAVY}"/>'
            + ring(W * 0.5, H * 0.5, r, r * 0.16, FAINT_ON_DARK, FAINT_ON_DARK, done=N))

def lockup(W, H, mark_h, wm_size_h, gap, cy):
    """Mark above wordmark, centred on x, block centred on cy. Returns (svg, bottom_y)."""
    _, vw, vh = svg_inner('wordmark-reversed')
    wm_w = vw * wm_size_h / vh
    total = mark_h + gap + wm_size_h
    y0 = cy - total / 2
    m, _, _ = place('mark-ondark', (W - mark_h) / 2, y0, h=mark_h)
    w, _, _ = place('wordmark-reversed', (W - wm_w) / 2, y0 + mark_h + gap, h=wm_size_h)
    return m + w, y0 + total

# ------------------------------------------------------------------ cards
def intro(W, H):
    if H > W:
        s, bot = lockup(W, H, 360, 120, 70, H * 0.47)
        s += text(INTER, TAGLINE, 40, W / 2, bot + 90, MUTED_ON_DARK, 'outline', anchor='middle')
    else:
        lh = 150
        lw = logo_width(lh)
        s, _, _ = place('logo-horizontal-reversed', (W - lw) / 2, H * 0.44 - lh / 2, h=lh)
        s += text(INTER, TAGLINE, 44, W / 2, H * 0.44 + lh / 2 + 90, MUTED_ON_DARK, 'outline', anchor='middle')
    return bg(W, H) + s

def outro(W, H):
    if H > W:
        s, bot = lockup(W, H, 300, 104, 60, H * 0.40)
        s += text(LEX, 'Free until 31 March 2027', 72, W / 2, bot + 170, WHITE, 'outline', anchor='middle')
        bw = INTER_SB.width('driveschoolpro.com', 48) + 96
        y = bot + 230
        s += f'<rect x="{(W-bw)/2:.1f}" y="{y}" width="{bw:.1f}" height="96" rx="48" fill="{RED}"/>'
        s += text(INTER_SB, 'driveschoolpro.com', 48, W / 2, y + 48 + 17, WHITE, 'outline', anchor='middle')
        s += text(INTER, 'Start free, no card needed', 36, W / 2, y + 190, MUTED_ON_DARK, 'outline', anchor='middle')
    else:
        lh = 140; lw = logo_width(lh)
        s, _, _ = place('logo-horizontal-reversed', (W - lw) / 2, H * 0.36 - lh / 2, h=lh)
        line = 'Free until 31 March 2027 · driveschoolpro.com'
        s += text(LEX, line, 64, W / 2, H * 0.36 + lh / 2 + 130, WHITE, 'outline', anchor='middle')
        s += text(INTER, 'Start free, no card needed', 38, W / 2, H * 0.36 + lh / 2 + 210, MUTED_ON_DARK, 'outline', anchor='middle')
    return bg(W, H) + s

# ------------------------------------------------------------------ lower third
def strap(x, y, scale=1.0):
    name, role = 'John Powell', 'Founder, DriveSchoolPro'
    ns, rs = 56 * scale, 34 * scale
    pad = 40 * scale; mk = 92 * scale; h = 150 * scale
    tw = max(LEX.width(name, ns), INTER_SB.width(role, rs))
    w = pad + mk + 28 * scale + tw + pad + 10 * scale
    m, _, _ = place('mark-ondark', x + pad, y + (h - mk) / 2, h=mk)
    rr = f'x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{18*scale:.1f}"'
    return (f'<clipPath id="strapclip"><rect {rr}/></clipPath>'
            f'<rect {rr} fill="{NAVY}" fill-opacity="0.94"/>'
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{12*scale:.1f}" height="{h:.1f}" fill="{RED}" clip-path="url(#strapclip)"/>'
            + m
            + text(LEX, name, ns, x + pad + mk + 28 * scale, y + h * 0.48, WHITE, 'outline')
            + text(INTER_SB, role, rs, x + pad + mk + 28 * scale, y + h * 0.48 + rs * 1.45, MUTED_ON_DARK, 'outline')), w, h

def shadowed(img, radius=10, alpha=0.45, offset=(0, 4)):
    a = img.split()[-1]
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
    blk = Image.new('RGBA', img.size, (0, 0, 0, 255))
    sh.paste(blk, (0, 0), a.point(lambda v: int(v * alpha)))
    sh = sh.filter(ImageFilter.GaussianBlur(radius))
    out = Image.new('RGBA', img.size, (0, 0, 0, 0))
    out.alpha_composite(sh, offset)
    out.alpha_composite(img)
    return out

# ------------------------------------------------------------------ safe zones
def safe_overlay():
    W, H = 1080, 1920
    z = 'fill="#E94560" fill-opacity="0.28"'
    s = (f'<rect width="{W}" height="250" {z}/>'
         f'<rect y="{H-340}" width="{W}" height="340" {z}/>'
         f'<rect x="{W-140}" y="250" width="140" height="{H-590}" {z}/>'
         f'<rect x="60" y="250" width="{W-200}" height="{H-590}" fill="none" stroke="{RED}" stroke-width="4" stroke-dasharray="18 12"/>'
         f'<rect x="60" y="1300" width="{W-200}" height="240" fill="#FFFFFF" fill-opacity="0.18" stroke="#FFFFFF" stroke-width="3"/>')
    s += text(INTER_SB, 'Top 250px: account name, progress bar', 30, W / 2, 140, WHITE, 'outline', anchor='middle')
    s += text(INTER_SB, 'Bottom 340px: caption, music, reply bar', 30, W / 2, H - 170, WHITE, 'outline', anchor='middle')
    s += text(INTER_SB, 'Captions here (y 1300-1540)', 30, 60 + (W - 200) / 2, 1430, WHITE, 'outline', anchor='middle')
    s += f'<g transform="translate({W-70} {H/2}) rotate(-90)">' + text(INTER_SB, 'Right 140px: like / comment / share', 28, 0, 10, WHITE, 'outline', anchor='middle') + '</g>'
    return render(s, W, H)

# ------------------------------------------------------------------ animation
def ease(t): t = max(0.0, min(1.0, t)); return 1 - (1 - t) ** 3

def anim_frame(W, H, t):
    """t in seconds, 0..3."""
    portrait = H > W
    mark_h = 380 if portrait else 340
    cx = W / 2
    cy = H * (0.44 if portrait else 0.42)
    s = f'<rect width="{W}" height="{H}" fill="{NAVY}"/>'
    sc = mark_h / 128
    # 27 segments fade in (0-0.45s), then 19 fill red one by one (0.35-1.45s)
    off_op = ease(t / 0.45)
    filled = int(max(0, min(DONE, (t - 0.35) / 1.1 * DONE + 0.0001)))
    g = ring(64, 64, 52, 14, RED, OFF_DARK, done=filled)
    pop = 0.92 + 0.08 * ease(t / 0.6)
    s += (f'<g opacity="{off_op:.3f}" transform="translate({cx} {cy}) scale({sc*pop:.4f}) translate(-64 -64)">{g}')
    # tick draws 1.45-1.85s
    L = 52.4
    k = ease((t - 1.45) / 0.4)
    if k > 0:
        s += (f'<g transform="translate(64 64) scale(1.15) translate(-64 -64)"><path d="M47 65l12 12 24-26" fill="none" '
              f'stroke="{WHITE}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" '
              f'stroke-dasharray="{L:.1f} {L:.1f}" stroke-dashoffset="{L*(1-k):.2f}"/></g>')
    s += '</g>'
    # wordmark fades + rises 1.8-2.4s
    w = ease((t - 1.8) / 0.6)
    if w > 0:
        wh = 110 if portrait else 96
        _, vw, vh = svg_inner('wordmark-reversed'); ww = vw * wh / vh
        y = cy + mark_h / 2 + (70 if portrait else 50) + (1 - w) * 40
        m, _, _ = place('wordmark-reversed', cx - ww / 2, y, h=wh, opacity=round(w, 3))
        s += m
        if portrait:
            s += f'<g opacity="{w:.3f}">' + text(INTER, TAGLINE, 40, cx, y + wh + 90, MUTED_ON_DARK, 'outline', anchor='middle') + '</g>'
    return svg_doc(W, H, s)

def build_anim(W, H, path, fps=30, secs=3.0):
    tmp = tempfile.mkdtemp()
    try:
        for i in range(int(fps * secs)):
            cairosvg.svg2png(bytestring=anim_frame(W, H, i / fps).encode(), write_to=f'{tmp}/f{i:03d}.png',
                             output_width=W, output_height=H)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', f'{tmp}/f%03d.png',
                        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow',
                        '-movflags', '+faststart', path], check=True)
    finally:
        shutil.rmtree(tmp)

def main():
    os.makedirs(OUT, exist_ok=True)
    for W, H in [(1080, 1920), (1920, 1080)]:
        render(intro(W, H), W, H).convert('RGB').save(f'{OUT}/intro-{W}x{H}.png')
        render(outro(W, H), W, H).convert('RGB').save(f'{OUT}/outro-{W}x{H}.png')
    # lower thirds: full-frame overlays (drop on top of the whole video) + tight strap
    s, w, h = strap(96, 1080 - 150 - 110)
    render(s, 1920, 1080).save(f'{OUT}/lower-third-1920x1080.png')
    s, w, h = strap(60, 1120, scale=0.92)
    render(s, 1080, 1920).save(f'{OUT}/lower-third-1080x1920.png')
    s, w, h = strap(0, 0)
    render(s, int(w + 1), int(h + 1)).save(f'{OUT}/lower-third-strap.png')
    # watermarks (transparent, soft shadow so they read on light footage)
    for name, src, ww in [('watermark-mark-400', 'mark-ondark', 400), ('watermark-logo-800', 'logo-horizontal-reversed', 800)]:
        _, vw, vh = svg_inner(src)
        hh = round(ww * vh / vw)
        pad = 24
        m, _, _ = place(src, pad, pad, w=ww)
        img = render(m, ww + 2 * pad, hh + 2 * pad)
        shadowed(img).save(f'{OUT}/{name}.png')
    safe_overlay().save(f'{OUT}/safe-zones-1080x1920.png')
    if shutil.which('ffmpeg'):
        build_anim(1080, 1920, f'{OUT}/logo-intro-1080x1920.mp4')
        build_anim(1920, 1080, f'{OUT}/logo-intro-1920x1080.mp4')
        print('animated intro ok')
    else:
        print('ffmpeg not found: skipped animated intro')
    print('video kit ok')

if __name__ == '__main__':
    main()
