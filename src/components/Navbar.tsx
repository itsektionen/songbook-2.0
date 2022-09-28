import Bookmarks from '../icons/Bookmarks';
import Filter from '../icons/Filter';
import Left from '../icons/Left';
import House from '../icons/House';
import { Link, useLocation } from '@tanstack/react-location';
import { useEffect, useState } from 'react';
import { useSearch } from '../context/searchContext';
import FilterModal from './FilterModal';
import Search from '../icons/Search';
import Clear from '../icons/Clear';

export default function Navbar(): JSX.Element {
	const location = useLocation();
	const [from, setFrom] = useState<'home' | 'list'>();
	const { search, setSearch, filter, setFilter } = useSearch();
	const [lastListView, setLastListView] = useState<string>();
	const [filterOpen, setFilterOpen] = useState<boolean>(false);

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
		if (location.current.pathname === lastListView) return;
		if (!lastListView && (!search || !filter.length)) return;

		if (from === 'list') return location.history.back();
		location.history.push(lastListView || '/');
	}, [search, filter]);

	return (
		<>
			<nav className="navbar">
				<div className="menu">
					<div className="flex-row items-center">
						<Link to="/" disabled={location.current.pathname === '/' || from === 'home'}>
							<button onClick={from === 'home' ? location.history.back : undefined}>
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
						<button onClick={() => setFilterOpen(true)}>
							<Filter />
						</button>
						<Link to="/bookmarks">
							<button>
								<Bookmarks />
							</button>
						</Link>
					</div>
				</div>
				<div className="search">
					<button onClick={() => document.getElementById('searchbar')?.focus()}>
						<Search size="sm" />
					</button>
					<input
						id="searchbar"
						value={search}
						onChange={(e) => setSearch(e.currentTarget.value)}
						placeholder="Search for title or text"
					/>
					{!!search && (
						<button
							onClick={() => {
								setSearch('');
								document.getElementById('searchbar')?.focus();
							}}
						>
							<Clear size="sm" />
						</button>
					)}
				</div>
			</nav>
			<FilterModal
				isOpen={filterOpen}
				onClose={() => setFilterOpen(false)}
				onConfirm={setFilter}
				startValue={filter}
			/>
		</>
	);
}
