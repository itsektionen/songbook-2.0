import React from 'react';
import { useEffect, useState } from 'react';
import { useBookmarks } from '../context/bookmarksContext';
import Modal, { ModalButtonGroup, ModalProps } from './Modal';

type NewBookmarkModalProps = Omit<ModalProps, 'children' | 'innerClassName'>;

export default function NewBookmarkModal({
	isOpen,
	onClose,
}: NewBookmarkModalProps): React.ReactElement {
	const [name, setName] = useState<string>('');
	const { createBookmark } = useBookmarks();

	useEffect(() => {
		setName('');
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} innerClassName="NewBookmarkModal">
			<h1>New bookmark</h1>

			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Name"
				className="width-full"
			/>

			<ModalButtonGroup>
				<button onClick={onClose} style={{ color: 'rgb(var(--cancel))' }}>
					Cancel
				</button>
				<button
					onClick={() => {
						createBookmark(name);
						onClose?.();
					}}
					style={{ color: 'rgb(var(--confirm))' }}
				>
					Create
				</button>
			</ModalButtonGroup>
		</Modal>
	);
}
