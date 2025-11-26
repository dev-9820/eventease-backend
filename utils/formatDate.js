// format Date to DD-MMM-YYYY (e.g., 30-Jul-2025)
function formatDate(d){
  if(!d) return null;
  const date = new Date(d);
  const day = String(date.getUTCDate()).padStart(2,'0');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mon = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}-${mon}-${year}`;
}

export default formatDate;