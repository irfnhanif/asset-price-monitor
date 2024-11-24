function calculateMovingAverage(timeSeries, period = 100, type) {
	const dates = Object.keys(timeSeries).sort((a, b) => (type === 'stock' ? new Date(b) - new Date(a) : new Date(a) - new Date(b)));
	const closePrices = dates
		.slice(0, period)
		.map((date) => parseFloat(type === 'stock' ? timeSeries[date]['4. close'] : timeSeries[date][1]));
	return closePrices.reduce((sum, price) => sum + price, 0) / closePrices.length;
}

export function determineTrend(timeSeries, type) {
	const dates = Object.keys(timeSeries).sort((a, b) => (type === 'stock' ? new Date(b) - new Date(a) : new Date(a) - new Date(b)));
	const latestClosePrice = parseFloat(type === 'stock' ? timeSeries[dates[0]]['4. close'] : timeSeries[dates[0]][1]);
	const ma100 = calculateMovingAverage(timeSeries, 100, type);
	return latestClosePrice > ma100 ? 'Uptrend' : 'Downtrend';
}
