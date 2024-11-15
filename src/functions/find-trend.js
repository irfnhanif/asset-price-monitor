function calculateMovingAverage(timeSeries, period = 100) {
	const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
	const closePrices = dates.slice(0, period).map((date) => parseFloat(timeSeries[date]['4. close']));
	return closePrices.reduce((sum, price) => sum + price, 0) / closePrices.length;
}

export function determineTrend(timeSeries) {
	const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
	const latestClosePrice = parseFloat(timeSeries[dates[0]]['4. close']);
	const ma100 = calculateMovingAverage(timeSeries);
	return latestClosePrice > ma100 ? 'Uptrend' : 'Downtrend';
}
