# DriveSchoolPro ad recordings checklist

Seeded from the 11 Nov 2026 HTML checklist (archive/comedy-ad-pilots/recording-checklist.html). Tick items off as you go by changing `[ ]` to `[x]`. The planner appends dated "Filming suggestions" sections at the bottom.

## Before you start

- Phone on the **same Wi-Fi** as the Mac. Mac stays awake.
- Demo logins use the shared demo credentials (kept in the local demo notes, not in this repo).
- First visit: tap **Essential Only** on the cookie banner. On the instructor side, close the "Get the app" card.
- Screen recording: Control Centre, then record. Turn on **Do Not Disturb** first.
- Pause for half a second before each tap. Don't rush, because we trim afterwards.
- If a page won't load, the Mac's Wi-Fi address may have changed. Tell Claude and it will restart the server.

## App recordings (phone, upright)

- [ ] **1. Pupil books and pays by card** (`pay-now.mov`)
  - URL: `http://<mac-ip>:3001/portal/ace-driving-school/login`, login `ellie.morgan@example.com`
  1. Sign in (email, Continue, demo credentials, Sign In).
  2. **Book** tab, tap **Tom**, **Fri 13**, **12:15**.
  3. (Optional) add a pickup address, then **Continue to Payment**.
  4. Test card `4242 4242 4242 4242`, expiry `12/34`, CVC `123`.
  5. Scroll, **Pay Now**, hold on "Lesson Booked!" for 2 s.
  - Before each extra take, ask Claude to "reset the demo", which frees the Fri 13 slot again.
- [ ] **2. Instructor's busy week** (`diary.mov`)
  - URL: `http://<mac-ip>:3001/login`, login `tom.harrison@example.com`
  1. **Calendar** tab, **Day**, swipe or tap through the day strip (6 to 7 lessons a day).
  2. On Thursday, open **Amelia Hughes 16:00**, **Reschedule**, move it to the 12:00 to 14:00 gap.
  - There's no drag on a phone. For the drag shot, use the Mac: Chrome full-width, Calendar, Week, drag Thu Amelia Hughes 16:00 up to about 12:30. Record with Cmd+Shift+5 and press **Cancel** at the confirm box.
- [ ] **3. DVSA progress moves** (`dvsa-tick.mov` and `dvsa-pupil.mov`)
  1. As Tom: Students, **Ellie Morgan**, **Progress** tab, expand **Road Types**, tap the rightmost (level 5) bar on **Town driving**.
  2. Then as Ellie (log in as in recording 1): Home, **Progress**. She's now on 63% (was 59%).
  - Tip: record Ellie's Progress page once before Tom's tap too, so we can cut 59% to 63%.
- [ ] **4. Everyone's paid** (`money.mov`)
  - URL: `http://<mac-ip>:3001/login`, login `admin@example.com`
  1. **Money** tab, **Who owes me**.
  2. Hold on **Outstanding £0.00 / Overdue £0.00** for 3 s, then scroll Recent Payments slowly.
- [ ] **5. Quick booking** (`quickbook.mov`)
  - Login `tom.harrison@example.com`
  1. **Calendar**, **Day**, **Sat 14**, tap "17:00 book".
  2. Tap **Ellie Morgan** (Recent Pupils), **Book Lesson**, hold on "Lesson booked".

## Car clips (parked, engine off, 3 takes each)

4K 30fps, phone upright on the dashboard at eye height. Hold still for 3 s before and after each take. No number plates or passers-by. Underplay it: subtle is funnier.

- [ ] **Deadpan** (`react-deadpan`): look out of the windscreen, slowly turn to stare at camera, blank face, hold for 3 s.
- [ ] **Sigh** (`react-sigh`): read your phone, long tired sigh, close your eyes.
- [ ] **Tiny fist pump** (`react-fistpump`): glance at phone, small surprise, restrained fist pump.
- [ ] **Eye roll** (`react-eyeroll`): phone "buzzes", glance, slow eye roll to camera.
- [ ] **Phone toss** (`react-toss`): hands only, filmed from the passenger side: thumb hovers, drop the phone onto the seat.
- [ ] **Details** (`detail-lplate`, `detail-dualpedal`, `detail-phonebuzz`, `detail-coffee`): L-plate going on, dual-control pedal (slow tilt), phone vibrating face-down on the seat, coffee in the cup holder (slow push-in).
- [ ] **Paper diary prop** (`prop-diary`): coffee rings, crossed-out made-up names, "PAID??" in the margin. Slow flick-through: top-down shot, then angled.

## Sounds (15 to 20 s each, phone close, quiet)

- [ ] **Indicator tick** (`sfx-indicator`): phone right by the dashboard.
- [ ] **Door shut** (`sfx-door`): from inside the car.
- [ ] **Handbrake and seatbelt** (`sfx-handbrake`, `sfx-seatbelt`).
- [ ] **L-plate magnet slap** (`sfx-lplate`).

## Optional

- [ ] **Founder piece to camera** (`founder-ptc`): about 20 s, no script: who you are, why you built DriveSchoolPro, one thing it saves instructors from. 3 takes.
- [ ] **Instructor friends**: 10 s, upright: "Best excuse a pupil's given me for not paying is...". Get a text back saying they're OK with it being used in ads.

## When you're done

AirDrop everything to the Mac and put it in `~/Projects-code/reference/driveschoolpro/DSP-social-videos/`. Rough names are fine. The social autopost job mirrors that folder to the box nightly and uses new clips from it.

## Filming suggestions 2026-11-12

- [ ] Frosty-morning clip, about 20 seconds: John clearing the windscreen and mirrors before a lesson, saying one winter tip to camera.
- [ ] Phone-on-dashboard shot, about 15 seconds: ticking skills on the DVSA record at the kerb after a lesson, demo data only.
- [ ] Two quick sound effects, about 10 seconds each: handbrake and an L-plate magnet slap, for the comedy ads.
