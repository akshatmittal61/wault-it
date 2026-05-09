import { Navigation, NavigationId } from "@/types";
import { FiHome, FiUser } from "react-icons/fi";
import { Routes } from "./routes";

export const navigation: Record<NavigationId, Navigation> = {
	home: {
		id: "home",
		title: "Home",
		icon: <FiHome />,
		route: Routes.HOME,
	},
	profile: {
		id: "profile",
		title: "Your Profile",
		icon: <FiUser />,
		route: Routes.PROFILE,
	},
};
