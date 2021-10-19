const createHookReceiver = require("npm-hook-receiver");
const kafka = require("./kafka");

const topic = process.env.TOPIC;
const admin = kafka.admin();

const producer = kafka.producer();
const main = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [{ topic }],
    waitForLeaders: true,
  });
  await producer.connect();

  const server = createHookReceiver({
    // Secret created when registering the webhook with NPM.
    // Used to validate the payload.
    secret: process.env.HOOK_SECRET,

    // Path for the handler to be mounted on.
    mount: "/hook",
  });

  server.on("package:publish", async (event) => {
    console.log("🚀 ~ file: server.js ~ line 26 ~ server.on ~ event", event)
    try {
      const responses = await producer.send({
        topic: process.env.TOPIC,
        messages: [
          {
            // Name of the published package as key, to make sure that we process events in order
            key: event.name,

            // The message value is just bytes to Kafka, so we need to serialize our JavaScript
            // object to a JSON string. Other serialization methods like Avro are available.
            value: JSON.stringify({
              package: event.name,
              version: event.version,
            }),
          },
        ],
      });

      console.log("Published message", { responses });
    } catch (error) {
      console.error("Error publishing message", error);
    }
  });

  server.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
