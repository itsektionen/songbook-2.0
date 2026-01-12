import React from 'react';
import { Link, useLocation } from '@tanstack/react-location';
import { Bookmark } from '../definitions/bookmarks';
import Edit from '../icons/Edit';
import { generateBase64Id } from '../util/base64Ids';

type BookmarkListItemProps = {
	bookmark: Bookmark;
};

export default function BookmarkListItem({ bookmark }: BookmarkListItemProps): React.ReactElement {
	const location = useLocation();

	return (
		<Link
			to={`/l/${bookmark.songs.map((id) => generateBase64Id(id)).join('')}`}
			className="BookmarkListItem"
			search={{ name: bookmark.name }}
		>
			<li>
				<div className="flex-row space-between">
					<h1>{bookmark.name}</h1>
					<button
						className="action"
						onClick={(event) => {
							event.preventDefault();
							location.history.push(`/bookmarks/${bookmark.id}`);
						}}
					>
						<Edit />
					</button>
				</div>
			</li>
		</Link>
	);
}
