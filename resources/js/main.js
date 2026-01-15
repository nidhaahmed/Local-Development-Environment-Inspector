/**
 * Step 3: Wiring Neutralino Properly
 * 
 * First, we initialize the Neutralino library. 
 * This connects this JavaScript code to the Neutralino native process.
 */
Neutralino.init();

/**
 * Basic Hygiene: Event Handling
 * 
 * We want to make sure the application process actually stops 
 * when the user clicks the close button on the window.
 */
Neutralino.events.on("windowClose", () => {
    Neutralino.app.exit();
});

/**
 * Step 4: Fetch OS Information
 * 
 * This function uses the `os.getInfo()` method to grab details
 * about the operating system we're running on (name, version, etc).
 */
async function loadOSInfo() {
    try {
        // Correct API for v6.x is in the 'computer' namespace
        const info = await Neutralino.computer.getOSInfo();
        document.getElementById("os").innerText =
            `OS: ${info.name} ${info.version}`;
    } catch (err) {
        document.getElementById("os").innerHTML =
            `<span style="color: red;">OS Error: ${err.message || 'Unknown error'}</span>`;
        console.error("Failed to load OS info:", err);
    }
}

// Initializing the data fetch when the app is fully ready
Neutralino.events.on("ready", () => {
    loadOSInfo();
    loadAppInfo();
    loadEnv();
});

/**
 * Step 5: Fetch App Metadata
 * 
 * This lets us peek into the app's own configuration (neutralino.config.json).
 * It's useful for showing the App ID or current version.
 */
async function loadAppInfo() {
    try {
        const config = await Neutralino.app.getConfig();
        document.getElementById("app").innerText =
            `App ID: ${config.applicationId}`;
    } catch (err) {
        document.getElementById("app").innerHTML =
            `<span style="color: red;">App Error: ${err.message || 'Unknown error'}</span>`;
        console.error("Failed to load App info:", err);
    }
}

// Removed direct call, moved into "ready" event listener above

/**
 * Step 6: Load Environment Variables
 * 
 * This is where the app stops being "basic". We're fetching 
 * all the system environment variables and rendering them as a list.
 */
async function loadEnv() {
    const container = document.getElementById("env");
    try {
        // Correct API to get ALL environment variables is getEnvs()
        const env = await Neutralino.os.getEnvs();

        Object.keys(env).forEach(key => {
            const row = document.createElement("div");
            row.className = "env-row";

            const text = document.createElement("span");
            text.innerText = `${key} = ${env[key]}`;

            const copyBtn = document.createElement("button");
            copyBtn.innerText = "Copy";
            copyBtn.onclick = (e) => copy(env[key], e.target);

            row.appendChild(text);
            row.appendChild(copyBtn);
            container.appendChild(row);
        });
    } catch (err) {
        container.innerHTML =
            `<div style="color: red; padding: 10px;">Env Error: ${err.message || 'Unknown error'}</div>`;
        console.error("Failed to load environment variables:", err);
    }
}

/**
 * Step 7: Clipboard Support
 * 
 * A simple helper to copy text to the system clipboard.
 * Mentors love these small "quality of life" features.
 */
/**
 * Step 7: Clipboard Support (Improved)
 * 
 * This uses the Neutralino clipboard API to copy text.
 * We also added a small UI feedback (changing button text) so 
 * the user knows it actually happened.
 */
async function copy(text, button) {
    try {
        await Neutralino.clipboard.writeText(text);

        // Visual feedback: Change "Copy" to "Copied!" for 2 seconds
        const originalText = button.innerText;
        button.innerText = "Copied!";
        button.style.borderColor = "#28a745"; // Green success color
        button.style.color = "#28a745";

        setTimeout(() => {
            button.innerText = originalText;
            button.style.borderColor = ""; // Reset to CSS default
            button.style.color = "";
        }, 2000);
    } catch (err) {
        console.error("Failed to copy:", err);
    }
}

// Removed direct call, moved into "ready" event listener above
