// returns 'Upcoming' | 'Ongoing' | 'Completed' based on startDate (UTC)
function computeStatus(startDate){
  const today = new Date();
  const eventDate = new Date(startDate);

  // Normalize to date-only for comparison
  const toDayOnly = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const t = toDayOnly(today).getTime();
  const e = toDayOnly(eventDate).getTime();

  if (e > t) return 'Upcoming';
  if (e === t) return 'Ongoing';
  return 'Completed';
}

export default computeStatus;
