import {
  createItems,
  createUser,
  createUsers,
  deleteItems,
  deleteUser,
  deleteUsers,
  readRoles,
  readSingleton,
  readUsers,
  updateItems,
  updateUser,
  updateUsers,
} from "@directus/sdk";

async function getRole(name: string) {
  const directus = await useDirectus();
  const membersRoles = await directus.request(
    readRoles({
      filter: {
        name: { _eq: name },
      },
    })
  );
  if (membersRoles.length < 1) {
    throw new Error(name + " role not found");
  }
  return membersRoles[0].id;
}

export default async function demoData() {
  console.log("Creating demo data for collectivo");

  const directus = await useDirectus();

  const memberRole = await getRole("collectivo_member");
  const editorRole = await getRole("collectivo_editor");
  const adminRole = await getRole("collectivo_admin");

  // Create some users

  const userNames = [
    "Admin",
    "Editor",
    "User",
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
  ];
  const users = [];
  for (const userName of userNames) {
    const u = {
      first_name: userName,
      last_name: "Example",
      email: `${userName.toLowerCase()}@example.com`,
      role: memberRole,
    };
    if (userName == "Admin") {
      u.role = adminRole;
    }
    if (userName == "Editor") {
      u.role = editorRole;
    }
    users.push(u);
  }

  for (const user of users) {
    try {
      const usersDB = await directus.request(
        readUsers({
          filter: { email: { _eq: user.email } },
        })
      );
      if (usersDB.length > 0) {
        await directus.request(updateUser(usersDB[0].id, user));
      } else {
        await directus.request(createUser(user));
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Create some tags
  await directus.request(deleteItems("collectivo_tags", { limit: 1000 }));
  const tagNames = ["Has a dog", "Has a cat", "Has a bird", "Has a fish"];
  const tags: any[] = [];
  for (const tagName of tagNames) {
    tags.push({
      name: tagName,
    });
  }

  // Add some members to some tags
  // for (var i = 0; i < 3; i++) {
  //   tags[i].collectivo_members = {
  //     create: [
  //       { collectivo_tags_id: "+", collectivo_members_id: { id: 1 } },
  //       { collectivo_tags_id: "+", collectivo_members_id: { id: 2 } },
  //       { collectivo_tags_id: "+", collectivo_members_id: { id: 3 } },
  //     ],
  //   };
  // }

  try {
    await directus.request(createItems("collectivo_tags", tags));
  } catch (error) {
    console.log(error);
  }

  // Create some tiles
  await directus.request(deleteItems("collectivo_tiles", { limit: 1000 }));
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
