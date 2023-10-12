import { createItems } from "@directus/sdk";

export default async function demoData() {
  console.log("Creating demo data for collectivo");

  const directus = await useDirectus();

  // Create some users
  const userNames = ["Admin", "User", "Alice", "Bob", "Charlie", "Dave"];
  const users = [];
  for (const userName of userNames) {
    users.push({
      first_name: userName,
      last_name: "Example",
      email: `${userName.toLowerCase()}@example.com`,
    });
  }
  try {
    await directus.request(createItems("collectivo_members", users));
  } catch (error) {
    console.log(error);
  }

  // Create some tags
  const tagNames = ["Has a dog", "Has a cat", "Has a bird", "Has a fish"];
  const tags: any[] = [];
  for (const tagName of tagNames) {
    tags.push({
      name: tagName,
    });
  }

  // Add some members to some tags
  for (var i = 0; i < 3; i++) {
    tags[i].collectivo_members = {
      create: [
        { collectivo_tags_id: "+", collectivo_members_id: { id: 1 } },
        { collectivo_tags_id: "+", collectivo_members_id: { id: 2 } },
        { collectivo_tags_id: "+", collectivo_members_id: { id: 3 } },
      ],
    };
  }

  try {
    await directus.request(createItems("collectivo_tags", tags));
  } catch (error) {
    console.log(error);
  }

  // Create some tiles
  const tileNames = ["Tile 1", "Tile 2", "Tile 3", "Tile 4"];
  const tiles = [];
  for (const tileName of tileNames) {
    tiles.push({
      name: tileName,
      content: "Hello! I am an example tile!",
    });
  }
  try {
    await directus.request(createItems("collectivo_tiles", tiles));
  } catch (error) {
    console.log(error);
  }

  console.log("Creating demo data for collectivo succeeded");
}
