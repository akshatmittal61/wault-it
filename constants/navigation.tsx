import { Navigation } from "@/types";
import { routes } from "./routes";
import { FiHome, FiUser } from "react-icons/fi";

export const sideBarNavigationLinks: Array<Navigation> = [
	{
		id: "home",
		title: "Home",
		icon: <FiHome />,
		route: routes.HOME,
	},
	{
		id: "profile",
		title: "Your Profile",
		icon: <FiUser />,
		route: routes.PROFILE,
	},
];
