import React from "react";
import {
    MenuItem,
    NavigationMenuHandledProps,
    NavigationMenuUnhandledProps,
} from "./navigation-menu.props";
import NavigationMenuItem from "./navigation-menu-item";

export default class NavigationMenu extends React.Component<
    NavigationMenuHandledProps & NavigationMenuUnhandledProps,
    {}
> {
    public static displayName: string = "NavigationMenu";

    public render(): React.ReactNode {
        return (
            <nav className={this.generateClassNames()}>
                {this.renderNavigationMenuItem(this.props.menu)}
            </nav>
        );
    }

    protected generateClassNames(): string {
        return "dtc-navigation-menu";
    }

    private renderNavigationMenuItem(menu: MenuItem[]): React.ReactNode {
        return menu.map((menuItem: MenuItem, index: number) => {
            return (
                <NavigationMenuItem
                    key={index}
                    expanded={this.props.expanded}
                    onLocationUpdate={this.props.onLocationUpdate}
                    activeLocation={this.props.activeLocation}
                    {...menuItem}
                />
            );
        });
    }
}
