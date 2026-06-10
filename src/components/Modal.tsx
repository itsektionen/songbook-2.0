import { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
}: ModalProps): ReactElement {
	const modalNode = (
		<div
			className={`Modal-outer${isOpen ? ' visible' : ''}`}
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
				onClose?.();
			}}
		>
			{isOpen && (
				<div
					className={`Modal-inner ${innerClassName}`}
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
					}}
				>
					{children}
				</div>
			)}
		</div>
	);

	if (typeof document === 'undefined') return <>{modalNode}</>;
	return createPortal(modalNode, document.body);
}

export type ModalButtonGroupProps = {
	children: ReactNode;
};

export function ModalButtonGroup({ children }: ModalButtonGroupProps): ReactElement {
	return <div className="Modal-button-group">{children}</div>;
}
