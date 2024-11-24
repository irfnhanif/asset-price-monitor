import { determineTrend } from './find-trend';

function findCurrentPeakOrBottom(timeSeries, trend, type) {
	const dates = Object.keys(timeSeries).sort((a, b) => (type === 'stock' ? new Date(a) - new Date(b) : new Date(b) - new Date(a)));
	const lookAheadPeriod = 20;

	let currentPeak = 0;
	let currentBottom = Number.POSITIVE_INFINITY;

	for (let i = 0; i < dates.length - lookAheadPeriod; i++) {
		const date = dates[i];
		const closePrice = parseFloat(type === 'stock' ? timeSeries[date]['4. close'] : timeSeries[date][1]);

		if (trend === 'Uptrend') {
			for (let j = i + 1; j < i + lookAheadPeriod && j < dates.length; j++) {
				const futureClosePrice = parseFloat(type === 'stock' ? timeSeries[dates[j]]['4. close'] : timeSeries[dates[j]][1]);
				if (futureClosePrice > currentPeak) {
					currentPeak = futureClosePrice;
				}
			}
		} else if (trend === 'Downtrend') {
			for (let j = i + 1; j < i + lookAheadPeriod && j < dates.length; j++) {
				const futureClosePrice = parseFloat(type === 'stock' ? timeSeries[dates[j]]['4. close'] : timeSeries[dates[j]][1]);
				if (futureClosePrice < currentBottom) {
					currentBottom = futureClosePrice;
				}
			}
		}
	}

	return trend == 'Uptrend' ? currentPeak : currentBottom;
}

export function getLatestPriceAndRelativePercentage(data, type) {
	const timeSeries = type === 'stock' ? data['Time Series (Daily)'] : data['prices'].reverse();
	const trend = determineTrend(timeSeries, type);
	const currentPeakOrBottom = findCurrentPeakOrBottom(timeSeries, trend, type);

	const latestDate = type === 'stock' ? Object.keys(timeSeries)[0] : new Date(timeSeries[0][0]).toISOString();
	const latestClosePrice = type === 'stock' ? parseFloat(timeSeries[latestDate]['4. close']) : parseFloat(timeSeries[0][1]);

	const percentageChange = ((latestClosePrice - currentPeakOrBottom) / currentPeakOrBottom) * 100;
	const relativePercentage = (percentageChange >= 0 ? '+' : '') + percentageChange.toFixed(2) + '%';

	return {
		price: latestClosePrice,
		peak_or_bottom_price: currentPeakOrBottom,
		relative_percentage: relativePercentage,
	};
}
