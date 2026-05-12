
const fs = require('fs');
const { execSync } = require('child_process');

try {
    const output = execSync('npx -y netlify-cli@latest api getSite --data "{ \\"site_id\\": \\"36d968c7-f349-488e-ade9-1b7b7b49d65f\\" }"').toString();
    const site = JSON.parse(output);
    console.log(JSON.stringify(site, null, 2));
} catch (e) {
    console.error(e.message);
}
