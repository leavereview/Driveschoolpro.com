"""Render finished post images from the social templates.

    python3 brand/build-social-posts.py            # all posts
    python3 brand/build-social-posts.py n02 n13    # just these

Writes public/social/<id>.png (single image) or public/social/<id>-<k>.png (carousel slide k), served at
https://driveschoolpro.com/social/... so Metricool's CSV import can fetch them. Also writes
brand/social/november-contact-sheet.png and brand/social/metricool/november-images.json (URLs + alt text).

Copy comes from brand/social/november-2026.md. POSTS maps a post id to a list of slides; each slide is
(template, copy dict, alt text). For carousels the builder adds page=(k, n) so the footer shows a
27-segment progress ring and "k / n" (the last slide keeps the URL).
All feed images are 1080 x 1350.
"""
import importlib.util, json, os, sys
from brandlib import BRAND, FONTS, NAVY, MUTED_ON_LIGHT, svg_doc, png

spec = importlib.util.spec_from_file_location('tpl', os.path.join(BRAND, 'build-social-templates.py'))
tpl = importlib.util.module_from_spec(spec); spec.loader.exec_module(tpl)
OUT = os.path.join(BRAND, '..', 'public', 'social')
URL = 'https://driveschoolpro.com/social/'
W, H = 1080, 1350
RED = tpl.RED

TIP, SLIDE, STAT, QUIET, MTD, NEWS = tpl.tpl_tip, tpl.tpl_slide, tpl.tpl_stat, tpl.tpl_quiet, tpl.tpl_mtd, tpl.tpl_announce
NOT_ADVICE = 'This isn’t tax advice. DriveSchoolPro isn’t MTD software.'

