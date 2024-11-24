function calculateMovingAverage(timeSeries, period = 100, type) {
	let closePrices;
	if (type === 'stock') {
		const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
		closePrices = dates.slice(0, period).map((date) => parseFloat(timeSeries[date]['4. close']));
	} else if (type === 'crypto') {
		closePrices = timeSeries.slice(0, period).map((priceData) => priceData[1]);
	}
	return closePrices.reduce((sum, price) => sum + price, 0) / closePrices.length;
}

export function determineTrend(timeSeries, type) {
	let latestClosePrice;
	if (type === 'stock') {
		const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
		latestClosePrice = parseFloat(timeSeries[dates[0]]['4. close']);
	} else if (type === 'crypto') {
		latestClosePrice = timeSeries[0][1];
	}
	const ma100 = calculateMovingAverage(timeSeries, 100, type);
	return latestClosePrice > ma100 ? 'Uptrend' : 'Downtrend';
}
