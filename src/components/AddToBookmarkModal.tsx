import React from 'react';
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
}: AddToBookmarkModalProps): React.ReactElement {
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
		setChanges({});
	}, [bookmarks, song.id]);

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
								checked={changes[bookmark.id] ?? initialValues[bookmark.id] ?? false}
								onChange={(event) => {
									const checked = event.target.checked;

									setChanges((previousChanges) => {
										if (checked === initialValues[bookmark.id]) {
											const { [bookmark.id]: _removed, ...remainder } = previousChanges;
											return remainder;
										}

										return {
											...previousChanges,
											[bookmark.id]: checked,
										};
									});
								}}
							/>
							<span>{bookmark.name}</span>
						</label>
					))
				)}
			</div>

			<ModalButtonGroup>
				<button onClick={onClose} style={{ color: 'rgb(var(--cancel))' }}>
					Close
				</button>
				<button onClick={onSave} style={{ color: 'rgb(var(--confirm))' }}>
					Save
				</button>
			</ModalButtonGroup>
		</Modal>
	);
}
