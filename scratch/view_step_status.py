import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
log_path = r'C:\Users\adamp\.gemini\antigravity\brain\f470400c-054d-4fb9-95c0-6839d891ccd7\.system_generated\logs\transcript.jsonl'

with open(log_path, encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

for i, line in enumerate(lines):
    if line.get("tool_calls"):
        for t in line.get("tool_calls"):
            if "Copy-Item" in str(t):
                print(f"Step {line.get('step_index')}: {t.get('args')}")
                # check the next step (which contains the tool output)
                if i + 1 < len(lines):
                    next_line = lines[i + 1]
                    print(f"  Result: {next_line.get('status')} - {next_line.get('content', '')[:200]}")
