export const postJson = body =>
	({
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: typeof body === 'string'
			? body
			: JSON.stringify(body),
	})