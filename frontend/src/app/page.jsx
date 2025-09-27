'use client';
import DealersTable from '@/components/DealersTable/DealersTable';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
	const [dealers, setDealers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const fetchDealers = async () => {
			try {
				const response = await fetch('http://localhost:8000/dealers');
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();
				setDealers(data);
			} catch (error) {
				console.error('Fetch error:', error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchDealers();
	}, []);
	
	const handleDealerClick = dealerId => {
		router.push(`/${dealerId}`);
	};

	return (
		<div className='container'>
			{loading && <p>Загрузка...</p>}
			{error && <p>Ошибка: {error}</p>}
			<DealersTable dealers={dealers} onDealerClick={handleDealerClick} />
		</div>
	);
}
