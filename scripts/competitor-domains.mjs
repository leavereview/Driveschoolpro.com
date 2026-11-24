// Competitor websites (driving-instructor / driving-school / booking software).
// Every outbound link to one of these gets rel="nofollow noopener" at build time
// (see nofollow-competitors.mjs). A domain matches itself and all subdomains.
// To nofollow a new competitor, add one line here.
export const COMPETITOR_DOMAINS = [
  'totaldrive.co.uk',
  'totaldrive.app',
  'totaldrive.freshdesk.com',
  'mydrivetime.co.uk',
  'goroadie.com',
  'adinetwork.co.uk',
  'lessondiary.co.uk',
  'lessonbuddy.co.uk',
  'passly.co.uk',
  'bitepoint.co.uk',
  'bitepoint.app',
  'drivebest.app',
  'drivingschoolmanager.com',
  'drivingschooloffice.co.uk',
  'teachworks.com',
  'intercom.help', // Teachworks help centre
  'reservio.com',
  'easyweek.io',
  'simplybook.me',
];
