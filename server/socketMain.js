require("./db");

const Machine = require("./models/Machine");

function socketMain(io, socket) {
  let macA;

  socket.on("clientAuth", async (key) => {
    if (key === "lamsidnsak") {
      // Valid Node Client
      socket.join("clients");
    } else if (key === "uiasndlsadnjk") {
      // Valid UI Client
      socket.join("ui");
      // console.log("ui- client joined");

      Machine.find().then((machines) => {
        if (machines) {
          machines.forEach((machine) => {
            machine.isActive = false;
            io.to("ui").emit("data", machine);
          });
        }
      });
    } else {
      // Invalid Client
      socket.disconnect(true);
    }
  });

  socket.on("disconnect", () => {
    Machine.findOne({ macA: macA }).then((machine) => {
      if (machine) {
        machine.isActive = false;
        io.to("ui").emit("data", machine);
      }
    });
  });

  socket.on("initPerfData", async (perfData) => {
    // Update the max address of client
    macA = perfData.macA;
    // Check mongo
    let mongooseRes = await checkAndAdd(perfData);
    // console.log(mongooseRes);
  });

  socket.on("perfData", (perfData) => {
    io.to("ui").emit("data", perfData);
  });
}

const checkAndAdd = (data) => {
  // We are doing DB stuff, this must be a promise
  return new Promise(async (resolve, reject) => {
    try {
      let machine = await Machine.findOne({ macA: data.macA });

      if (!machine) {
        // Record is not found, so add it
        let machine = new Machine(data);
        await machine.save();
        resolve("added");
      } else {
        resolve("found");
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = socketMain;
