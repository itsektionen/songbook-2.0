import React from 'react';
import { useEffect, useState } from 'react';
import { Tag, TAGS } from '../definitions/tag';
import Modal, { ModalButtonGroup, ModalProps } from './Modal';
import TagBadge from './TagBadge';

type FilterModalProps = Omit<ModalProps, 'innerClassName' | 'children'> & {
	onConfirm?: (filter: Tag[]) => void;
	closeOnConfirm?: boolean;
	startValue?: Tag[];
};

export default function FilterModal({
	isOpen,
	onClose,
	onConfirm,
	closeOnConfirm = true,
	startValue = [],
}: FilterModalProps): React.ReactElement {
	const [filter, setFilter] = useState<Tag[]>(startValue);

	useEffect(() => {
		setFilter(startValue);
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} innerClassName="Filter-modal">
			<div className="flex-col gap-sm">
				{TAGS.map((tag) => (
					<label key={tag}>
						<input
							type="checkbox"
							checked={filter.includes(tag)}
							onChange={() => {
								if (!filter.includes(tag)) setFilter([...filter, tag]);
								else setFilter(filter.filter((f) => f !== tag));
							}}
						/>
						<TagBadge tag={tag} />
					</label>
				))}
			</div>
			<ModalButtonGroup>
				<button onClick={onClose} style={{ color: 'rgb(var(--cancel))' }}>
					Cancel
				</button>
				<button
					onClick={() => {
						onConfirm?.([]);
						if (closeOnConfirm) onClose?.();
					}}
					style={{ color: 'rgb(var(--reset))' }}
				>
					Reset
				</button>
				<button
					onClick={() => {
						onConfirm?.(filter);
						if (closeOnConfirm) onClose?.();
					}}
					style={{ color: 'rgb(var(--confirm))' }}
				>
					Confirm
				</button>
			</ModalButtonGroup>
		</Modal>
	);
}
