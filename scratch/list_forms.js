
const { execSync } = require('child_process');

try {
    const output = execSync('npx -y netlify-cli@latest api listSiteForms --data "{ \\"site_id\\": \\"36d968c7-f349-488e-ade9-1b7b7b49d65f\\" }"').toString();
    console.log(output);
} catch (e) {
    console.error(e.message);
}
