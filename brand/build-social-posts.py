"""Render finished post images from the social templates.

    python3 brand/build-social-posts.py

Writes public/social/<post-id>.png (served at https://driveschoolpro.com/social/<post-id>.png so
Metricool's CSV import can fetch them) from the copy in POSTS below.
"""
import importlib.util, os
from brandlib import BRAND, svg_doc, png

spec = importlib.util.spec_from_file_location('tpl', os.path.join(BRAND, 'build-social-templates.py'))
tpl = importlib.util.module_from_spec(spec); spec.loader.exec_module(tpl)
OUT = os.path.join(BRAND, '..', 'public', 'social')

POSTS = {
    # November 2026 library (brand/social/november-2026.md)
    'n04': (tpl.tpl_mtd, 1350, {
        'headline': 'Quarterly update due Saturday 7 November',
        'body': 'For ADIs already on MTD (lesson income over £50,000). This update covers 6 April to 5 October.',
        'points': ['No penalty points this first tax year', 'Send it even if income was low', 'Most ADIs join from April 2027'],
    }),
    'n06': (tpl.tpl_announce, 1350, {
        'headline': 'Every feature. No card needed to start.',
        'band': 'Free until 31 March 2027',
        'body': 'Then free for ever (up to 60 lessons a month), or Solo at £22 a month. No VAT.',
    }),
}

def main():
    os.makedirs(OUT, exist_ok=True)
    for pid, (fn, H, copy) in POSTS.items():
        F = tpl.Frame(1080, H)
        png(svg_doc(1080, H, fn(F, copy, 'outline')), os.path.join(OUT, f'{pid}.png'), 1080, H)
        print('built', pid)

if __name__ == '__main__':
    main()
