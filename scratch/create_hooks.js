
const { execSync } = require('child_process');

const siteId = "36d968c7-f349-488e-ade9-1b7b7b49d65f";
const emails = ["staff@mec1.net", "adam.pogash@mec1.net"];

emails.forEach(email => {
    try {
        console.log(`Creating hook for ${email}...`);
        const payload = {
            type: "email",
            event: "submission_created",
            data: { email: email }
        };
        // Use JSON.stringify and then escape double quotes for the command line
        const dataStr = JSON.stringify(payload).replace(/"/g, '\\"');
        const command = `npx -y netlify-cli@latest api createHookBySiteId --data "{ \\"site_id\\": \\"${siteId}\\", ${dataStr.slice(1, -1)} }"`;
        
        const output = execSync(command).toString();
        console.log(output);
    } catch (e) {
        console.error(`Error creating hook for ${email}: ${e.message}`);
        if (e.stdout) console.error(`STDOUT: ${e.stdout.toString()}`);
        if (e.stderr) console.error(`STDERR: ${e.stderr.toString()}`);
    }
});
