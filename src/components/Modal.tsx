import { ReactNode } from 'react';

export type ModalProps = {
	isOpen?: boolean;
	onClose?: () => void;
	children: ReactNode;
	innerClassName?: string;
};

export default function Modal({
	isOpen,
	onClose,
	children,
	innerClassName = '',
}: ModalProps): JSX.Element {
	return (
		<div className={`Modal-outer${isOpen ? ' visible' : ''}`} onClick={onClose}>
			{isOpen && (
				<div
					className={`Modal-inner ${innerClassName}`}
					onClick={(event) => event.stopPropagation()}
				>
					{children}
				</div>
			)}
		</div>
	);
}

export type ModalButtonGroupProps = {
	children: ReactNode;
};

export function ModalButtonGroup({ children }: ModalButtonGroupProps): JSX.Element {
	return <div className="Modal-button-group">{children}</div>;
}
