import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Schools from './pages/Schools';
	import SchoolsList from './pages/Schools/SchoolsList.jsx';
	import SchoolLists from './pages/Schools/SchoolLists.jsx';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Preview from './pages/Preview';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={ <MainLayout/> }>
					<Route index element={<Home/>}/>
					<Route path="schools" element={<Schools/>}>
						<Route index element={<SchoolsList/>}/>
						<Route path="lists/:id" element={<SchoolLists/>}/>
					</Route>
					<Route path="cart" element={<Cart/>}/>
					<Route path="products"/>
				</Route>
				<Route path='list/:id' element={<Preview/>}/>
				<Route path="login" element={<Login/>}/>
				<Route path="register" element={<Register/>}/>
				<Route path="profile">
					<Route index/>
					<Route path="lists"/>
					<Route path="orders"/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}