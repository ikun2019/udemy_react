import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
	{
		id: 'p1',
		title: 'test title',
		description: 'test description',
		imageUrl:
			'https://www.google.com/maps/place/%E3%82%A8%E3%83%B3%E3%83%91%E3%82%A4%E3%82%A2%E3%83%BB%E3%82%B9%E3%83%86%E3%83%BC%E3%83%88%E3%83%BB%E3%83%93%E3%83%AB/@40.7484405,-73.9856644,3a,75y,90t/data=!3m8!1e2!3m6!1sAF1QipNAG7iptYkmXdRODIfH30UToKMxcwIycF8ou5RI!2e10!3e12!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNAG7iptYkmXdRODIfH30UToKMxcwIycF8ou5RI%3Dw120-h86-k-no!7i1080!8i774!4m16!1m8!3m7!1s0x89c259a9b3117469:0xd134e199a405a163!2z44Ko44Oz44OR44Kk44Ki44O744K544OG44O844OI44O744OT44Or!8m2!3d40.7484405!4d-73.9856644!10e1!16zL20vMDJuZF8!3m6!1s0x89c259a9b3117469:0xd134e199a405a163!8m2!3d40.7484405!4d-73.9856644!10e5!16zL20vMDJuZF8?entry=ttu#',
		address: '20 W 34th St., New York, NY 10001',
		location: {
			lat: 40.7505766,
			lng: -73.9911322,
		},
		creator: 'u1',
	},
];

const UserPlaces = () => {
	const { userId } = useParams();
	const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
	return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
