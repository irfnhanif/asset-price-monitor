import { determineTrend } from './find-trend';

function findCurrentPeakOrBottom(timeSeries, trend) {
	const dates = Object.keys(timeSeries).sort((a, b) => new Date(a) - new Date(b));
	const lookAheadPeriod = 20;

	let currentPeak = 0;
	let currentBottom = Number.POSITIVE_INFINITY;

	for (let i = 0; i < dates.length - lookAheadPeriod; i++) {
		const date = dates[i];
		const closePrice = parseFloat(timeSeries[date]['4. close']);

		if (trend === 'Uptrend') {
			for (let j = i + 1; j < i + lookAheadPeriod && j < dates.length; j++) {
				const futureClosePrice = parseFloat(timeSeries[dates[j]]['4. close']);
				if (futureClosePrice > currentPeak) {
					currentPeak = futureClosePrice;
				}
			}
		} else if (trend === 'Downtrend') {
			for (let j = i + 1; j < i + lookAheadPeriod && j < dates.length; j++) {
				const futureClosePrice = parseFloat(timeSeries[dates[j]]['4. close']);
				if (futureClosePrice < currentBottom) {
					currentBottom = futureClosePrice;
				}
			}
		}
	}

	return trend === 'Uptrend' ? currentPeak : currentBottom;
}

export function getLatestPriceAndRelativePercentage(data, symbol) {
	const timeSeries = data['Time Series (Daily)'];
	const trend = determineTrend(timeSeries);
	const currentPeakOrBottom = findCurrentPeakOrBottom(timeSeries, trend);

	const latestDate = Object.keys(timeSeries)[0];
	const latestClosePrice = parseFloat(timeSeries[latestDate]['4. close']);

	const percentageChange = ((latestClosePrice - currentPeakOrBottom) / currentPeakOrBottom) * 100;
	const relativePercentage = (percentageChange >= 0 ? '+' : '') + percentageChange.toFixed(2) + '%';

	return {
		price: latestClosePrice,
		peak_or_bottom_price: currentPeakOrBottom,
		relative_percentage: relativePercentage,
	};
}

