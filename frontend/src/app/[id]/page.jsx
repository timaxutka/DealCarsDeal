'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function DealerPage({ params }) {
	const router = useRouter();
	const { id } = use(params);
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddCarForm, setShowAddCarForm] = useState(false);
	const [editCarId, setEditCarId] = useState(null);
	const [carFormData, setCarFormData] = useState({
		firm: 'Honda',
		model: 'Accord',
		year: 2005,
		power: 155,
		color: 'Black',
		price: 700000,
		dealer_id: id,
	});

	useEffect(() => {
		const fetchCars = async () => {
			try {
				const response = await fetch('http://localhost:8000/cars');

				if (!response.ok) {
					throw new Error('Ошибка ответа сервера');
				}
				const data = await response.json();
				const dealerCars = data.filter(car => car.dealer_id === parseInt(id));
				setCars(dealerCars);
			} catch (error) {
				console.error('Ошибка запроса:', error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCars();
	}, [id]);

	const handleAddCar = async e => {
		e.preventDefault();

		try {
			console.log('Отправляемые данные:', carFormData);

			const response = await fetch('http://localhost:8000/cars', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(carFormData),
			});

			if (!response.ok) {
				throw new Error('Ошибка добавления машины');
			}

			const addedCar = await response.json();

			await fetch('http://localhost:3000/api/rabbitmq', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ action: 'add', car: addedCar }),
			});

			setCars(prevCars => [...prevCars, addedCar]);
			setShowAddCarForm(false);
			setCarFormData({
				firm: 'Honda',
				model: 'Accord',
				year: 2005,
				power: 155,
				color: 'Black',
				price: 700000,
				dealer_id: id,
			});
			window.location.reload();
		} catch (error) {
			console.error('Ошибка добавления:', error);
			setError(error.message);
		}
	};

	const handleUpdateCar = async e => {
		e.preventDefault();

		try {
			const response = await fetch(`http://localhost:8000/cars/${editCarId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(carFormData),
			});

			if (!response.ok) {
				throw new Error('Ошибка обновления машины');
			}
			const updatedCar = await response.json();

			await fetch('http://localhost:3000/api/rabbitmq', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					action: 'update',
					car: updatedCar,
				}),
			});

			setCars(prevCars =>
				prevCars.map(car => (car.id === editCarId ? updatedCar : car))
			);
			setEditCarId(null);
			setCarFormData({
				firm: 'Honda',
				model: 'Accord',
				year: 2005,
				power: 155,
				color: 'Black',
				price: 700000,
				dealer_id: id,
			});
		} catch (error) {
			console.error('Ошибка обновления:', error);
			setError(error.message);
		}
	};

	const handleDeleteCar = async id => {
		try {
			const response = await fetch(`http://localhost:8000/cars/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Ошибка удаления машины');
			}

			await fetch('http://localhost:3000/api/rabbitmq', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					action: 'delete',
					id: id,
				}),
			});

			setCars(prevCars => prevCars.filter(car => car.id !== id));
		} catch (error) {
			console.error('Ошибка:', error);
			setError(error.message);
		}
	};

	const handleEditClick = car => {
		setEditCarId(car.id);
		setCarFormData({
			id: car.id,
			firm: car.firm,
			model: car.model,
			year: car.year,
			power: car.power,
			color: car.color,
			price: car.price,
			dealer_id: car.dealer_id,
		});
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-800 text-white">
			<div className="mx-52"> {/* Добавленный div для отступов */}
				<h1 className="text-2xl font-bold text-center mb-5">Дилер ID: {id}</h1>
				<div className="flex justify-between mb-5">
					<button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition" onClick={() => router.push('/')}>
						Назад
					</button>
					<button
						onClick={() => {
							setShowAddCarForm(!showAddCarForm);
							setEditCarId(null);
							setCarFormData({
								firm: 'Honda',
								model: 'Accord',
								year: 2005,
								power: 155,
								color: 'Black',
								price: 700000,
								dealer_id: id,
							});
						}}
						className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
					>
						{showAddCarForm ? 'Скрыть форму' : 'Добавить машину'}
					</button>
				</div>

				{(showAddCarForm || editCarId) && (
					<form
						onSubmit={editCarId ? handleUpdateCar : handleAddCar}
						className="bg-gray-700 p-5 rounded shadow-md mb-5"
					>
						<h2 className="text-xl mb-3">{editCarId ? 'Редактировать машину' : 'Добавить машину'}</h2>
						<input
							type='text'
							placeholder='Фирма'
							value={carFormData.firm}
							onChange={e => setCarFormData({ ...carFormData, firm: e.target.value })}
							required
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							type='text'
							placeholder='Модель'
							value={carFormData.model}
							onChange={e => setCarFormData({ ...carFormData, model: e.target.value })}
							required
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							type='number'
							placeholder='Год'
							value={carFormData.year}
							onChange={e => setCarFormData({ ...carFormData, year: parseInt(e.target.value) })}
							required
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							type='number'
							placeholder='Мощность'
							value={carFormData.power}
							onChange={e => setCarFormData({ ...carFormData, power: parseInt(e.target.value) })}
							required
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							type='text'
							placeholder='Цвет'
							value={carFormData.color}
							onChange={e => setCarFormData({ ...carFormData, color: e.target.value })}
							required
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<input
							type='number'
							placeholder='Цена'
							value={carFormData.price}
							onChange={e => setCarFormData({ ...carFormData, price: parseFloat(e.target.value) })}
							required
							className="border rounded p-2 mb-2 w-full bg-gray-600 text-white"
						/>
						<button type='submit' className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
							{editCarId ? 'Обновить' : 'Добавить'}
						</button>
					</form>
				)}

				{loading && <p>Загрузка...</p>}
				{error && <p>Ошибка: {error}</p>}
				{cars.length > 0 ? (
					<table className="min-w-full bg-gray-700 border border-gray-600">
						<thead>
							<tr className="bg-gray-600">
								<th className="text-left py-2 px-4 border-b">Фирма</th>
								<th className="text-left py-2 px-4 border-b">Модель</th>
								<th className="text-left py-2 px-4 border-b">Год</th>
								<th className="text-left py-2 px-4 border-b">Мощность</th>
								<th className="text-left py-2 px-4 border-b">Цвет</th>
								<th className="text-left py-2 px-4 border-b">Цена</th>
								<th className="text-left py-2 px-4 border-b">Действия</th>
							</tr>
						</thead>
						<tbody>
							{cars.map(car => (
								<tr key={car.id} className="hover:bg-gray-600">
									<td className="py-2 px-4 border-b">{car.firm}</td>
									<td className="py-2 px-4 border-b">{car.model}</td>
									<td className="py-2 px-4 border-b">{car.year}</td>
									<td className="py-2 px-4 border-b">{car.power}</td>
									<td className="py-2 px-4 border-b">{car.color}</td>
									<td className="py-2 px-4 border-b">{car.price}</td>
									<td className="py-2 px-4 border-b">
										<button
											onClick={() => handleEditClick(car)}
											className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition"
										>
											Редактировать
										</button>
										<button
											onClick={() => handleDeleteCar(car.id)}
											className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition ml-2"
										>
											Удалить
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>У этого дилера нет машин</p>
				)}
			</div> {/* Конец добавленного div для отступов */}
		</div>
	);
}