POSTS = {
    # ---------------------------------------------------------------- week 1
    'n02': [
        (TIP, dict(ring=True, headline='First lesson in the dark?', hs=104, sub='6 things to do this week',
                   body='The clocks went back on 25 October. For some pupils, this week is their first lesson after dark.'),
         'First lesson in the dark? 6 things to do this week, now the clocks have gone back.'),
        (TIP, dict(label=None, number='1', headline='Tell them in advance',
                   body='“Tonight we’ll be driving in the dark” lets them come ready, not anxious.'),
         'Tip 1: tell them in advance, so they come ready, not anxious.'),
        (TIP, dict(label=None, number='2', headline='Start on a route they already know',
                   body='New roads and darkness at once is too much.'),
         'Tip 2: start on a route they already know, because new roads and darkness at once is too much.'),
        (TIP, dict(label=None, number='3', headline='Do a lights check together',
                   body='Before moving off: dipped beam, main beam and the warning light, rear lights.'),
         'Tip 3: do a lights check together before moving off: dipped beam, main beam and the warning light, rear lights.'),
        (TIP, dict(label=None, number='4', headline='Give their eyes time to adjust',
                   body='Allow a couple of minutes, and talk about not staring at oncoming headlights.'),
         'Tip 4: give their eyes a couple of minutes to adjust, and talk about not staring at oncoming headlights.'),
        (TIP, dict(label=None, align='center', graphic=('numlist', dict(items=[
                        ('5', 'Point out people early', 'Pedestrians and cyclists are much harder to spot after dark.'),
                        ('6', 'Talk about how it felt', 'Leave time for it at the end of the lesson.')])),
                   cta=('Driving in the dark is DVSA skill 24', 'Night driving guide at driveschoolpro.com')),
         'Tips 5 and 6: point out pedestrians and cyclists early, and leave time to talk about how it felt; driving in the dark is DVSA skill 24.'),
    ],
    'n04': [
        (MTD, {
            'headline': 'Quarterly update due Saturday 7 November',
            'body': 'For ADIs already on MTD (lesson income over £50,000). This update covers 6 April to 5 October.',
            'points': ['No penalty points this first tax year', 'Send it even if income was low', 'Most ADIs join from April 2027'],
            'source': NOT_ADVICE,
        }, 'Making Tax Digital: quarterly update due Saturday 7 November, for ADIs already on MTD with lesson income over £50,000.'),
    ],
    'n05': [
        (TIP, dict(ring=True, headline='Headlights:\n5 rules learners get wrong', hs=96, sub='Highway Code 113–115'),
         'Headlights: 5 rules learners get wrong, from Highway Code rules 113 to 115.'),
        (TIP, dict(label=None, badge='RULE 113', number='1', headline='Headlights on at night',
                   body='Half an hour after sunset to half an hour before sunrise, except on roads with lit street lighting.'),
         'Rule 113: use headlights at night, except on roads with lit street lighting.'),
        (TIP, dict(label=None, badge='RULE 113', number='2', headline='Sidelights from sunset',
                   body='Sidelights and rear number plate lights must be on between sunset and sunrise.'),
         'Rule 113: sidelights and rear number plate lights must be on between sunset and sunrise.'),
        (TIP, dict(label=None, badge='RULE 114', number='3', headline='Don’t dazzle in a queue',
                   body='Once the car behind has stopped, take your foot off the brake so your brake lights don’t glare.'),
         'Rule 114: in a stopped queue, take your foot off the brake once the car behind has stopped.'),
        (TIP, dict(label=None, badge='RULE 115', number='4', headline='Stay dipped to overtake',
                   body='Keep dipped headlights when overtaking until you’re level with the other vehicle.'),
         'Rule 115: keep dipped headlights when overtaking until you are level with the other vehicle.'),
        (TIP, dict(label=None, badge='RULE 115', number='5', headline='Dazzled? Slow down',
                   body='If oncoming lights dazzle you, slow down, and stop if you need to.'),
         'Rule 115: if oncoming lights dazzle you, slow down, and stop if you need to.'),
        (TIP, dict(label='ON THE TEST', headline='Both are on the official list', hs=72,
                   graphic=('rows', dict(items=[('SHOW ME', '“Show me how you’d switch on your dipped headlights.”'),
                                                ('TELL ME', 'A main beam question is on the “tell me” list too.')])),
                   cta=('Save this.', 'Night driving guide at driveschoolpro.com')),
         'On the test: switching on dipped headlights is a show me question, and main beam is on the tell me list. Save this.'),
    ],
    'n06': [
        (NEWS, {
            'headline': 'Every feature. No card needed to start.',
            'band': 'Free until 31 March 2027',
            'body': 'Then free for ever (up to 60 lessons a month), or Solo at £22 a month. No VAT.',
        }, 'Every feature, no card needed to start. Free until 31 March 2027. Then free for ever (up to 60 lessons a month), or Solo at £22 a month. No VAT.'),
    ],
    'n08': [
        (TIP, dict(ring=True, headline='Winter no-shows?', hs=110, sub='5 ways to protect your diary',
                   body='Late cancellations go up when it’s cold, dark and wet.'),
         'Winter no-shows? 5 ways to protect your diary.'),
        (TIP, dict(label=None, number='1', headline='Write your cancellation policy down',
                   body='Send it to every pupil. 24 or 48 hours’ notice is common. Whatever you pick, apply it to everyone.'),
         'Tip 1: write your cancellation policy down, send it to every pupil and apply it the same way to everyone.'),
        (TIP, dict(label=None, number='2', headline='Remind every lesson, every time',
                   body='A reminder the day before catches most “I forgot”.'),
         'Tip 2: remind every lesson, every time; a reminder the day before catches most “I forgot”.'),
        (TIP, dict(label=None, number='3', headline='Ask for a confirmation',
                   body='Not just a read receipt.'),
         'Tip 3: ask for a confirmation, not just a read receipt.'),
        (TIP, dict(label=None, align='center', graphic=('numlist', dict(items=[
                        ('4', 'Agree a bad-weather plan', 'If it’s unsafe to drive, you’ll move the lesson, not cancel it.'),
                        ('5', 'Keep a short waiting list', 'Pupils who want extra lessons can fill a gap.')])),
                   cta=('Our full guide has 8 strategies', 'Read it at driveschoolpro.com')),
         'Tips 4 and 5: agree a bad-weather plan in advance, and keep a short waiting list to fill gaps.'),
    ],
    'n10': [
        (SLIDE, dict(label='QUESTION FOR ADIs', ring=True, hero='?', hero_size=440,
                     headline='What’s the hardest thing to teach in the dark?', hs=86,
                     gaps=dict(hero=10, headline=56),
                     graphic=('box', dict(v='Tell us in the comments', fit_text=True))),
         'Question for instructors: what’s the hardest thing to teach in the dark? Tell us in the comments.'),
    ],
    'n11': [
        (SLIDE, dict(theme='pink', label='ADI TIP', ring=True, headline='The 10-minute Sunday routine', hs=100,
                     sub='for busy ADIs', body='Ten minutes on a Sunday night saves an hour of chasing in the week.'),
         'The 10-minute Sunday routine for busy ADIs.'),
        (SLIDE, dict(theme='pink', clock=2, graphic=('check', dict(items=[('Look at next week’s diary', 'Any gaps you can offer to your waiting list?')]))),
         'Minute 2: look at next week’s diary for gaps you can offer to your waiting list.'),
        (SLIDE, dict(theme='pink', clock=4, graphic=('check', dict(items=[('Check who owes you money', 'Send the reminders now, not mid-lesson.')]))),
         'Minute 4: check who owes you money and send the reminders now, not mid-lesson.'),
        (SLIDE, dict(theme='pink', clock=6, graphic=('check', dict(items=[('Finish last week’s lesson notes', 'While you still remember them.')]))),
         'Minute 6: finish last week’s lesson notes while you still remember them.'),
        (SLIDE, dict(theme='pink', clock=8, graphic=('check', dict(items=[('Check car dates', 'MOT, tax, insurance, service. Nothing should surprise you.')]))),
         'Minute 8: check car dates for MOT, tax, insurance and service.'),
        (SLIDE, dict(theme='pink', clock=10, graphic=('check', dict(items=[
                        ('Block out your own time', 'School runs, appointments, days off.'),
                        ('Plan around tests', 'Note anyone with a test coming up and plan their next lessons around it.')])),
                     body2='Do it the same time every week and it becomes automatic.', gaps=dict(graphic=64)),
         'Minute 10: block out your own time, and plan lessons around anyone with a test coming up.'),
    ],
    'n12': [
        (QUIET, dict(graphic=('poppy', {}), headline='We will remember them.', sub='Remembrance Sunday'),
         'A simple red poppy on navy with the words: We will remember them.'),
    ],
    # ---------------------------------------------------------------- week 2
    'n13': [
        (SLIDE, dict(label='STANDARDS CHECK', ring=True, headline='How the standards check is scored', hs=100,
                     sub='17 competencies · 51 marks'),
         'How the standards check is scored: 17 competencies, 51 marks.'),
        (SLIDE, dict(headline='About 45 minutes', graphic=('clock', dict(total=45, done=40, big='45', small='minutes')),
                     body='A normal, client-centred lesson. Your pupil drives for about 40 of them.'),
         'About 45 minutes: a normal, client-centred lesson in which your pupil drives for about 40 minutes.'),
        (SLIDE, dict(theme='white', headline='17 competencies in 3 groups', hs=88,
                     graphic=('rows', dict(items=['Lesson planning', 'Risk management', 'Teaching and learning skills'], highlight=1, size=40)),
                     body2='Each competency scores 0 to 3.'),
         '17 competencies in 3 groups: lesson planning, risk management, and teaching and learning skills; each scores 0 to 3.'),
        (SLIDE, dict(theme='white', headline='Out of 51 marks', hs=96, graphic=('scorebar', {}), bs=40, gaps=dict(headline=60, graphic=60),
                     body2='Score 31 or more to pass.\n43 or more is Grade A.'),
         'Out of 51 marks: 0 to 30 is a fail, 31 to 42 is Grade B, 43 to 51 is Grade A.'),
        (SLIDE, dict(hero='7 or less', hero_size=200, headline='in risk management is an automatic fail', hs=72,
                     body='So is the examiner stopping the lesson because of danger.'),
         'Automatic fail: 7 or less in risk management, or the examiner stopping the lesson because of danger.'),
        (SLIDE, dict(headline='Fail? You get up to 2 more attempts', hs=80,
                     body='Fail 3 times and you’re removed from the register. Work on risk management first.',
                     source='Source: GOV.UK ADI standards check, checked Oct 2026'),
         'Fail and you get up to 2 more attempts; fail 3 times and you are removed from the register.'),
    ],
    'n16': [
        (TIP, dict(ring=True, headline='Winter checks for your tuition car', hs=96, sub='5 to do this week',
                   body='Your car is your office. And there’s a lesson for your pupil in each check.'),
         '5 winter checks for your tuition car.'),
        (TIP, dict(label=None, number='1', headline='Tyres', hero='1.6mm', hero_size=170, order=['number', 'headline', 'hero', 'body'],
                   gaps=dict(headline=24, hero=40),
                   body='Legal minimum, across the central three-quarters of the tread, all the way round. Check pressures cold.'),
         'Check 1, tyres: 1.6mm legal minimum tread across the central three-quarters, all the way round.'),
        (TIP, dict(label=None, number='2', headline='Lights',
                   body='Every bulb, front and back, including number plate lights. Clean the lenses.'),
         'Check 2, lights: every bulb, front and back, including number plate lights.'),
        (TIP, dict(label=None, number='3', headline='Screenwash',
                   body='Top up with a winter mix so it doesn’t freeze.'),
         'Check 3, screenwash: top up with a winter mix so it doesn’t freeze.'),
        (TIP, dict(label=None, number='4', headline='Clear view',
                   body='Before every lesson: all snow and ice off all windows, lights clean, mirrors clear. Highway Code Rule 229.'),
         'Check 4, clear view: clear all snow and ice from all windows, with lights clean and mirrors clear (Rule 229).'),
        (TIP, dict(label=None, number='5', headline='Paperwork',
                   body='MOT, tax and insurance dates in your diary, not your head.',
                   cta=('Tyres and lights are “tell me” questions', 'So get your pupil to do the checks with you.')),
         'Check 5, paperwork: MOT, tax and insurance dates in your diary; tyres and lights are also tell me questions.'),
    ],
    'n18': [
        (SLIDE, dict(theme='pink', label='ADI TIP', headline='The mid-course wobble', hs=96,
                     sub='4 things to say when a pupil goes quiet', graphic=('graph', {}),
                     gaps=dict(sub=64)),
         'The mid-course wobble: a progress line that rises, flattens in the middle, then rises again. 4 things to say when a pupil goes quiet.'),
    ],
    'n19': [
        (SLIDE, dict(label='PRICING', ring=True, headline='What it costs. No small print.', hs=100, sub='From 1 April 2027'),
         'What DriveSchoolPro costs, with no small print, from 1 April 2027.'),
        (SLIDE, dict(theme='pink', headline='Now to 31 March 2027', hs=64, hero='Free.\nEverything.', hero_size=170,
                     body='Every feature. No card needed.', order=['headline', 'hero', 'body'], gaps=dict(headline=40, hero=44)),
         'From now to 31 March 2027: free, every feature, no card needed.'),
        (SLIDE, dict(headline='From 1 April 2027', hs=64, graphic=('plans', {}),
                     body2='No-shows and cancelled lessons don’t count towards the Free plan’s 60.', gaps=dict(headline=44)),
         'From 1 April 2027: Free at £0 for 1 instructor and up to 60 lessons a month, Solo at £22 a month, School at £22 a month plus £10 per extra instructor.'),
        (SLIDE, dict(theme='white', hero='No VAT.\nNo contract.\nNo setup fee.', hero_color=NAVY, hero_size=128,
                     body='On every plan.', gaps=dict(hero=50)),
         'No VAT, no contract, no setup fee.'),
        (SLIDE, dict(headline='Taking card payments?', hs=80,
                     graphic=('rows', dict(items=[('CARD PAYMENTS THROUGH THE APP', '3% plus Stripe’s fee'),
                                                  ('CASH AND BANK TRANSFER', 'No fee')], size=44)),
                     cta=('See every plan', 'driveschoolpro.com/pricing')),
         'Card payments through the app cost 3% plus Stripe’s fee; cash and bank transfer have no fee. See every plan at driveschoolpro.com/pricing.'),
    ],
    'n21': [
        (SLIDE, dict(label='FROM JOHN', headline='What’s new', hs=96, sub='Changed in DriveSchoolPro this year', ss=40,
                     graphic=('rows', dict(marker='dot', size=30, tag_size=34, items=[
                         ('Works with no signal', 'Your diary and pupil notes are there in the car. Changes sync later.'),
                         ('A “Your day” screen', 'Today’s lessons in order, pick-ups, and what each pupil owes.'),
                         ('Money in one place', 'Invoices, payments and package balances on one page.'),
                         ('Clash checks', 'Pupil, instructor and car, all checked at once.')])),
                     gaps=dict(sub=44)),
         'What’s new this year: works with no signal, a Your day screen, money in one place, and clash checks on pupil, instructor and car.'),
    ],
    'n22': [
        (QUIET, dict(graphic=('road', dict(h=400)), headline='World Day of Remembrance for Road Traffic Victims', hs=62,
                     sub='15 November'),
         'A simple line drawing of a road on navy with the words: World Day of Remembrance for Road Traffic Victims, 15 November.'),
    ],
    # ---------------------------------------------------------------- week 3
    'n23': [
        (SLIDE, dict(label='ROAD SAFETY WEEK', ring=True, headline='The hierarchy of road users', hs=100,
                     sub='3 things to teach this week', body='Road Safety Week runs from 15 to 21 November.'),
         'Road Safety Week: the hierarchy of road users, 3 things to teach this week.'),
        (SLIDE, dict(theme='white', headline='Most harm = most responsibility', hs=76,
                     graphic=('ladder', dict(items=['Pedestrians', 'Cyclists', 'Horse riders', 'Motorcyclists', 'Cars', 'Vans and lorries'])),
                     source='Highway Code Rule H1', gaps=dict(headline=44, graphic=30)),
         'Highway Code Rule H1: those who can cause the most harm bear the most responsibility, from pedestrians at the top to vans and lorries at the bottom.'),
        (SLIDE, dict(badge='RULE H2', number='1', headline='Give way at junctions',
                     body='To pedestrians crossing or waiting to cross the road you’re turning into or out of.'),
         'Rule H2: at a junction, give way to pedestrians crossing or waiting to cross.'),
        (SLIDE, dict(badge='RULE H3', number='2', headline='Don’t cut across',
                     body='Don’t cut across cyclists or horse riders when you turn.'),
         'Rule H3: don’t cut across cyclists or horse riders when you turn.'),
        (SLIDE, dict(number='3', headline='Look earlier after dark',
                     body='People walking and cycling are much harder to see. Look earlier and slow down sooner.'),
         'After dark, look earlier and slow down sooner for people walking and cycling.'),
        (SLIDE, dict(headline='Ask them to teach it back', hs=96, body='If they can teach it, they’ve got it.',
                     cta=('Dealing with other road users', 'DVSA skill 12, at driveschoolpro.com')),
         'Ask your pupil to teach it back: if they can teach it, they’ve got it.'),
    ],
    'n25': [
        (SLIDE, dict(label='MAKING TAX DIGITAL', ring=True, hero='£30,000', hero_size=200, headline='It’s turnover, not profit', hs=84,
                     body='HMRC measures qualifying income before expenses.', source=NOT_ADVICE),
         'Making Tax Digital: the £30,000 figure is turnover, not profit.'),
        (SLIDE, dict(theme='pink', headline='Example from our guide', hs=72,
                     graphic=('bars', dict(bars=[('Lesson fees', '£38,000', 1.0, RED, 'HMRC counts this one', False),
                                                 ('Profit after £14,000 costs', '£24,000', 24 / 38, NAVY, None, True)])),
                     body2='Qualifying income is £38,000. This ADI is in from April 2027.', source=NOT_ADVICE, gaps=dict(headline=44, body2=36)),
         'Example: £38,000 in lesson fees counts, not £24,000 profit, so this ADI is in from April 2027.'),
        (SLIDE, dict(theme='pink', headline='A franchise fee is an expense', hs=92,
                     body='It doesn’t reduce your qualifying income.', source=NOT_ADVICE),
         'A franchise fee is an expense and doesn’t reduce your qualifying income.'),
        (SLIDE, dict(theme='pink', headline='Salaried job too?', hs=92,
                     body='Only your instructing income (plus any property income) counts.', source=NOT_ADVICE),
         'Salaried job too? Only your instructing income, plus any property income, counts.'),
        (SLIDE, dict(headline='Not tax advice', hs=96,
                     body='Check GOV.UK or ask your accountant. DriveSchoolPro isn’t MTD software.',
                     cta=('Read our MTD guide for ADIs', 'driveschoolpro.com')),
         'Not tax advice: check GOV.UK or ask your accountant; DriveSchoolPro isn’t MTD software.'),
    ],
    'n27': [
        (SLIDE, dict(label='FROM JOHN', ring=True, headline='Ask me anything', hs=124, sub='John, founder · answering tonight',
                     body='Prices, your data, what it can’t do yet. Nothing’s off limits. Ask in the comments.'),
         'Ask me anything: John, founder, answering in the comments tonight.'),
    ],
    'n29': [
        (SLIDE, dict(label='ADI TIP', graphic=('fog', {}), headline='Fog’s gone.\nIs yours still on?', hs=86,
                     sub='Under 100m: on. Clears: off.', source='Highway Code Rules 226 and 236',
                     order=['graphic', 'headline', 'sub', 'source'], gaps=dict(graphic=70, sub=36)),
         'Rear fog light symbol. Fog’s gone, is yours still on? Under 100 metres visibility: on. When it clears: off.'),
    ],
    'n30': [
        (SLIDE, dict(label='ADI TIP', ring=True, headline='What does an hour cost you?', hs=104,
                     sub='Work it out before you set your price'),
         'What does an hour of teaching cost you? Work it out before you set your price.'),
        (SLIDE, dict(theme='white', number='1', headline='Add up a year of costs', hs=76,
                     graphic=('chips', dict(items=['Car', 'Fuel', 'Insurance', 'Servicing and tyres', 'Franchise fee',
                                                   'Phone', 'Software', 'CPD', 'ADI registration'])), gaps=dict(headline=50)),
         'Step 1: add up a year of costs: car, fuel, insurance, servicing and tyres, franchise fee, phone, software, CPD and ADI registration.'),
        (SLIDE, dict(number='2', headline='Paid hours ≠ working hours', hs=80, graphic=('split', {}), gaps=dict(headline=60)),
         'Step 2: paid hours are not working hours; travel, admin and uncharged cancellations are unpaid.'),
        (SLIDE, dict(theme='white', number='3', graphic=('lines', dict(lines=[('Yearly costs', 'head'), ('÷ paid hours', 'head'), ('= cost per lesson', 'red')], size=92)),
                     body2='What each lesson costs before you’ve paid yourself a penny.'),
         'Step 3: yearly costs divided by paid hours equals cost per lesson.'),
        (SLIDE, dict(theme='pink', label='EXAMPLE FIGURES', graphic=('lines', dict(lines=[('£12,000', 'head'), ('÷ 1,000 hours', 'head'), ('= £12 an hour', 'red')], size=104)),
                     body2='Gone on costs before you earn anything.'),
         'Example figures: £12,000 of costs divided by 1,000 paid hours is £12 an hour.'),
        (SLIDE, dict(headline='Then add what you need to take home', hs=88, body='Work back from there to a price.',
                     cta=('Our free calculator does the sums', 'driveschoolpro.com')),
         'Then add what you need to take home and work back to a price; our free calculator does the sums.'),
    ],
    'n32': [
        (SLIDE, dict(label='SUNDAY · SUPPORT INBOX', ring=True, headline='Sunday evening is when I go through the support inbox properly.', hs=74,
                     sub='It’s me who reads it, not a call centre.', ss=44,
                     cta=('Stuck on anything?', 'support@driveschoolpro.com'), gaps=dict(sub=56)),
         'Sunday evening is when John goes through the support inbox; email support@driveschoolpro.com.'),
    ],
    # ---------------------------------------------------------------- week 4
    'n34': [
        (SLIDE, dict(label='ADI TIP', headline='The 2-minute recap', hs=96, sub='End every lesson with these', ss=44,
                     graphic=('bubbles', dict(items=['“What went well today?”', '“What would you do differently?”', '“What should we work on next time?”'])),
                     body2='Let them answer first, then agree one focus for next time.', gaps=dict(sub=50, graphic=36)),
         'The 2-minute recap: what went well today, what would you do differently, and what should we work on next time.'),
    ],
    'n35': [
        (SLIDE, dict(theme='pink', label='PRICING', graphic=('price', {}), headline='Founding price, locked for 24 months', hs=72,
                     graphic2=('steps', dict(items=['Add a card by\n1 March 2027', 'Nothing charged\nbefore 1 April', '£15 a month\nfor 24 months'])),
                     body2='Schools: £15 + £8 per extra instructor. No VAT.',
                     order=['graphic', 'headline', 'graphic2', 'body2'], gaps=dict(graphic=40, headline=50, graphic2=40)),
         'Founding price: £15 a month instead of £22, locked for 24 months, if you add a card by 1 March 2027; nothing charged before 1 April 2027.'),
    ],
    'n36': [
        (SLIDE, dict(label='ADI TIP', graphic=('road', dict(h=360, sun=True, color=tpl.MUTED_ON_DARK)), headline='Low sun? Slow down.', hs=96,
                     sub='Highway Code Rule 93', body='Clean the inside of the windscreen, and use the visor early.',
                     order=['graphic', 'headline', 'sub', 'body'], gaps=dict(graphic=56, sub=30)),
         'Low winter sun over a road. Low sun? Slow down, Highway Code Rule 93.'),
    ],
    'n38': [
        (SLIDE, dict(label='MAKING TAX DIGITAL', ring=True, hero='6 April 2027', headline='3 things to sort before MTD', hs=84,
                     body='When MTD starts for most full-time ADIs.', source=NOT_ADVICE),
         'Making Tax Digital starts for most full-time ADIs on 6 April 2027: 3 things to sort before then.'),
        (SLIDE, dict(theme='pink', number='1', headline='Check your figure',
                     body='Lesson income before expenses, tax year to 5 April 2026. Over £30,000 means you’re in.',
                     body2='That return is due by 31 January 2027.', source=NOT_ADVICE, gaps=dict(body=30, body2=60)),
         'Step 1: check your lesson income before expenses for the tax year to 5 April 2026; over £30,000 means you’re in.'),
        (SLIDE, dict(theme='pink', number='2', headline='Choose how you’ll file',
                     body='MTD-compatible software, or an accountant who uses it. GOV.UK has a tool to find software.',
                     source=NOT_ADVICE, gaps=dict(body=60)),
         'Step 2: choose how you’ll file, with MTD-compatible software or an accountant who uses it.'),
        (SLIDE, dict(theme='pink', number='3', headline='Get your income records in one place',
                     body='Every lesson and payment, recorded as it happens, makes quarterly updates far less painful.',
                     source=NOT_ADVICE, gaps=dict(body=60)),
         'Step 3: get your income records in one place now, recorded as they happen.'),
        (SLIDE, dict(headline='DriveSchoolPro isn’t MTD software', hs=88,
                     body='It doesn’t file anything with HMRC. It does keep your income records tidy.',
                     cta=('This isn’t tax advice.', 'Check GOV.UK or ask your accountant.')),
         'DriveSchoolPro isn’t MTD software and doesn’t file with HMRC, but it keeps your income records tidy. Not tax advice.'),
    ],
    'n40': [
        (TIP, dict(headline='Plan December now', hs=88,
                   graphic=('calendar', dict(blocked=(24, 25, 26, 31), booked=(1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22))),
                   body2='Parties, shifts, students going home, and January tests.', gaps=dict(headline=44, graphic=40)),
         'Plan December now: a December calendar with days off blocked out and lessons booked.'),
        (TIP, dict(label=None, number='1', headline='Decide your days off now',
                   body='Block them out before anyone books them.'),
         'Tip 1: decide your days off now and block them out before anyone books them.'),
        (TIP, dict(label=None, number='2', headline='Ask for December availability',
                   body='Message every pupil. One message, one deadline.'),
         'Tip 2: message every pupil for their December availability, with one deadline.'),
        (TIP, dict(label=None, number='3', headline='Early January tests come first',
                   body='Pupils with tests in early January come first for the slots you have.'),
         'Tip 3: pupils with tests in early January come first for the slots you have.'),
        (TIP, dict(label=None, align='center', graphic=('numlist', dict(items=[
                        ('4', 'Re-send your cancellation policy', 'Remind everyone before the party season, not after.'),
                        ('5', 'Plan for icy mornings', 'Agree in advance what happens if a lesson isn’t safe to run.')])),
                   cta=('A calm December starts in November', 'No-shows guide at driveschoolpro.com')),
         'Tips 4 and 5: remind everyone of your cancellation policy before the party season, and agree a plan for icy mornings.'),
    ],
    'n41': [
        (SLIDE, dict(theme='pink', label='QUESTION', ring=True, headline='What runs your diary?', hs=96,
                     graphic=('tiles', dict(items=[('A', 'Paper diary'), ('B', 'Spreadsheet'),
                                                   ('C', 'WhatsApp and the phone calendar'), ('D', 'An app')])),
                     body2='Reply with a letter. No wrong answers.', gaps=dict(headline=50, graphic=40)),
         'What runs your diary? A, paper diary; B, spreadsheet; C, WhatsApp and the phone calendar; D, an app. Reply with a letter.'),
    ],
    'n44': [
        (SLIDE, dict(label='STANDARDS CHECK', ring=True, headline='What triggers a standards check?', hs=100,
                     sub='4 numbers DVSA watches', body='From your pupils’ driving tests over a rolling 12 months.'),
         'What triggers a standards check? 4 numbers DVSA watches from your pupils’ driving tests.'),
        (STAT, dict(label='TRIGGER 1 OF 4', number='6+', caption='average driving faults per test'),
         'Trigger 1: an average of 6 or more driving faults per test.'),
        (STAT, dict(label='TRIGGER 2 OF 4', number='0.55+', caption='average serious faults per test'),
         'Trigger 2: an average of 0.55 or more serious faults per test.'),
        (STAT, dict(label='TRIGGER 3 OF 4', number='10%+', caption='of tests with the examiner taking physical action'),
         'Trigger 3: the examiner taking physical action on 10% or more of tests.'),
        (STAT, dict(label='TRIGGER 4 OF 4', number='55%', caption='pass rate or lower'),
         'Trigger 4: a pass rate of 55% or lower.'),
        (SLIDE, dict(headline='Hit 3 of the 4 and you’ll get a letter', hs=80,
                     body='Fewer than 5 pupils to test, or don’t teach learners? You must take a check in each 4-year period anyway.',
                     source='Source: GOV.UK, checked Oct 2026'),
         'Hit 3 of the 4 triggers and you’ll be asked to book a standards check.'),
    ],
}

