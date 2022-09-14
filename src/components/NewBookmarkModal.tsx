import { useEffect, useState } from 'react';
import { useBookmarks } from '../context/bookmarksContext';
import Modal, { ModalButtonGroup, ModalProps } from './Modal';

type NewBookmarkModalProps = Omit<ModalProps, 'children' | 'innerClassName'>;

export default function NewBookmarkModal({ isOpen, onClose }: NewBookmarkModalProps): JSX.Element {
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
				<button onClick={onClose} style={{ color: '#de423a' }}>
					Cancel
				</button>
				<button
					onClick={() => {
						createBookmark(name);
						onClose?.();
					}}
					style={{ color: '#00750e' }}
				>
					Create
				</button>
			</ModalButtonGroup>
		</Modal>
	);
}
