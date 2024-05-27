import { http, HttpResponse, delay } from 'msw';

const baseUrl = 'http://localhost:3030';

export const handlers = [
	http.get(`${baseUrl}/scoops`, () => {
		// you do not need to stringify the JSON response
		return HttpResponse.json([
			{
				name: 'Chocolate',
				imagePath: '/images/chocolate.png',
			},
			{
				name: 'Vanilla',
				imagePath: '/images/vanilla.png',
			},
		]);
	}),
	http.get(`${baseUrl}/toppings`, () => {
		// you do not need to stringify the JSON response
		return HttpResponse.json([
			{
				name: 'Mochi',
				imagePath: '/images/mochi.png',
			},
			{
				name: 'Cherries',
				imagePath: '/images/cherries.png',
			},
			{
				name: 'Hot fudge',
				imagePath: '/images/hot-fudge.png',
			},
		]);
	}),
	http.post(`${baseUrl}/order`, async () => {
		await delay(500);
		return HttpResponse.json({ orderNumber: 123456789 }, { status: 201 });
	}),
];
