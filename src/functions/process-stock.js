import { getLatestPriceAndRelativePercentage } from './peak-or-bottom.js';

export async function processStock(symbol, apiKey) {
	try {
		const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
		const data = await response.json();
		if (!data || !data['Time Series (Daily)']) {
			throw new Error(`No data for symbol: ${symbol}`);
		}

		const result = {
			symbol,
			data: getLatestPriceAndRelativePercentage(data, symbol),
		};

		return result;
	} catch (error) {
		console.error(`Error processing stock ${symbol}:`, error);
		return { symbol, data: null };
	}
}
