import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Loggin from './pages/Loggin';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={ <MainLayout/> }>
					<Route index/>
					<Route path="lists"/>
					<Route path="cart"/>
					<Route path="products"/>
				</Route>
				<Route path="loggin" element={<Loggin/>}/>
				<Route path="register"/>
				<Route path="profile">
					<Route index/>
					<Route path="lists"/>
					<Route path="orders"/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}