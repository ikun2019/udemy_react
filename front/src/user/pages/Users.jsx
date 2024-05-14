import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [loadedUsers, setLoadedUsers] = useState();

	useEffect(() => {
		const sendRequest = async () => {
			setIsLoading(true);
			try {
				setError(null);
				const response = await fetch('http://localhost:8080/api/users');
				console.log('response =>', response);
				const responseData = await response.json();
				console.log('responseData =>', responseData);
				if (!response.ok) {
					throw new Error(responseData.message);
				}
				setLoadedUsers(responseData.users);
			} catch (error) {
				setError(error.message || 'Something went wrong.');
			}
		};
		sendRequest();
		setIsLoading(false);
	}, []);

	const errorHandler = () => {
		setError(null);
	};

	return (
		<>
			<ErrorModal error={error} onClear={errorHandler} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
		</>
	);
};

export default Users;
