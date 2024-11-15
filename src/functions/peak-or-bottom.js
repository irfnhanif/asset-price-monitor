import { determineTrend } from './find-trend';

function findCurrentPeakOrBottom(timeSeries, trend) {
	const dates = Object.keys(timeSeries).sort((a, b) => new Date(a) - new Date(b));
	const lookAheadPeriod = 3;

	let currentPeak = 0;
	let currentBottom = Number.POSITIVE_INFINITY;

	for (let i = 0; i < dates.length - lookAheadPeriod; i++) {
		const date = dates[i];
		const high = parseFloat(timeSeries[date]['2. high']);
		const low = parseFloat(timeSeries[date]['3. low']);

		if (trend === 'Uptrend') {
			const isConfirmedPeak = Array.from({ length: lookAheadPeriod }, (_, j) => parseFloat(timeSeries[dates[i + j + 1]]['4. close'])).every(
				(futurePrice) => futurePrice < high
			);
			if (isConfirmedPeak && high > currentPeak) {
				currentPeak = high;
			}
		} else if (trend === 'Downtrend') {
			const isConfirmedBottom = Array.from({ length: lookAheadPeriod }, (_, j) =>
				parseFloat(timeSeries[dates[i + j + 1]]['4. close'])
			).every((futurePrice) => futurePrice > low);
			if (isConfirmedBottom && low < currentBottom) {
				currentBottom = low;
			}
		}
	}
	return trend === 'Uptrend' ? currentPeak : currentBottom;
}

function getLatestPriceAndRelativePercentage(data, symbol) {
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
