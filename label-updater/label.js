const { exec } = require("child_process");
const readline = require("readline");

if (process.stdin.isTTY) process.stdin.setRawMode(true);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.emitKeypressEvents(process.stdin);
process.stdin.on("keypress", (chunk, key) => {
    if ((key && key.name == "q") || (key && key.name == "escape")) process.exit();
});

const executeShellCommand = (pat, live, callback) => {
    const command = `node github-sync.js labels -s econans/.github -t econans --token ${pat} ${
        live ? "" : "--dry-run"
    }`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            process.exit();
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            process.exit();
        }
        console.log(stdout);
        callback();
    });
};

console.log("Enter PAT to dry run label changes, 'Esc' to quit...");
rl.question("PAT:", (pat) => {
    executeShellCommand(pat, false, () => {
        process.stdin.on("keypress", (str, key) => {
            if (key && key.name === "return") {
                executeShellCommand(pat, true, () => {
                    process.exit();
                });
            } else {
                console.log("Process aborted...");
                process.exit();
            }
        });

        console.log("Press 'Enter' to confirm label changes, 'Esc' to quit...");
    });
});
