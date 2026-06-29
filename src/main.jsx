import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './contexts/UserContext.jsx';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<UserProvider>
			<App/>
		</UserProvider>
	</React.StrictMode>
)