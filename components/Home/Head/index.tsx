import { IconButton } from "@/library";
import { stylesConfig } from "@/utils";
import React, { useState } from "react";
import { FiDownload, FiPlus, FiSearch } from "react-icons/fi";
import styles from "./styles.module.scss";
import { Search } from "@/components/Header/search";

interface IHomeHeadProps {
	onAdd: () => void;
	onImport: () => void;
	enableSearch: boolean;
}

const classes = stylesConfig(styles, "home-head");

const HomeHead: React.FC<IHomeHeadProps> = ({
	onAdd,
	onImport,
	enableSearch = false,
}) => {
	const [isSearching, setIsSearching] = useState(false);
	return (
		<section id="home-head" className={classes("")}>
			<div className={classes("-actions")}>
				<IconButton icon={<FiDownload />} onClick={onImport} />
				{enableSearch ? (
					isSearching ? (
						<Search onClose={() => setIsSearching(false)} />
					) : (
						<IconButton
							icon={<FiSearch />}
							onClick={() => setIsSearching(true)}
						/>
					)
				) : null}
				<IconButton icon={<FiPlus />} onClick={onAdd} />
			</div>
		</section>
	);
};

export default HomeHead;
