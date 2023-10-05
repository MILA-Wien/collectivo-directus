const migration = {
  id: 0,
  name: "000_TEMPLATE",
  up: up,
  down: down,
};

export default migration;

async function up() {
  console.log("Migration 000_TEMPLATE: up called");
}

async function down() {
  console.log("Migration 000_TEMPLATE: down called");
}
