import { Navigation } from "@/types";
import { FiHome, FiSearch, FiUser } from "react-icons/fi";
import { routes } from "./routes";

export const sideBarNavigationLinks: Array<Navigation> = [
	{
		id: "home",
		title: "Home",
		icon: <FiHome />,
		route: routes.HOME,
	},
	{
		id: "search",
		title: "Search",
		icon: <FiSearch />,
		route: routes.SEARCH,
	},
	{
		id: "profile",
		title: "Your Profile",
		icon: <FiUser />,
		route: routes.PROFILE,
	},
];
