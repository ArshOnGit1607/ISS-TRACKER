export function formatISSChartData(positions) {
  if (!positions || positions.length < 2) return [];

  const R = 6371; // Earth's radius in km
  
  const data = [];
  for (let i = 1; i < positions.length; i++) {
    const p1 = positions[i - 1];
    const p2 = positions[i];
    
    const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
    const dLon = (p2.lng - p1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.lat * (Math.PI / 180)) *
        Math.cos(p2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    
    const timeDiffHours = (p2.timestamp - p1.timestamp) / 3600;
    const speed = timeDiffHours > 0 ? distance / timeDiffHours : 0;
    
    const date = new Date(p2.timestamp * 1000);
    const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    data.push({
      time: timeLabel,
      speed: Math.round(speed)
    });
  }
  
  return data;
}

export function formatNewsDistribution(articles) {
  if (!articles || articles.length === 0) return [];
  
  const counts = articles.reduce((acc, article) => {
    const site = article.news_site;
    acc[site] = (acc[site] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(counts).map(site => ({
    name: site,
    value: counts[site]
  })).sort((a, b) => b.value - a.value);
}
