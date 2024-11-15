/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import 'dotenv/config';
import { processStock } from './functions/process-stock.js';

export default {
	async fetch(request, env, ctx) {
		const { stocks } = await request.json();
		const apiKey = process.env.STOCK_API_KEY;

		const stockResponses = await Promise.all(stocks.map((symbol) => processStock(symbol, apiKey)));
		const result = stockResponses.reduce((acc, { symbol, data }) => {
			if (data) acc[symbol] = data;
			return acc;
		}, {});

		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
