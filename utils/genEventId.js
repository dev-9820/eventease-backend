// EVT-[MMM][YYYY]-[Random3]
function random3(){
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for(let i=0;i<3;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out;
}

function genEventId(date){
  const d = new Date(date);
  const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const mon = monthNames[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `EVT-${mon}${year}-${random3()}`;
}

export default genEventId;