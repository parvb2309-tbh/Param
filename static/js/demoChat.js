import * as chatRenderer from './chatRenderer.js';

/**
 * Demo / sample conversations demonstrating Param features:
 * 1. PDF analysis, tool usage (read_file & write_file diff), and summarization.
 * 2. Industry-level code generation, thread-safe concurrency, and sandbox execution (bash).
 */

export function isDemoChatActive() {
  const box = document.getElementById('chat-history');
  return !!(box && box.querySelector('[data-demo="true"]'));
}

export function clearDemoChatIfPresent() {
  const box = document.getElementById('chat-history');
  if (!box) return false;
  const demoElements = box.querySelectorAll('[data-demo="true"]');
  if (demoElements.length > 0) {
    const allMsgs = box.querySelectorAll('.msg, .agent-thread');
    if (allMsgs.length === demoElements.length) {
      box.innerHTML = '';
      return true;
    }
  }
  return false;
}

/**
 * Demo 1: PDF Key Findings & File Creation
 */
export function renderDemoChat(force = false) {
  const box = document.getElementById('chat-history');
  if (!box) return;

  const realMsgs = box.querySelectorAll('.msg:not([data-demo="true"])');
  if (!force && realMsgs.length > 0) return;
  if (!force && box.querySelector('[data-demo="pdf"]')) return;

  box.innerHTML = '';

  const userContent = 'I have uploaded `Market_Research_Report_2024.pdf`. Could you please review it, extract the key findings, and summarize them into a text file named `key_findings.txt`?';

  const userMeta = {
    attachments: [
      {
        name: 'Market_Research_Report_2024.pdf',
        mime: 'application/pdf',
        size: 2490368
      }
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    _isDemo: true
  };

  chatRenderer.addMessage('user', userContent, null, userMeta);

  const diffContent = `@@ -0,0 +1,27 @@
+# Key Findings Summary: Global Enterprise AI Market 2024
+# Source: Market_Research_Report_2024.pdf
+
+1. Accelerating Adoption:
+   - Enterprise generative AI deployments grew 142% year-over-year.
+   - 74% of surveyed Fortune 500 enterprises have active multi-agent pilots.
+
+2. Measurable Operational ROI:
+   - Support workflows demonstrated an average 18.4% cost reduction.
+   - Engineering teams reported a 28% increase in code delivery velocity.
+
+3. Primary Deployment Roadblocks:
+   - 68% of enterprise IT leaders cited data compliance and hallucination risk.
+   - Integration latency with on-prem legacy databases remains a bottleneck.
+
+4. Vendor & Tooling Trends:
+   - Shift towards open-weights models and private on-prem harnesses.
+   - Tool-calling agent architectures saw 3.2x higher adoption.
+
+5. Strategic Recommendations:
+   - Prioritize deterministic tool boundaries and guardrails.
+   - Implement human-in-the-loop validation checkpoints for write operations.
+   - Unify document retrieval using hybrid vector + lexical indexing.`;

  const assistantMeta = {
    model: 'qwen3-vl:4b-instruct',
    requested_model: 'qwen3-vl:4b-instruct',
    round_texts: [
      "I'll analyze `Market_Research_Report_2024.pdf`, extract the key findings across its sections, and save a structured summary into `key_findings.txt`.\n\nFirst, let me read and parse the PDF document.",
      "I have reviewed `Market_Research_Report_2024.pdf` and generated `key_findings.txt` with a structured breakdown.\n\n### Summary of Key Findings:\n\n1. **Accelerating Adoption**: Enterprise generative AI deployment surged by **142% year-over-year**, with **74% of Fortune 500 organizations** now actively running agentic workflow pilots.\n2. **Quantified ROI**: Customer-facing and support workflows demonstrated an **average 18.4% operational cost reduction**, while software engineering productivity saw a **28% velocity gain**.\n3. **Primary Roadblocks**: **68% of IT executives** highlighted regulatory compliance, data privacy, and model reliability as primary deployment hurdles, followed by legacy database integration.\n4. **Agentic Workflows**: Multi-step tool-calling architectures saw **3.2x higher adoption** compared to single-turn prompt models.\n5. **Strategic Guidance**: Organizations are advised to establish deterministic tool boundaries, enforce human-in-the-loop checkpoints for write operations, and deploy hybrid vector + lexical indexing.\n\nThe complete summary has been saved to **`key_findings.txt`** ✓"
    ],
    round_models: ['qwen3-vl:4b-instruct', 'qwen3-vl:4b-instruct'],
    tool_events: [
      {
        round: 1,
        tool: 'read_file',
        command: 'read_file("Market_Research_Report_2024.pdf")',
        output: 'Reading Market_Research_Report_2024.pdf (48 pages, ~16,200 words)...\n\n[PDF Document Metadata]\nTitle: 2024 Global Enterprise AI & Automation Market Analysis\nAuthor: Strategic Market Research Institute\nPublished: Q3 2024\n\n--- Identified Sections ---\n- Section 1: Executive Overview & Highlights\n- Section 2: Enterprise Adoption Metrics (YoY Growth: +142%)\n- Section 3: ROI Analysis & Operational Cost Reduction (Average 18.4% savings)\n- Section 4: Key Bottlenecks & Compliance Constraints (Security concerns in 68% of firms)\n- Section 5: Vendor Landscape & Agentic Workflow Projections\n- Section 6: Strategic Recommendations for FY2025\n\n[Document successfully parsed: 6 major findings identified]',
        exit_code: 0
      },
      {
        round: 1,
        tool: 'write_file',
        command: 'write_file("key_findings.txt")',
        output: 'Wrote 1,480 bytes to key_findings.txt',
        exit_code: 0,
        diff: {
          file: 'key_findings.txt',
          new_file: true,
          added: 27,
          removed: 0,
          text: diffContent
        }
      }
    ],
    response_time: 4.82,
    time_to_first_token: 0.95,
    tokens_per_second: 36.4,
    input_tokens: 2840,
    output_tokens: 396,
    total_tokens: 3236,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    _isDemo: true
  };

  chatRenderer.addMessage('assistant', null, 'qwen3-vl:4b-instruct', assistantMeta);

  box.querySelectorAll('.msg, .agent-thread').forEach(el => {
    el.dataset.demo = 'pdf';
  });

  const nodes = box.querySelectorAll('.agent-thread-node');
  if (nodes.length > 1) {
    const writeNode = nodes[1];
    writeNode.classList.add('open');
    const diffDetails = writeNode.querySelector('.agent-tool-diff');
    if (diffDetails) diffDetails.setAttribute('open', '');
  }

  chatRenderer.hideWelcomeScreen();

  const metaEl = document.getElementById('current-meta');
  if (metaEl) metaEl.textContent = 'Demo: PDF Key Findings';

  box.scrollTop = 0;
}

/**
 * Demo 2: Industry-level Code Generation & Sandbox Execution
 */
export function renderCodeDemoChat(force = false) {
  const box = document.getElementById('chat-history');
  if (!box) return;

  const realMsgs = box.querySelectorAll('.msg:not([data-demo="true"])');
  if (!force && realMsgs.length > 0) return;
  if (!force && box.querySelector('[data-demo="code"]')) return;

  box.innerHTML = '';

  // 1. User prompt requesting production-grade code and sandbox execution
  const userContent = 'Write an industry-level, production-ready Distributed Token Bucket Rate Limiter in Python with thread-safe concurrency, bursting support, and metrics logging. Then execute it in the sandbox to verify that it correctly handles concurrent requests, prevents race conditions, and reports accurate throughput stats.';

  const userMeta = {
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    _isDemo: true
  };

  chatRenderer.addMessage('user', userContent, null, userMeta);

  // 2. Assistant Response using write_file diff and bash sandbox execution
  const codeDiff = `@@ -0,0 +1,60 @@
+import time
+import threading
+from typing import Dict, Any
+
+class TokenBucketRateLimiter:
+    """Thread-safe Token Bucket Rate Limiter with burst capacity and telemetry."""
+    def __init__(self, rate: float, capacity: float):
+        if rate <= 0 or capacity <= 0:
+            raise ValueError("Rate and capacity must be positive numbers")
+        self.rate = float(rate)          # Sustained refill rate (tokens/sec)
+        self.capacity = float(capacity)  # Maximum burst capacity
+        self.tokens = float(capacity)
+        self.last_update = time.monotonic_ns()
+        self._lock = threading.RLock()
+        self.stats = {"total": 0, "allowed": 0, "throttled": 0}
+
+    def _replenish(self) -> None:
+        now = time.monotonic_ns()
+        elapsed_sec = (now - self.last_update) / 1e9
+        self.tokens = min(self.capacity, self.tokens + elapsed_sec * self.rate)
+        self.last_update = now
+
+    def acquire(self, tokens: float = 1.0) -> bool:
+        """Atomically attempt to acquire tokens without blocking."""
+        with self._lock:
+            self.stats["total"] += 1
+            self._replenish()
+            if self.tokens >= tokens:
+                self.tokens -= tokens
+                self.stats["allowed"] += 1
+                return True
+            self.stats["throttled"] += 1
+            return False
+
+    def get_metrics(self) -> Dict[str, Any]:
+        with self._lock:
+            return {**self.stats, "available_tokens": round(self.tokens, 2)}
+
+if __name__ == "__main__":
+    # Concurrent stress benchmark
+    limiter = TokenBucketRateLimiter(rate=100.0, capacity=20.0)
+    def worker(worker_id: int, count: int = 50):
+        for _ in range(count):
+            limiter.acquire(1.0)
+            time.sleep(0.002)
+    threads = [threading.Thread(target=worker, args=(i,)) for i in range(8)]
+    start = time.perf_counter()
+    for t in threads: t.start()
+    for t in threads: t.join()
+    duration = time.perf_counter() - start
+    m = limiter.get_metrics()
+    print(f"BENCHMARK COMPLETED IN {duration:.3f}s (8 threads, 400 requests)")
+    print(f"Total Requests  : {m['total']}")
+    print(f"Allowed (Pass)  : {m['allowed']}")
+    print(f"Throttled (429) : {m['throttled']}")
+    print(f"Tokens Remaining: {m['available_tokens']}")
+    print("Invariant Check : PASSED (0 race conditions, lock contention <0.05ms)")`;

  const sandboxOutput = `==================================================================
⚡ SANDBOX EXECUTION: python rate_limiter.py
==================================================================
[INFO] Environment: Python 3.11.9 (Sandboxed worker, 8 threads)
[INFO] Initialized TokenBucketRateLimiter: rate=100.0 req/s, capacity=20.0 burst
[INFO] Spawning 8 worker threads (50 requests/worker = 400 total)...

==================================================================
BENCHMARK COMPLETED IN 1.042s (8 threads, 400 requests)
==================================================================
Total Requests  : 400
Allowed (Pass)  : 124
Throttled (429) : 276
Tokens Remaining: 0.12
Invariant Check : PASSED (0 race conditions, lock contention <0.05ms)
OK (All concurrency and thread-safety tests passed)`;

  const assistantMeta = {
    model: 'qwen3-vl:4b-instruct',
    requested_model: 'qwen3-vl:4b-instruct',
    round_texts: [
      "I'll implement a production-grade, thread-safe Token Bucket Rate Limiter in Python with sub-millisecond precision, burst capacity tolerance, and automated concurrency stress benchmarks.\n\nFirst, let me create the module `rate_limiter.py` with the complete implementation and test suite.",
      "The industry-level **Token Bucket Rate Limiter** has been implemented, executed, and verified inside the sandbox environment.\n\n### Key Architectural Features:\n1. **Thread-Safe Atomic Execution**: Uses `threading.RLock` to guarantee mutual exclusion during token replenishment and deduction, eliminating race conditions under high concurrency.\n2. **Nanosecond Monotonic Timing**: Leverages `time.monotonic_ns()` to defend against system clock jumps (NTP synchronization) and ensure deterministic replenishment rates.\n3. **Burst Tolerance with Hard Ceilings**: Adopts an immediate burst capacity ($20$ tokens) while strictly enforcing sustained throughput ($100$ req/s).\n4. **Observable Metrics**: Built-in rolling telemetry tracking total admissions, throttled attempts, and available token headroom.\n\n### Sandbox Benchmark Verification:\n- **Concurrency Test**: 8 concurrent threads executed a combined 400 requests over ~1.04s.\n- **Accurate Throttling**: Exactly 124 requests were admitted (initial 20 burst + ~104 tokens refilled over 1.04s) while 276 excess requests were throttled.\n- **Invariant Guarantee**: Zero race conditions, lock deadlocks, or token leakage detected (`Invariant Check: PASSED`).\n\nThe code is saved to **`rate_limiter.py`** and validated for production deployment."
    ],
    round_models: ['qwen3-vl:4b-instruct', 'qwen3-vl:4b-instruct'],
    tool_events: [
      {
        round: 1,
        tool: 'write_file',
        command: 'write_file("rate_limiter.py")',
        output: 'Wrote 2,140 bytes to rate_limiter.py',
        exit_code: 0,
        diff: {
          file: 'rate_limiter.py',
          new_file: true,
          added: 60,
          removed: 0,
          text: codeDiff
        }
      },
      {
        round: 1,
        tool: 'bash',
        command: 'python rate_limiter.py',
        output: sandboxOutput,
        exit_code: 0
      }
    ],
    response_time: 5.12,
    time_to_first_token: 0.98,
    tokens_per_second: 41.5,
    input_tokens: 1780,
    output_tokens: 480,
    total_tokens: 2260,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    _isDemo: true
  };

  chatRenderer.addMessage('assistant', null, 'qwen3-vl:4b-instruct', assistantMeta);

  box.querySelectorAll('.msg, .agent-thread').forEach(el => {
    el.dataset.demo = 'code';
  });

  // Open both tool nodes so the user sees file creation AND sandbox execution output
  const nodes = box.querySelectorAll('.agent-thread-node');
  nodes.forEach(node => {
    node.classList.add('open');
    const details = node.querySelector('details');
    if (details) details.setAttribute('open', '');
  });

  chatRenderer.hideWelcomeScreen();

  const metaEl = document.getElementById('current-meta');
  if (metaEl) metaEl.textContent = 'Demo: Code & Sandbox Run';

  box.scrollTop = 0;
}
