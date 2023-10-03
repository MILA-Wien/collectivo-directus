import { CollectivoMigration } from "../utils/migrations";

const m1: CollectivoMigration = {
  up: up,
  down: down,
};

export default m1;

async function up() {
  // Create or update extension collection
  console.log("Migration 001_test: up called");
}

async function down() {
  // Create or update extension collection
  console.log("Migration 001_test: down called");
}
