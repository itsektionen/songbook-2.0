import { DefaultGenerics, Outlet, ReactLocation, Route, Router } from '@tanstack/react-location';
import SongList from './views/SongList';
import Song from './views/Song';
import Navbar from './components/Navbar';
import { parseBase64Ids } from './util/base64Ids';
import BookmarksList from './views/BookmarksList';
import Bookmark from './views/Bookmark';

import '@fontsource-variable/open-sans';

const location = new ReactLocation();

const routes: Route<DefaultGenerics>[] = [
	{ path: '/', element: <SongList /> },
	{ path: '/s/:songId', element: <Song /> },
	{
		path: '/l/:songIds',
		element: <SongList />,
		loader: ({ params: { songIds } }) => parseBase64Ids(songIds),
	},
	{
		path: '/bookmarks/:bookmarkId',
		element: <Bookmark />,
	},
	{
		path: '/bookmarks',
		element: <BookmarksList />,
	},
];

function App() {
	return (
		<Router location={location} routes={routes}>
			<Navbar />
			<Outlet />
		</Router>
	);
}

export default App;
