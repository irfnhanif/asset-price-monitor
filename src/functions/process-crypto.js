import { getLatestPriceAndRelativePercentage } from './peak-or-bottom.js';

export async function processCrypto(symbol) {
	try {
		const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=100`);
		const data = await response.json();
		if (!data || !data['data']) {
			throw new Error(`No data for symbol: ${symbol}`);
		}

		const result = {
			symbol,
			data: getLatestPriceAndRelativePercentage(data, symbol, 'crypto'),
		};

		return result;
	} catch (error) {
		console.error(`Error processing crypto ${symbol}:`, error);
		return { symbol, data: null };
	}
}
