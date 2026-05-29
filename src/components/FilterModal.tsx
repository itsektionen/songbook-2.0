import React, { useEffect, useState } from 'react';
import { Tag, TAGS } from '../definitions/tag';
import Check from '../icons/Check';
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
			<div className="filter-grid">
				{TAGS.map((tag) => {
					const on = filter.includes(tag);
					return (
						<button
							type="button"
							key={tag}
							className={`filter-chip${on ? ' on' : ''}`}
							aria-pressed={on}
							onClick={() => {
								if (!on) setFilter([...filter, tag]);
								else setFilter(filter.filter((f) => f !== tag));
							}}
						>
							<TagBadge tag={tag} />
							<span className="tick">{on && <Check size="sm" />}</span>
						</button>
					);
				})}
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
