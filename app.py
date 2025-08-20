from flask import Flask, request, jsonify, send_from_directory
from hashlib import sha256
import os, math

app = Flask(__name__, static_url_path="", static_folder=".")

# ---- Collapse stub: 3-node Body/Mind/Heart with a deterministic selector
def body_node(msg: str) -> str:
    # Pragmatic, action-first
    return f"BODY: I’d ship this by breaking it into one action you can do in 5 minutes: {one_action(msg)}."

def mind_node(msg: str) -> str:
    # Analytical, pattern-level
    return f"MIND: Pattern I see → {extract_pattern(msg)}. Choose leverage over labor."

def heart_node(msg: str) -> str:
    # Purpose + tone
    return f"HEART: Your motive here smells like alignment. Keep the part that feels clean; drop the rest."

def one_action(msg: str) -> str:
    words = [w for w in msg.split() if len(w) > 3]
    return ("create index.html and paste the starter" if not words else f"write a 3-line todo for “{words[0]}” and do line 1")

def extract_pattern(msg: str) -> str:
    if "agent" in msg.lower(): return "platform expected a server, you uploaded docs"
    if "repo" in msg.lower(): return "branch/commit mismatch"
    if "money" in msg.lower(): return "sell deliverables, not theory"
    return "reduce scope → prove life in 10 minutes"

def collapse_choice(msg: str) -> str:
    # Cheap, deterministic “aspect” proxy: hash → 0,1,2
    h = int(sha256(msg.encode("utf-8")).hexdigest(), 16)
    return ["body","mind","heart"][h % 3]

@app.get("/")
def root():
    return send_from_directory(".", "index.html")

@app.post("/chat")
def chat():
    data = request.get_json(silent=True) or {}
    user = (data.get("message") or "").strip()
    if not user:
        return jsonify(ok=False, error="empty message"), 400

    node = collapse_choice(user)
    if node == "body":
        out = body_node(user)
    elif node == "mind":
        out = mind_node(user)
    else:
        out = heart_node(user)

    return jsonify(ok=True, node=node, reply=out)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)