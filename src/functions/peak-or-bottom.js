import { determineTrend } from './find-trend';

function findCurrentPeakOrBottom(timeSeries, trend) {
	const dates = Object.keys(timeSeries).sort((a, b) => new Date(a) - new Date(b));
	const lookAheadPeriod = 20;

	let currentPeak = 0;
	let currentBottom = Number.POSITIVE_INFINITY;

	for (let i = 0; i < dates.length - lookAheadPeriod; i++) {
		const date = dates[i];
		const close = parseFloat(timeSeries[date]['4. close']);

		if (trend === 'Uptrend') {
			const isConfirmedPeak = Array.from({ length: lookAheadPeriod }, (_, j) => {
				const futureDate = dates[i + j + 1];
				return parseFloat(timeSeries[futureDate]['4. close']) < close;
			}).every((isLower) => isLower);
			if (isConfirmedPeak && close > currentPeak) {
				currentPeak = close;
			}
		} else if (trend === 'Downtrend') {
			const isConfirmedBottom = Array.from({ length: lookAheadPeriod }, (_, j) => {
				const futureDate = dates[i + j + 1];
				return parseFloat(timeSeries[futureDate]['4. close']) > close;
			}).every((isHigher) => isHigher);
			if (isConfirmedBottom && close < currentBottom) {
				currentBottom = close;
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

	const relativePercentage = ((latestClosePrice - currentPeakOrBottom) / currentPeakOrBottom) * 100;
	return {
		price: latestClosePrice,
		relative_percentage: relativePercentage.toFixed(2) + '%',
	};
}
