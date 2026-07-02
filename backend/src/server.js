const { server } = require("./app");
const startCronJobs = require("./utils/cronJobs");
const ImageKit = require("imagekit");

const PORT = process.env.PORT || 5001;

const checkImageKit = async () => {
  if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    console.log("⚠️ ImageKit credentials are not fully configured in .env");
    return;
  }
  
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    
    // Perform a lightweight request to verify credentials
    await imagekit.listFiles({ limit: 1 });
    console.log("✅ ImageKit Connected Successfully");
  } catch (error) {
    console.log("❌ ImageKit Connection Failed. Please check your credentials in .env");
  }
};

server.listen(PORT, async () => {
  console.log(`✅ Server is running on port ${PORT}`);
  startCronJobs();
  await checkImageKit();
});
