// import Bookmarks from '../icons/Bookmarks';
import Left from '../icons/Left';
// import Filter from '../icons/Filter';
import House from '../icons/House';
import { Link, useLocation } from '@tanstack/react-location';
import { useEffect, useState } from 'react';
import { useSearch } from '../context/searchContext';

export default function Navbar(): JSX.Element {
	const location = useLocation();
	const [from, setFrom] = useState<'home' | 'list'>();
	const { search, setSearch } = useSearch();
	const [lastListView, setLastListView] = useState<string>();

	useEffect(() => {
		const { pathname } = location.current;

		if (pathname.match(/^\/s\/\d+/)) {
			switch (location.current.search.from) {
				case 'home':
					setFrom('home');
					location.navigate({ ...location.current, search: {}, searchStr: '' }, true);
					break;
				case 'list':
					setFrom('list');
					location.navigate({ ...location.current, search: {}, searchStr: '' }, true);
					break;
				default: {
					setFrom(undefined);
				}
			}
		} else {
			setFrom(undefined);
		}

		if (pathname !== lastListView && (pathname === '/' || pathname.match(/^\/l\/.+/))) {
			setLastListView(pathname);
			if (lastListView) setSearch('');
			window.scrollTo(0, 0);
		}
	}, [location.current.pathname]);

	useEffect(() => {
		if (!lastListView && !search) return;
		if (location.current.pathname === lastListView) return;

		if (from === 'list') return location.history.back();
		location.history.push(lastListView || '/');
	}, [search]);

	return (
		<nav>
			<div className="menu">
				<div className="flex-row items-center">
					<Link to="/" disabled={location.current.pathname === '/' || from === 'home'}>
						<button
							disabled={location.current.pathname === '/'}
							onClick={from === 'home' ? location.history.back : undefined}
						>
							<House />
						</button>
					</Link>

					{from === 'list' && (
						<button onClick={location.history.back}>
							<Left />
						</button>
					)}
					<h1>Songbook</h1>
				</div>
				<div className="flex-row">
					{/* <button>
						<Filter />
					</button>
					<Link to="/bookmarks">
						<button>
							<Bookmarks />
						</button>
					</Link> */}
				</div>
			</div>
			<input
				className="search"
				value={search}
				onChange={(e) => setSearch(e.currentTarget.value)}
				placeholder="Search for title or text"
			/>
		</nav>
	);
}
