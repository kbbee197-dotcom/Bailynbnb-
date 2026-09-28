const blockedDatesFile = require('../data/blocked-dates.json');

module.exports = async (req, res) => {
  const property = req.query.property;
  if (property !== 'west-park' && property !== 'miami') {
    res.status(400).send('property must be west-park or miami');
    return;
  }

  const dates = blockedDatesFile[property] || [];
  const propertyLabel = property === 'west-park' ? 'West Park' : 'Miami';

  let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Bailynbnb//' + propertyLabel + '//EN\r\n';
  dates.forEach(function (dateStr, i) {
    const compact = dateStr.replace(/-/g, '');
    const nextDay = addOneDay(dateStr).replace(/-/g, '');
    ics += 'BEGIN:VEVENT\r\n';
    ics += 'UID:bailynbnb-' + property + '-' + compact + '@bailynbnb\r\n';
    ics += 'DTSTART;VALUE=DATE:' + compact + '\r\n';
    ics += 'DTEND;VALUE=DATE:' + nextDay + '\r\n';
    ics += 'SUMMARY:Booked - ' + propertyLabel + ' (Bailynbnb)\r\n';
    ics += 'END:VEVENT\r\n';
  });
  ics += 'END:VCALENDAR\r\n';

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(ics);
};

function addOneDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
