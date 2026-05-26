import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

log_path = r'C:\Users\adamp\.gemini\antigravity\brain\f470400c-054d-4fb9-95c0-6839d891ccd7\.system_generated\logs\transcript.jsonl'

with open(log_path, encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

for i in range(180, 228):
    step = lines[i]
    if step.get('type') in ('USER_INPUT', 'PLANNER_RESPONSE'):
        print(f"Step {i} | step_index: {step.get('step_index')} | type: {step.get('type')}")
        if step.get('content'):
            print("  content:", step.get('content')[:500].replace('\n', ' '))
        if step.get('tool_calls'):
            print("  tool_calls:", [t.get('name') for t in step.get('tool_calls')])
        print("-" * 50)
