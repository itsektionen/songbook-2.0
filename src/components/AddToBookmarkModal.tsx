import { useEffect, useState } from 'react';
import { useBookmarks } from '../context/bookmarksContext';
import { Bookmark } from '../definitions/bookmarks';
import { Song } from '../definitions/songs';
import Modal, { ModalButtonGroup, ModalProps } from './Modal';
import Spinner from './Spinner';

type AddToBookmarkModalProps = Omit<ModalProps, 'children' | 'innerClassName'> & {
	song: Song;
};

export default function AddToBookmarkModal({
	isOpen,
	onClose,
	song,
}: AddToBookmarkModalProps): JSX.Element {
	const { bookmarks, addSongToBookmark, removeSongFromBookmark } = useBookmarks();
	const [changes, setChanges] = useState<Record<Bookmark['id'], boolean>>({});
	const [initialValues, setInitialValues] = useState<Record<Bookmark['id'], boolean>>({});

	useEffect(() => {
		if (!bookmarks) return;

		const initialBookmarks: typeof initialValues = {};
		Object.values(bookmarks).forEach((bookmark) => {
			initialBookmarks[bookmark.id] = bookmark.songs.includes(song.id);
		});
		setInitialValues(initialBookmarks);
	}, [bookmarks]);

	function onSave(): void {
		Object.entries(changes).map(([bookmarkId, value]) => {
			if (value) addSongToBookmark(bookmarkId, song.id);
			else removeSongFromBookmark(bookmarkId, song.id);
		});
		onClose?.();
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h1>Add to list</h1>
			<div className="flex-col gap-sm">
				{bookmarks === undefined ? (
					<Spinner />
				) : (
					Object.values(bookmarks).map((bookmark) => (
						<label key={bookmark.id}>
							<input
								type="checkbox"
								checked={changes[bookmark.id] ?? initialValues[bookmark.id]}
								onChange={() => {
									if (changes[bookmark.id] !== undefined) {
										const { [bookmark.id]: _removed, ...remainder } = changes;
										setChanges(remainder);
									} else {
										setChanges({
											...changes,
											[bookmark.id]: (changes[bookmark.id] = !initialValues[bookmark.id]),
										});
									}
								}}
							/>
							<span>{bookmark.name}</span>
						</label>
					))
				)}
			</div>

			<ModalButtonGroup>
				<button onClick={onClose} style={{ color: '#de423a' }}>
					Close
				</button>
				<button onClick={onSave} style={{ color: '#00750e' }}>
					Save
				</button>
			</ModalButtonGroup>
		</Modal>
	);
}
