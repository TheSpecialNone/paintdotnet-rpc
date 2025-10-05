const wi = require("@arcsine/win-info");
const fp = require("find-process");

const { Client } = require("discord-rpc");
const client = new Client({ transport: "ipc" });

const start = new Date();

async function update() {
    const apps = await fp("name", "paint.net");
    let app;
    for (let i = 0; i < apps.length; i++) {
        console.log(apps[i].name)
        if (["paintdotnet.exe"].includes(apps[i].name)) {
            app = apps[i];
            break; // stop after first match
        }
    }

    let window;
    if (app) window = wi.getByPidSync(app.pid);

    // Safe checks to avoid undefined errors
    let version = "Unknown Version";
    let filename = "Unknown";

    if (window) {
        version = window.title?.split(" -")[1] || "Unknown Version";
        filename = window.title?.split(" -")[0] || "Unknown";
    }

    client.setActivity({
        details: version,
        state: `Editing: ${filename}`,
        startTimestamp: start,
        largeImageKey: "paint",
        largeImageText: "Paint.Net"
    }, app?.pid || null);
}

update();

client.on("ready", () => {
    console.log("✓ Online and ready to rock!")
    update();
    setInterval(() => {
        update();
    }, 15000);
});

console.log("Connecting...");
client.login({ clientId: "526756173148585996" });

process.on("unhandledRejection", console.error);