const calculateMovingAverage = (data, period = 100) => {
	const timeSeries = data['Time Series (Daily)'];
	const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));

	const closePrices = dates.slice(0, period).map((date) => parseFloat(timeSeries[date]['4. close']));
	return closePrices.reduce((sum, price) => sum + price, 0) / closePrices.length;
};

export const determineTrend = (data) => {
	const latestClosePrice = parseFloat(data['Time Series (Daily)'][Object.keys(data['Time Series (Daily)'])[0]]['4. close']);
	const ma100 = calculateMovingAverage(data);
	return latestClosePrice > ma100 ? 'Uptrend' : 'Downtrend';
};
