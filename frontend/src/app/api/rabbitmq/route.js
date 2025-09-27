import amqplib from 'amqplib';

export async function POST(req) {
	try {
		const message = await req.json();
		const connection = await amqplib.connect('amqp://localhost');
		const channel = await connection.createChannel(); 
		const exchange = 'cars_events_exchange';
		const queue = 'cars_events_queue';

		await channel.assertExchange(exchange, 'direct', { durable: true });
		await channel.assertQueue(queue);
		await channel.bindQueue(queue, exchange, '');

		channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));

		await channel.close();
		await connection.close();

		return new Response(JSON.stringify({ success: true }), { status: 200 });
		} catch (error) {
			console.error('RabbitMQ Error:', error);
			return new Response(JSON.stringify({ error: 'Failed to send message' }), {
				status: 500,
			});
		}
}
