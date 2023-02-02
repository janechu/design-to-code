import BaseNavigationMenu from "./navigation-menu";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const NavigationMenu = BaseNavigationMenu;
type NavigationMenu = InstanceType<typeof NavigationMenu>;

export { NavigationMenu };
export * from "./navigation-menu.props";
export * from "./navigation-menu-item.props";
