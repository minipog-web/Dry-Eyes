import subprocess

out = subprocess.check_output("git show 99baf4f", shell=True).decode("utf-8", errors="replace")
lines = out.splitlines()
for idx, line in enumerate(lines):
    if "Tryptyr" in line:
        print(f"--- MATCH at line {idx} ---")
        for j in range(max(0, idx - 5), min(len(lines), idx + 25)):
            print(lines[j].encode('ascii', errors='replace').decode())
