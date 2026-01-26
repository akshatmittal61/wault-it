import { Navigation, NavigationId } from "@/types";
import { FiHome, FiSearch, FiUser } from "react-icons/fi";
import { Routes } from "./routes";

export const navigation: Record<NavigationId, Navigation> = {
	home: {
		id: "home",
		title: "Home",
		icon: <FiHome />,
		route: Routes.HOME,
	},
	search: {
		id: "search",
		title: "Search",
		icon: <FiSearch />,
		route: Routes.SEARCH,
	},
	profile: {
		id: "profile",
		title: "Your Profile",
		icon: <FiUser />,
		route: Routes.PROFILE,
	},
};
