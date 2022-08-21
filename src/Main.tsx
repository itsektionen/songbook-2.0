import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { BookmarksProvider } from './context/bookmarksContext';
import { SearchProvider } from './context/searchContext';
import { SongProvider } from './context/songContext';
import './style/index.scss';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<SongProvider>
			<SearchProvider>
				<BookmarksProvider>
					<App />
				</BookmarksProvider>
			</SearchProvider>
		</SongProvider>
		<ToastContainer autoClose={3000} closeButton newestOnTop position="bottom-right" />
	</React.StrictMode>
);
