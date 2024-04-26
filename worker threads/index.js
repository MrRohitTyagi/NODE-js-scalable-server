const os = require("os");
const { Worker } = require("worker_threads");
const express = require("express");
// const cfompression = require("compression");

const app = express();

const CORES = os.availableParallelism() / 2;

console.log("CORES => ", CORES);

function handleWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: { threds: CORES },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (err) => {
      reject(err);
    });
  });
}


app.get("/heavy", async (req, res) => {
  try {
    const workerPromise = [];
    for (let i = 0; i < CORES; i++) {
      workerPromise.push(handleWorker());
    }
    let count = 0;
    const data = await Promise.all(workerPromise);
    data.forEach((d) => (count += d));

    res.json(count);
  } catch (error) {
    console.log("error", error);
  }
});

app.get("/fast", (req, res) => {
  let counter;
  for (let i = 0; i < 9_00_000_0000; i++) {
    counter += 1;
  }
  res.json(counter);
});

app.listen(5000, () => {
  console.log("server running at port 5000");
});
