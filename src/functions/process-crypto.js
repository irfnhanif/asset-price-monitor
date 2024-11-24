import { getLatestPriceAndRelativePercentage } from './peak-or-bottom.js';

export async function processCrypto(symbol) {
	try {
		const response = await fetch(`https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=100&interval=daily`);
		const data = await response.json();
		if (!data || !data.prices) {
			throw new Error(`No data for symbol: ${symbol}`);
		}

		const result = {
			symbol,
			data: getLatestPriceAndRelativePercentage(data, 'crypto'),
		};

		return result;
	} catch (error) {
		console.error(`Error processing crypto ${symbol}:`, error);
		return { symbol, data: null };
	}
}
