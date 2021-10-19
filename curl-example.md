# producer
HOOK_SECRET="super-secret-string" \
KAFKA_BOOTSTRAP_SERVER="localhost:9092" \
TOPIC="npm-package-published" 
node server.js

# consumer
HOOK_SECRET="super-secret-string" \
KAFKA_BOOTSTRAP_SERVER="localhost:9092" \
TOPIC="npm-package-published" \
GROUP_ID="group-id" \
node consumer.js

# cUrl 
 curl -XPOST \   
    -H "Content-Type: application/json" \
    -H "x-npm-signature: sha256=7c0456720f3fdb9b94f5ad5e0c231a61e0fd972230d83eb8cb5062e1eed6ff5c" \
    -d '{"event":"package:publish","name":"@kafkajs/zstd222","version":"122.0.0","hookOwner":{"username":"nevon"},"payload":{"name":"@kafkajs/zstd33"},"change":{"version":"1.0.0"},"time":1603444214995}' \
