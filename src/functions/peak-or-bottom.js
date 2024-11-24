import { determineTrend } from './find-trend';

export function getLatestPriceAndRelativePercentage(data, symbol, type) {
	const timeSeries = type === 'stock' ? data['Time Series (Daily)'] : data['data'];
	const trend = determineTrend(timeSeries, type);
	return findCurrentPeakOrBottom(timeSeries, trend, type);
}

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

	return { currentPeak, currentBottom };
}
