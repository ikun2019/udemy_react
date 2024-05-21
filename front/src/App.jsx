import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';

import { AuthContext } from './shared/context/auth-context';

let logoutTimer;

function App() {
	const [token, setToken] = useState(false);
	const [userId, setUserId] = useState(null);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();

	const login = useCallback((uid, token, expirationDate) => {
		setToken(token);
		setUserId(uid);
		// * tokenの有効時間を設定
		const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		// * tokenをローカルストレージに保存
		localStorage.setItem(
			'userData',
			JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() })
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		localStorage.removeItem('userData');
	}, []);

	// * 自動的にログアウトする機能
	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	// * tokenが有効であれば自動的にログインする機能
	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));
		if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
			login(storedData.userid, storedData.token, new Date(storedData.expiration));
		}
	}, [login]);

	let routes;
	if (token) {
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
			value={{ isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId }}
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
