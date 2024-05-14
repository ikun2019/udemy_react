import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

import { useHttpClient } from '../../shared/hooks/http-hooks';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = () => {
	const [loadedPlaces, setLoadedPlaces] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const { userId } = useParams();

	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const responseData = await sendRequest(`http://localhost:8080/api/places/user/${userId}`);
				setLoadedPlaces(responseData.places);
			} catch (error) {}
		};
		fetchPlaces();
	}, [sendRequest, userId]);

	const placeDeleteHandler = (deletedPlaceId) => {
		setLoadedPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== deletedPlaceId));
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner asOverlay />
				</div>
			)}
			{!isLoading && loadedPlaces && (
				<PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
			)}
		</>
	);
};

export default UserPlaces;
