// The node program that captures local performance data
// and sends it to the socket.io server
// Req:
// - farmhash
// - socket.io-client

const os = require("os");

const io = require("socket.io-client");
const socket = io("https://cpus-socketio-api.vercel.app");

socket.on("connect", () => {
  const nI = os.networkInterfaces();
  let macA;

  // Loop through nI for this machine and find a interface which connected to internet
  for (let key in nI) {
    if (nI[key][0].internal) {
      if (nI[key][0].mac === "00:00:00:00:00:00") {
        macA = Math.random().toString(36).substr(2, 15);
      } else {
        macA = nI[key][0].mac;
      }
      break;
    }
  }

  // Client auth with single key value
  socket.emit("clientAuth", "lamsidnsak");

  // Initial Perf Data
  performanceData().then((allPerformanceData) => {
    allPerformanceData.macA = macA;
    socket.emit("initPerfData", allPerformanceData);
  });

  // Start sending data on interval
  let perfDataInterval = setInterval(() => {
    performanceData().then((allPerformanceData) => {
      allPerformanceData.macA = macA;
      socket.emit("perfData", allPerformanceData);
    });
  }, 5000);

  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  });
});

const performanceData = () => {
  return new Promise(async (resolve, reject) => {
    // CPU Load (Current)
    const cpuLoad = await getCpuLoad();

    // Memory Usage
    // - Free
    const freeMem = os.freemem();
    // - Total
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;

    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;
    // OS Type
    const osType = os.type() === "Darwin" ? "Mac" : os.type().trim();
    // Uptime
    const uptime = os.uptime();
    // CPU info
    const cpus = os.cpus();
    // - Type
    const type = cpus[0].model;
    // - Number of cores
    const numOfCores = cpus.length;
    // - Clock speed
    const speed = cpus[0].speed;

    const isActive = true;

    resolve({
      cpuLoad,
      freeMem,
      totalMem,
      usedMem,
      memUsage,
      osType,
      uptime,
      type,
      numOfCores,
      speed,
      isActive,
    });
  });
};

// cpul is all num of cores. So, we wil take average of all the cores
const cpuAverage = () => {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;
  cpus.forEach((core) => {
    for (key in core.times) {
      totalMs = core.times[key];
    }
    idleMs += core.times.idle;
  });

  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
};

const getCpuLoad = () => {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      // Current Load = Difference between Load of start and Load of start+100ms

      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;

      resolve(100 - Math.floor((100 * idleDifference) / totalDifference));
    }, 1000);
  });
};

const express = require("express");
let app = express();

export default app;
