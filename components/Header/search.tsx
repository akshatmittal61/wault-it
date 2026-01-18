import { useDebounce } from "@/hooks";
import { Input, MaterialIcon } from "@/library";
import { useArtifactsStore } from "@/store";
import { Notify } from "@/utils";
import { stylesConfig } from "@/utils/functions";
import React, { useEffect } from "react";
import styles from "./styles.module.scss";

interface ISearchProps {}

const classes = stylesConfig(styles, "search");

const Search: React.FC<ISearchProps> = () => {
	const { getAllServices, searchForServices, setSearchQuery, setServices } =
		useArtifactsStore();
	const [searchStr, debouncedSearchStr, setSearchStr] = useDebounce<string>(
		"",
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
				leftIcon={<MaterialIcon icon="search" />}
				onChange={(e: any) => setSearchStr(e.target.value)}
			/>
		</form>
	);
};

export default Search;
