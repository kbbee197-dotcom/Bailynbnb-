const blockedDatesFile = require('../data/blocked-dates.json');

module.exports = async (req, res) => {
  const property = req.query.property;
  if (property !== 'west-park' && property !== 'miami') {
    res.status(400).json({ error: 'property must be west-park or miami' });
    return;
  }

  const blocked = new Set(blockedDatesFile[property] || []);
  const envKey = property === 'west-park' ? 'WESTPARK' : 'MIAMI';
  const feedUrls = [
    process.env['AIRBNB_ICAL_' + envKey],
    process.env['VRBO_ICAL_' + envKey]
  ].filter(Boolean);

  for (const url of feedUrls) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      addDatesFromIcs(text, blocked);
    } catch (err) {
      console.error('Feed fetch failed:', url, err.message);
    }
  }

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json({ property: property, blocked: Array.from(blocked).sort() });
};

function addDatesFromIcs(icsText, blockedSet) {
  const events = icsText.split('BEGIN:VEVENT').slice(1);
  for (const ev of events) {
    const startMatch = ev.match(/DTSTART[^:]*:(\d{8})/);
    const endMatch = ev.match(/DTEND[^:]*:(\d{8})/);
    if (!startMatch) continue;
    const start = parseIcsDate(startMatch[1]);
    const end = endMatch ? parseIcsDate(endMatch[1]) : start;
    let cur = new Date(start);
    while (cur < end) {
      blockedSet.add(cur.toISOString().slice(0, 10));
      cur.setDate(cur.getDate() + 1);
    }
  }
}

function parseIcsDate(str) {
  const y = str.slice(0, 4), m = str.slice(4, 6), d = str.slice(6, 8);
  return new Date(y + '-' + m + '-' + d + 'T00:00:00Z');
}
