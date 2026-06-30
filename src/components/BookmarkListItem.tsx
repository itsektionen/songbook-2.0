import React from 'react';
import { Link, useLocation } from '@tanstack/react-location';
import { Bookmark } from '../definitions/bookmarks';
import Edit from '../icons/Edit';
import { getSharedListPath } from '../util/listShare';
import ListShareActions from './ListShareActions';

type BookmarkListItemProps = {
	bookmark: Bookmark;
};

export default function BookmarkListItem({ bookmark }: BookmarkListItemProps): React.ReactElement {
	const location = useLocation();
	const path = getSharedListPath(bookmark.songs);

	return (
		<Link to={path} className="BookmarkListItem" search={{ name: bookmark.name }}>
			<li>
				<div className="flex-row space-between">
					<h1>{bookmark.name}</h1>
					<div className="ListActions">
						<ListShareActions name={bookmark.name} songIds={bookmark.songs} />
						<button
							className="action"
							onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
								event.preventDefault();
								location.history.push(`/bookmarks/${bookmark.id}`);
							}}
						>
							<Edit />
						</button>
					</div>
				</div>
			</li>
		</Link>
	);
}
