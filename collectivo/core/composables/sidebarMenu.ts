export const useSidebarMenu = () =>
  useState<CollectivoMenuItem[]>("sideBarMenu", () => []);
