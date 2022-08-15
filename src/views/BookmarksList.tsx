import { Link } from '@tanstack/react-location';
import BookmarkListItem from '../components/BookmarkListItem';
import { useBookmarks } from '../context/bookmarksContext';
import Plus from '../icons/Plus';

export default function BookmarksList(): JSX.Element {
	const { bookmarks } = useBookmarks();
	return (
		<main className="BookmarksList">
			<ul>
				<Link className="list-item">
					<li>
						<div className="flex-row width-full items-center">
							<Plus size="sm" className="margin-r-sm" />
							<h1>New list</h1>
						</div>
					</li>
				</Link>
				{Object.values(bookmarks).map((bookmark) => (
					<BookmarkListItem bookmark={bookmark} openEditModal={() => {}} key={bookmark.id} />
				))}
			</ul>
		</main>
	);
}
