import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Song } from '../definitions/songs';
import LinkTo from '../icons/LinkTo';
import QrCode from '../icons/QrCode';
import { copyText } from '../util/copyText';
import { getSharedListUrl } from '../util/listShare';
import ShareBookmarkQrModal from './ShareBookmarkQrModal';

type ListShareActionsProps = {
	name: string;
	songIds: Song['id'][];
};

export default function ListShareActions({
	name,
	songIds,
}: ListShareActionsProps): React.ReactElement {
	const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
	const shareUrl = getSharedListUrl(songIds, name);

	return (
		<>
			<button
				className="action"
				onClick={(event) => {
					event.preventDefault();
					setQrModalOpen(true);
				}}
			>
				<QrCode />
			</button>
			<button
				className="action"
				onClick={(event) => {
					event.preventDefault();
					copyText(shareUrl).then((copied) => {
						if (copied) toast.success('Copied!');
					});
				}}
			>
				<LinkTo />
			</button>
			<ShareBookmarkQrModal
				isOpen={qrModalOpen}
				onClose={() => setQrModalOpen(false)}
				url={shareUrl}
				name={name}
			/>
		</>
	);
}
