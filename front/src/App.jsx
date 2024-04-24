import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';

function App() {
	return (
		<BrowserRouter>
			<MainNavigation />
			<main>
				<Routes>
					<Route exact path="/" element={<Users />}></Route>
					<Route path="/places/new" element={<NewPlace />}></Route>
					<Route path="*" element={<Navigate to="/" />}></Route>
				</Routes>
			</main>
		</BrowserRouter>
	);
}

export default App;
