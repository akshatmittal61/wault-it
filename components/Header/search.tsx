import { useDebounce } from "@/hooks";
import { Input } from "@/library";
import { useArtifactsStore } from "@/store";
import { Notify, stylesConfig } from "@/utils";
import React, { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "./styles.module.scss";

interface ISearchProps {
	onClose: () => void;
}

const classes = stylesConfig(styles, "search");

export const Search: React.FC<ISearchProps> = ({ onClose }) => {
	const {
		searchQuery,
		getAllServices,
		searchForServices,
		setSearchQuery,
		setServices,
	} = useArtifactsStore();
	const [searchStr, debouncedSearchStr, setSearchStr] = useDebounce<string>(
		searchQuery,
		1000
	);

	const handleSearch = async (searchStr: any) => {
		try {
			await searchForServices(searchStr);
		} catch (error) {
			Notify.error(error);
		}
	};

	useEffect(() => {
		setSearchQuery(debouncedSearchStr);
		if (debouncedSearchStr) {
			if (debouncedSearchStr.length >= 3) {
				void handleSearch(debouncedSearchStr);
			} else {
				setServices([]);
			}
		} else {
			void getAllServices();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchStr]);

	return (
		<form className={classes("")}>
			<Input
				name="search"
				placeholder="Search"
				value={searchStr}
				leftIcon={<FiSearch />}
				onChange={(e: any) => setSearchStr(e.target.value)}
				// on keyboard focus loose, call onClose
				onBlur={onClose}
				autoFocus={true}
			/>
		</form>
	);
};