def filenames(pid, n):
    return [f'{pid}.png'] if n == 1 else [f'{pid}-{k}.png' for k in range(1, n + 1)]

def build(pid):
    slides = POSTS[pid]; n = len(slides)
    for (fn, copy, _), name in zip(slides, filenames(pid, n)):
        copy = dict(copy)
        if n > 1: copy['page'] = (filenames(pid, n).index(name) + 1, n)
        F = tpl.Frame(W, H)
        png(svg_doc(W, H, fn(F, copy, 'outline')), os.path.join(OUT, name), W, H)
    print('built', pid, n)

def manifest():
    m = {}
    for pid, slides in sorted(POSTS.items()):
        m[pid] = {'images': [URL + f for f in filenames(pid, len(slides))], 'alt': [a for _, _, a in slides]}
    p = os.path.join(BRAND, 'social', 'metricool', 'november-images.json')
    json.dump(m, open(p, 'w'), indent=2, ensure_ascii=False); open(p, 'a').write('\n')

def contact_sheet():
    from PIL import Image, ImageDraw, ImageFont
    th_w, th_h = 216, 270; g = 14; lab_w = 120; pad = 40; maxn = max(len(s) for s in POSTS.values())
    ids = sorted(POSTS); half = (len(ids) + 1) // 2
    col_w = lab_w + maxn * (th_w + g) + 60
    Wt = pad * 2 + 2 * col_w
    Ht = pad * 2 + 60 + half * (th_h + g * 2)
    sheet = Image.new('RGB', (Wt, Ht), (236, 236, 242)); d = ImageDraw.Draw(sheet)
    f1 = ImageFont.truetype(os.path.join(FONTS, 'Lexend-Bold.ttf'), 30)
    f2 = ImageFont.truetype(os.path.join(FONTS, 'Lexend-Bold.ttf'), 26)
    d.text((pad, pad), 'DriveSchoolPro social posts, November 2026', fill=NAVY, font=f1)
    for i, pid in enumerate(ids):
        r, col = i % half, i // half
        x0 = pad + col * col_w; y = pad + 60 + r * (th_h + g * 2)
        d.text((x0, y + th_h / 2 - 14), pid.upper(), fill=NAVY, font=f2)
        for c, name in enumerate(filenames(pid, len(POSTS[pid]))):
            im = Image.open(os.path.join(OUT, name)).convert('RGB').resize((th_w, th_h), Image.LANCZOS)
            sheet.paste(im, (x0 + lab_w + c * (th_w + g), y))
    sheet.save(os.path.join(BRAND, 'social', 'november-contact-sheet.png'))
    print('contact sheet ok')

def main():
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[1:]
    for pid in POSTS:
        if not only or pid in only: build(pid)
    manifest()
    if not only: contact_sheet()

if __name__ == '__main__':
    main()
