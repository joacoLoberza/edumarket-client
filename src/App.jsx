import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Lists from './pages/Lists';
import List from './pages/List';
import Schools from './pages/Schools';
import Cart from './pages/Cart';

export default function App() {
	return (
		<BrowserRouter future={{ 
    	v7_startTransition: true, 
    	v7_relativeSplatPath: true 
  	}}>
			<Routes>
				<Route element={ <MainLayout/> }>
					<Route index/>
					<Route path="schools">
						<Route index element={<Schools/>}/>
						<Route path="lists/:id" element={<Lists/>}/>
					</Route>
					<Route path='list/:id' element={<List/>}/>
					<Route path="cart" element={<Cart/>}/>
					<Route path="products"/>
				</Route>
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