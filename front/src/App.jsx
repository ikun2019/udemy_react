import React, { useCallback, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';

import { AuthContext } from './shared/context/auth-context';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);

	const login = useCallback((uid) => {
		setIsLoggedIn(true);
		setUserId(uid);
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
		setUserId(null);
	}, []);

	let routes;
	if (isLoggedIn) {
		routes = (
			<>
				<Route exact path="/" element={<Users />}></Route>
				<Route path="/places/new" element={<NewPlace />}></Route>
				<Route path="/places/:placeId" element={<UpdatePlace />}></Route>
				<Route path="/:userId/places" element={<UserPlaces />}></Route>
				<Route path="*" element={<Navigate to="/" />}></Route>
			</>
		);
	} else {
		routes = (
			<>
				<Route exact path="/" element={<Users />}></Route>
				<Route path="/:userId/places" element={<UserPlaces />}></Route>
				<Route path="/auth" element={<Auth />}></Route>
				<Route path="*" element={<Navigate to="/auth" />}></Route>
			</>
		);
	}

	return (
		<AuthContext.Provider
			value={{ isLoggedIn: isLoggedIn, login: login, logout: logout, userId: userId }}
		>
			<BrowserRouter>
				<MainNavigation />
				<main>
					<Routes>{routes}</Routes>
				</main>
			</BrowserRouter>
		</AuthContext.Provider>
	);
}

export default App;
