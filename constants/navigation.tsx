import { Navigation } from "@/types";
import { FiHome, FiSearch, FiUser } from "react-icons/fi";
import { Routes } from "./routes";

export const sideBarNavigationLinks: Array<Navigation> = [
	{
		id: "home",
		title: "Home",
		icon: <FiHome />,
		route: Routes.HOME,
	},
	{
		id: "search",
		title: "Search",
		icon: <FiSearch />,
		route: Routes.SEARCH,
	},
	{
		id: "profile",
		title: "Your Profile",
		icon: <FiUser />,
		route: Routes.PROFILE,
	},
];
