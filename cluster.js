const cluster = require("cluster");
const os = require("os");

cluster.setupMaster({
    exec: `${__dirname}/index.js`,
});

for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork(); // creates a worker
}

// "exit" happens when a worker dies
cluster.on("exit", function (worker) {
    console.log(worker.process.pid + "has passed :(");
    // the exit event happens when a worker dies, so at this time we can replace one
    cluster.fork(); // replaces worker who died
});
