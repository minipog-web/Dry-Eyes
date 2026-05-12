
@echo off
npx -y netlify-cli@latest api createHookBySiteId --data "{\"site_id\":\"36d968c7-f349-488e-ade9-1b7b7b49d65f\",\"type\":\"email\",\"event\":\"submission_created\",\"data\":{\"email\":\"adam.pogash@mec1.net\"}}"
npx -y netlify-cli@latest api createHookBySiteId --data "{\"site_id\":\"36d968c7-f349-488e-ade9-1b7b7b49d65f\",\"type\":\"email\",\"event\":\"submission_created\",\"data\":{\"email\":\"staff@mec1.net\"}}"
