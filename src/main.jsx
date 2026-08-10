import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProvider from './AppContextProvider.jsx';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<AppProvider>
		<App/>
	</AppProvider>
)