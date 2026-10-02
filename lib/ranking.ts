export function bayesian(average: number, count: number, prior = 3.5, weight = 20) { return (average * count + prior * weight) / (count + weight); }
export function trendScore(recentRatings: number, previousRatings: number, recentReviews: number, visits: number) { return recentRatings * 2 + recentReviews * 3 + Math.log1p(visits) + Math.max(0, recentRatings - previousRatings) * 2; }
