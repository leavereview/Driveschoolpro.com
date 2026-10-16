import math, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
SP=sys.argv[1]; OUT=f'{SP}/kit'
NAVY="#1A1A2E"; RED="#E94560"; OFF_DARK="#3A3A55"; OFF_LIGHT="#D9D9E3"; WHITE="#FFFFFF"
N=27; DONE=19

def ring(cx,cy,r,w,on,off,gap=3.2,n=N,done=DONE):
    out=[]
    for i in range(n):
        a0=-90+i*360/n+gap/2; a1=-90+(i+1)*360/n-gap/2
        p=lambda a:(cx+r*math.cos(math.radians(a)), cy+r*math.sin(math.radians(a)))
        (x0,y0),(x1,y1)=p(a0),p(a1)
        out.append(f'<path d="M{x0:.2f} {y0:.2f}A{r} {r} 0 0 1 {x1:.2f} {y1:.2f}" stroke="{on if i<done else off}" stroke-width="{w}" fill="none"/>')
    return ''.join(out)
def arc_simple(cx,cy,r,w,on,off,frac=DONE/N):
    # continuous arc for tiny sizes
    a1=-90+360*frac
    p=lambda a:(cx+r*math.cos(math.radians(a)), cy+r*math.sin(math.radians(a)))
    (x0,y0),(x1,y1)=p(-90),p(a1)
    large=1 if frac>0.5 else 0
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke="{off}" stroke-width="{w}" fill="none"/>'
            f'<path d="M{x0:.2f} {y0:.2f}A{r} {r} 0 {large} 1 {x1:.2f} {y1:.2f}" stroke="{on}" stroke-width="{w}" fill="none" stroke-linecap="butt"/>')
TICK='<path d="M47 65l12 12 24-26" fill="none" stroke="{c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'
TICK_BOLD='<path d="M45 65l13 13 26-28" fill="none" stroke="{c}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>'

def svg(vb,body,w=None,h=None):
    wh=f' width="{w}" height="{h}"' if w else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{wh}>{body}</svg>\n'

marks={
 # app icon / primary: navy tile
 'mark-tile': svg("0 0 128 128", f'<rect width="128" height="128" rx="28" fill="{NAVY}"/>'+ring(64,64,44,12,RED,OFF_DARK)+TICK.format(c=WHITE)),
 # full-bleed square for app stores (platform rounds corners)
 'mark-square': svg("0 0 128 128", f'<rect width="128" height="128" fill="{NAVY}"/>'+ring(64,64,42,11,RED,OFF_DARK)+TICK.format(c=WHITE)),
 # circle avatar safe (social profile crops to circle)
 'mark-avatar': svg("0 0 128 128", f'<rect width="128" height="128" fill="{NAVY}"/>'+ring(64,64,36,10,RED,OFF_DARK)+'<g transform="translate(64 64) scale(0.82) translate(-64 -64)">'+TICK.format(c=WHITE)+'</g>'),
 # no tile, for light backgrounds
 'mark-onlight': svg("0 0 128 128", ring(64,64,52,14,RED,OFF_LIGHT)+'<g transform="translate(64 64) scale(1.15) translate(-64 -64)">'+TICK.format(c=NAVY)+'</g>'),
 # no tile, for dark backgrounds
 'mark-ondark': svg("0 0 128 128", ring(64,64,52,14,RED,OFF_DARK)+'<g transform="translate(64 64) scale(1.15) translate(-64 -64)">'+TICK.format(c=WHITE)+'</g>'),
 # one colour
 'mark-mono-navy': svg("0 0 128 128", ring(64,64,52,14,NAVY,NAVY,n=N,done=N)+'<g transform="translate(64 64) scale(1.15) translate(-64 -64)">'+TICK.format(c=NAVY)+'</g>'),
 'mark-mono-white': svg("0 0 128 128", ring(64,64,52,14,WHITE,WHITE,n=N,done=N)+'<g transform="translate(64 64) scale(1.15) translate(-64 -64)">'+TICK.format(c=WHITE)+'</g>'),
 # favicon: simplified continuous arc, bold tick (reads at 16px)
 'favicon': svg("0 0 128 128", f'<rect width="128" height="128" rx="28" fill="{NAVY}"/>'+arc_simple(64,64,42,16,RED,OFF_DARK)+TICK_BOLD.format(c=WHITE)),
}
for k,v in marks.items(): open(f'{OUT}/{k}.svg','w').write(v)

