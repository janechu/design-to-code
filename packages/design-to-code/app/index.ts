import { examples } from "./examples.cjs";

const menu = document.getElementById("menu");

examples.forEach(example => {
    const menuItem = document.createElement("li");
    const menuItemLink = document.createElement("a");

    menuItemLink.setAttribute("href", `/${example}.html`);
    menuItemLink.textContent = example;
    menuItem.appendChild(menuItemLink);

    menu.appendChild(menuItem);
});
