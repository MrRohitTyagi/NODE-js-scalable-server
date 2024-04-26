const { parentPort, workerData } = require("worker_threads");
console.log(workerData);

let counter = 0;
for (let i = 0; i < 8_00_000_0000 / workerData.threds; i++) {
  counter += 1;
}
parentPort.postMessage(counter);
