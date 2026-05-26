import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
log_path = r'C:\Users\adamp\.gemini\antigravity\brain\f470400c-054d-4fb9-95c0-6839d891ccd7\.system_generated\logs\transcript.jsonl'

with open(log_path, encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

for line in lines:
    if line.get("tool_calls"):
        for t in line.get("tool_calls"):
            if t.get("name") == "run_command":
                cmd = t.get("args", {}).get("CommandLine", "")
                print(f"Step {line.get('step_index')}: {cmd}")
