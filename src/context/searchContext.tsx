import React from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { Tag } from '../definitions/tag';

const SearchContext = createContext<{
	search: string;
	setSearch: (value: string) => void;
	filter: Tag[];
	setFilter: (value: Tag[]) => void;
}>({ search: '', setSearch: () => {}, filter: [], setFilter: () => {} });

export const useSearch = () => useContext(SearchContext);

export function SearchProvider({ children }: { children: ReactNode }): React.ReactElement {
	const [search, setSearch] = useState<string>('');
	const [filter, setFilter] = useState<Tag[]>([]);

	return (
		<SearchContext.Provider value={{ search, setSearch, filter, setFilter }}>
			{children}
		</SearchContext.Provider>
	);
}
