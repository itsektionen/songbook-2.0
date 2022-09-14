import { useState } from 'react';
import BookmarkListItem from '../components/BookmarkListItem';
import NewBookmarkModal from '../components/NewBookmarkModal';
import Spinner from '../components/Spinner';
import { useBookmarks } from '../context/bookmarksContext';
import Plus from '../icons/Plus';

export default function BookmarksList(): JSX.Element {
	const { bookmarks } = useBookmarks();
	const [newBookmarkModalOpen, setNewBookmarkModalOpen] = useState<boolean>(false);

	return (
		<main className="BookmarksList">
			{bookmarks === undefined ? (
				<Spinner />
			) : (
				<ul>
					<button className="list-item width-full" onClick={() => setNewBookmarkModalOpen(true)}>
						<li>
							<div className="flex-row width-full items-center">
								<Plus size="sm" className="margin-r-sm" />
								<h1>New list</h1>
							</div>
						</li>
					</button>
					{Object.values(bookmarks).map((bookmark) => (
						<BookmarkListItem bookmark={bookmark} key={bookmark.id} />
					))}
				</ul>
			)}
			<NewBookmarkModal
				isOpen={newBookmarkModalOpen}
				onClose={() => setNewBookmarkModalOpen(false)}
			/>
		</main>
	);
}
