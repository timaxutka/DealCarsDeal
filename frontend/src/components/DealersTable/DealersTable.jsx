import './index.css'; 

import { useState } from 'react';

export default function DealersTable({ dealers, onDealerClick }) {
	const [editMode, setEditMode] = useState(null);
	const [isAddFormVisible, setIsAddFormVisible] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		city: '',
		address: '',
		area: '',
		rating: '',
	});
	const [newDealerData, setNewDealerData] = useState({
		name: '',
		city: '',
		address: '',
		area: '',
		rating: '',
	});

	const handleInputChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleNewDealerChange = e => {
		setNewDealerData({
			...newDealerData,
			[e.target.name]: e.target.value,
		});
	};

	const handleEdit = dealer => {
		setEditMode(dealer.id);
		setFormData(dealer);
	};

	const sendRabbitMQMessage = async message => {
		try {
			await fetch('http://localhost:3000/api/rabbitmq', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(message),
			});
		} catch (error) {
			console.error('Ошибка отправки сообщения в RabbitMQ:', error);
		}
	};

	const handleSave = async id => {
		await fetch(`http://localhost:8000/dealers/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		sendRabbitMQMessage({
			action: 'update',
			entity: 'dealer',
			id,
			data: formData,
		});

		setEditMode(null);
		window.location.reload();
	};

	const handleDelete = async id => {
		await fetch(`http://localhost:8000/dealers/${id}`, {
			method: 'DELETE',
		});

		sendRabbitMQMessage({
			action: 'delete',
			entity: 'dealer',
			id,
		});

		window.location.reload();
	};

	const handleAddDealer = async () => {
		const response = await fetch('http://localhost:8000/dealers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newDealerData),
		});

		const addedDealer = await response.json();

		sendRabbitMQMessage({
			action: 'add',
			entity: 'dealer',
			data: addedDealer,
		});

		setNewDealerData({
			name: '',
			city: '',
			address: '',
			area: '',
			rating: '',
		});
		setIsAddFormVisible(false);
		window.location.reload();
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-800 text-white">
			<h1 className="text-2xl font-bold text-center mb-5">Дилеры</h1>
			<div className="flex justify-end mb-5">
				<button
					className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
					onClick={() => setIsAddFormVisible(!isAddFormVisible)}
				>
					{isAddFormVisible ? 'Скрыть форму' : 'Добавить дилера'}
				</button>
			</div>
			{isAddFormVisible && (
				<div className="mt-5 p-5 bg-gray-700 rounded shadow-md">
					<h2 className="text-xl mb-3">Добавить нового дилера</h2>
					<form>
						<input
							name='name'
							placeholder='Название'
							value={newDealerData.name}
							onChange={handleNewDealerChange}
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							name='city'
							placeholder='Город'
							value={newDealerData.city}
							onChange={handleNewDealerChange}
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							name='address'
							placeholder='Адрес'
							value={newDealerData.address}
							onChange={handleNewDealerChange}
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							name='area'
							placeholder='Округ'
							value={newDealerData.area}
							onChange={handleNewDealerChange}
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							name='rating'
							type='number'
							placeholder='Рейтинг'
							value={newDealerData.rating}
							onChange={handleNewDealerChange}
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<button
							type='button'
							onClick={handleAddDealer}
							className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
						>
							Добавить
						</button>
					</form>
				</div>
			)}
			<div className="overflow-x-auto mt-5">
				<table className="min-w-full bg-gray-700 border border-gray-600">
					<thead>
						<tr className="bg-gray-600">
							<th className="text-left py-2 px-4 border-b">ID дилера</th>
							<th className="text-left py-2 px-4 border-b">Название</th>
							<th className="text-left py-2 px-4 border-b">Город</th>
							<th className="text-left py-2 px-4 border-b">Адрес</th>
							<th className="text-left py-2 px-4 border-b">Округ</th>
							<th className="text-left py-2 px-4 border-b">Рейтинг</th>
							<th className="text-left py-2 px-4 border-b">Действия</th>
						</tr>
					</thead>
					<tbody>
						{dealers
							.slice()
							.sort((a, b) => a.id - b.id)
							.map(dealer => (
								<tr key={dealer.id} className="hover:bg-gray-600">
									{editMode === dealer.id ? (
										<>
											<td className="py-2 px-4 border-b">{dealer.id}</td>
											<td className="py-2 px-4 border-b">
												<input
													name='name'
													value={formData.name}
													onChange={handleInputChange}
													className="border rounded p-1 w-full bg-gray-600 text-white"
												/>
											</td>
											<td className="py-2 px-4 border-b">
												<input
													name='city'
													value={formData.city}
													onChange={handleInputChange}
													className="border rounded p-1 w-full bg-gray-600 text-white"
												/>
											</td>
											<td className="py-2 px-4 border-b">
												<input
													name='address'
													value={formData.address}
													onChange={handleInputChange}
													className="border rounded p-1 w-full bg-gray-600 text-white"
												/>
											</td>
											<td className="py-2 px-4 border-b">
												<input
													name='area'
													value={formData.area}
													onChange={handleInputChange}
													className="border rounded p-1 w-full bg-gray-600 text-white"
												/>
											</td>
											<td className="py-2 px-4 border-b">
												<input
													name='rating'
													type='number'
													value={formData.rating}
													onChange={handleInputChange}
													className="border rounded p-1 w-full bg-gray-600 text-white"
												/>
											</td>
											<td className="py-2 px-4 border-b">
												<button
													onClick={() => handleSave(dealer.id)}
													className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition"
												>
													Сохранить
												</button>
											</td>
										</>
									) : (
										<>
											<td className="text-left py-2 px-4 border-b">{dealer.id}</td>
											<td className="text-left py-2 px-4 border-b">{dealer.name}</td>
											<td className="text-left py-2 px-4 border-b">{dealer.city}</td>
											<td className="text-left py-2 px-4 border-b">{dealer.address}</td>
											<td className="text-left py-2 px-4 border-b">{dealer.area}</td>
											<td className="text-left py-2 px-4 border-b">{dealer.rating}</td>
											<td className="text-left py-2 px-4 border-b">
												<button
													onClick={() => handleEdit(dealer)}
													className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition"
												>
													Редактировать
												</button>
												<button
													onClick={() => handleDelete(dealer.id)}
													className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition ml-2"
												>
													Удалить
												</button>
												<button
													onClick={() => onDealerClick(dealer.id)}
													className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600 transition ml-2"
												>
													Показать машины
												</button>
											</td>
										</>
									)}
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
