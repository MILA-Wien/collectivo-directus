import { readItems, readMe, readUser } from "@directus/sdk";

export const useCurrentUser = () =>
  useState<CoreCurrentUser | null>("core_current_user", () => null);

export const getCurrentUser = async () => {
  const { $directus } = useNuxtApp();
  const currentUser = useCurrentUser();
  // // @ts-ignore
  // currentUser.value = (await $directus?.request(readMe())) || null;

  const x = await $directus?.request(
    readMe({
      fields: ["*"],
    })
  );
  console.log("currentUser", x);
  return currentUser;
};
