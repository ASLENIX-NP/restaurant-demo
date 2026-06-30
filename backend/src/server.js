const { server } = require("./app");
const startCronJobs = require("./utils/cronJobs");

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  startCronJobs();
});