# --- wordmark outlined from Lexend Bold ---
vf=TTFont(f'{SP}/fontdl/Lexend-var.ttf')
f=instancer.instantiateVariableFont(vf,{"wght":700})
gs=f.getGlyphSet(); cmap=f.getBestCmap(); hmtx=f['hmtx']; upm=f['head'].unitsPerEm
def text_paths(txt, size, x0, baseline, color, tracking=-0.01):
    s=size/upm; x=x0; parts=[]
    for ch in txt:
        g=cmap[ord(ch)]
        pen=SVGPathPen(gs)
        tp=TransformPen(pen,(s,0,0,-s,x,baseline))
        gs[g].draw(tp)
        d=pen.getCommands()
        if d: parts.append(f'<path d="{d}" fill="{color}"/>')
        x+=hmtx[g][0]*s + tracking*size
    return ''.join(parts), x
def wordmark(c1,c2,size=56,x0=0,baseline=56):
    a,x=text_paths("DriveSchool",size,x0,baseline,c1)
    b,x=text_paths("Pro",size,x,baseline,c2)
    return a+b, x
# horizontal lockups
for name,mk,c1 in [('logo-horizontal',marks['mark-onlight'],NAVY),('logo-horizontal-reversed',marks['mark-ondark'],WHITE)]:
    inner=mk.split('>',1)[1].rsplit('</svg>',1)[0]
    wm,xend=wordmark(c1,RED,size=56,x0=96,baseline=62)
    W=math.ceil(xend+4)
    body=f'<g transform="translate(4 0) scale(0.625)">{inner}</g>'+wm
    open(f'{OUT}/{name}.svg','w').write(svg(f"0 0 {W} 80",body))
# wordmark only
wm,xend=wordmark(NAVY,RED,size=56,x0=0,baseline=56)
open(f'{OUT}/wordmark.svg','w').write(svg(f"0 0 {math.ceil(xend+2)} 72",wm))
wm,xend=wordmark(WHITE,RED,size=56,x0=0,baseline=56)
open(f'{OUT}/wordmark-reversed.svg','w').write(svg(f"0 0 {math.ceil(xend+2)} 72",wm))
# stacked
inner=marks['mark-onlight'].split('>',1)[1].rsplit('</svg>',1)[0]
wm,xend=wordmark(NAVY,RED,size=44,x0=0,baseline=0)
W=math.ceil(xend)
body=f'<g transform="translate({(max(W,128)-128)/2} 0)">{inner}</g><g transform="translate({(max(W,128)-W)/2} 182)">{wm}</g>'
open(f'{OUT}/logo-stacked.svg','w').write(svg(f"0 0 {max(W,128)} 200",body))

# --- social banners (SVG -> PNG later) ---
def banner(w,h,tag,sub,safe_h):
    # Centred block sized to the platform's safe area (safe_h = usable height), so crops never cut it.
    inner=marks['mark-ondark'].split('>',1)[1].rsplit('</svg>',1)[0]
    m=safe_h*0.62
    wm,wx=wordmark(WHITE,RED,size=safe_h*0.2,x0=0,baseline=0)
    tagp,tx_=text_paths(tag,safe_h*0.095,0,0,"#C9C9DA",tracking=0)
    subp,sx_=text_paths(sub,safe_h*0.08,0,0,RED,tracking=0)
    gap=safe_h*0.12
    tw=max(wx,tx_,sx_); total=m+gap+tw
    x0=(w-total)/2; cy=h/2
    tx=x0+m+gap
    return svg(f"0 0 {w} {h}", f'<rect width="{w}" height="{h}" fill="{NAVY}"/>'
        +ring(w*0.5+total*0.5+safe_h*1.1,h*0.5,safe_h*0.9,safe_h*0.1,"#22223A","#22223A",n=N,done=N)
        +ring(w*0.5-total*0.5-safe_h*1.1,h*0.5,safe_h*0.9,safe_h*0.1,"#22223A","#22223A",n=N,done=N)
        +f'<g transform="translate({x0} {cy-m/2}) scale({m/128})">{inner}</g>'
        +f'<g transform="translate({tx} {cy-safe_h*0.06})">{wm}</g>'
        +f'<g transform="translate({tx} {cy+safe_h*0.11})">{tagp}</g>'
        +f'<g transform="translate({tx} {cy+safe_h*0.25})">{subp}</g>', w, h)
banners={
 'banner-linkedin-1128x191': (1128,191,150),
 'banner-facebook-1640x624': (1640,624,330),
 'banner-youtube-2560x1440': (2560,1440,330),
 'banner-og-1200x630': (1200,630,360),
}
for k,(w,h,ms) in banners.items():
    open(f'{OUT}/{k}.svg','w').write(banner(w,h,"Driving school software for UK instructors","Free until 31 March 2027",ms))
print('ok')
