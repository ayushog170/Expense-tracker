let counter = 1;
const expenses = [];
const users = [];

function createId() {
  const id = String(counter);
  counter += 1;
  return id;
}

module.exports = {
  expenses,
  users,
  createId,
};
