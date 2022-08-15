import { createContext, ReactNode, useContext, useState } from 'react';

const SearchContext = createContext<{
	search: string;
	setSearch: (value: string) => void;
	// TODO: Add filters
}>({ search: '', setSearch: () => {} });

export const useSearch = () => useContext(SearchContext);

export function SearchProvider({ children }: { children: ReactNode }): JSX.Element {
	const [search, setSearch] = useState<string>('');

	return <SearchContext.Provider value={{ search, setSearch }}>{children}</SearchContext.Provider>;
}
