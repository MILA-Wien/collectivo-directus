export const useSidebarMenu = () =>
  useState<CoreMenuItem[]>("sideBarMenu", () => []);
