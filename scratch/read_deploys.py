import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

log_path = r'C:\Users\adamp\.gemini\antigravity\brain\f470400c-054d-4fb9-95c0-6839d891ccd7\.system_generated\logs\transcript.jsonl'

with open(log_path, encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

matching_steps = []
for line in lines:
    if line.get("tool_calls"):
        for t in line.get("tool_calls"):
            if "netlify deploy --prod" in str(t.get("args", {}).get("CommandLine", "")):
                matching_steps.append(line.get("step_index"))

print("Matching steps:", matching_steps)

# For each matching step, print it and the next step (the result)
for match in matching_steps:
    print(f"=== DETAILS FOR STEP {match} AND SUBSEQUENT ===")
    for line in lines:
        idx = line.get("step_index")
        if idx is not None and match <= idx <= match + 2:
            print(f"Step {idx} - Type: {line.get('type')} - Status: {line.get('status')}")
            if 'content' in line and line['content']:
                c = line['content']
                if len(c) > 600:
                    c = c[:600] + "..."
                print(f"  Content: {c.strip()}")
            if 'tool_calls' in line and line['tool_calls']:
                print(f"  Tool Calls: {json.dumps(line['tool_calls'], indent=2)}")
            print("-" * 60)
