
const { execSync } = require('child_process');

const siteId = "36d968c7-f349-488e-ade9-1b7b7b49d65f";
const email = "adam.pogash@mec1.net";

try {
    const payload = {
        site_id: siteId,
        type: "email",
        event: "submission_created",
        data: { email: email }
    };
    const dataStr = JSON.stringify(payload).replace(/"/g, '\\"');
    const command = `npx -y netlify-cli@latest api createHookBySiteId --data "${dataStr}"`;
    console.log(`Running: ${command}`);
    const output = execSync(command).toString();
    console.log(output);
} catch (e) {
    console.error(e.message);
    if (e.stdout) console.error(`STDOUT: ${e.stdout.toString()}`);
    if (e.stderr) console.error(`STDERR: ${e.stderr.toString()}`);
}
