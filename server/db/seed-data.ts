export interface SeedQuestion {
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const SEED_QUESTIONS: SeedQuestion[] = [
  // 1. Data Structures & Algorithms
  {
    question_text: "In a Red-Black Tree with N nodes, what is the guaranteed upper bound on the tree's height?",
    options: ["2 * log2(N + 1)", "log2(N)", "1.44 * log2(N)", "N / 2"],
    correct_option_index: 0,
    explanation: "Because no red node can have a red child and all root-to-leaf paths have the same black-height, the maximum height of a Red-Black tree is strictly bounded by 2 * log2(N + 1).",
    category: "Algorithms",
    difficulty: "medium"
  },
  {
    question_text: "Which graph algorithm determines the shortest path between all pairs of vertices in O(V^3) time using dynamic programming?",
    options: ["Floyd-Warshall Algorithm", "Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Kruskal's Algorithm"],
    correct_option_index: 0,
    explanation: "Floyd-Warshall computes all-pairs shortest paths on weighted directed graphs in O(V^3) time by iteratively considering each vertex as an intermediate point.",
    category: "Algorithms",
    difficulty: "medium"
  },
  {
    question_text: "What is the worst-case time complexity of QuickSelect when choosing the k-th smallest element with deterministic median-of-medians pivot selection?",
    options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"],
    correct_option_index: 0,
    explanation: "With the median-of-medians linear-time pivot selection strategy (BFPRT), QuickSelect guarantees linear O(N) worst-case time complexity.",
    category: "Algorithms",
    difficulty: "hard"
  },
  {
    question_text: "Which self-balancing binary search tree maintains balance by ensuring the heights of two sibling subtrees differ by at most 1?",
    options: ["AVL Tree", "B+ Tree", "Splay Tree", "Trie"],
    correct_option_index: 0,
    explanation: "An AVL tree strictly enforces a balance factor of {-1, 0, +1} for every node, performing rotations whenever the height delta exceeds 1.",
    category: "Data Structures",
    difficulty: "easy"
  },
  {
    question_text: "In amortized analysis, what is the amortized cost per push operation on a dynamic array that doubles in capacity upon reaching full limit?",
    options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"],
    correct_option_index: 0,
    explanation: "Although array doubling takes O(N) work, it occurs exponentially infrequently, resulting in an amortized O(1) time per append.",
    category: "Data Structures",
    difficulty: "easy"
  },
  {
    question_text: "What algorithm is typically used in Git to compute the diff between two source files?",
    options: ["Myers Diff Algorithm", "Levenshtein Automaton", "Knuth-Morris-Pratt", "Aho-Corasick"],
    correct_option_index: 0,
    explanation: "Git primarily relies on Eugene Myers' O(ND) greedy diff algorithm, which finds the shortest edit script (SES) in an edit graph.",
    category: "Algorithms",
    difficulty: "hard"
  },
  {
    question_text: "What is the average time complexity of searching for a key in a Skip List with N elements?",
    options: ["O(log N)", "O(1)", "O(N)", "O(sqrt(N))"],
    correct_option_index: 0,
    explanation: "By utilizing probabilistic forward pointers at multiple tower levels, a Skip List provides O(log N) average time for search, insertion, and deletion.",
    category: "Data Structures",
    difficulty: "medium"
  },
  {
    question_text: "Which sorting algorithm is guaranteed to be both stable and achieve O(N log N) worst-case time complexity without auxiliary O(N) memory?",
    options: ["Block Merge Sort", "Standard QuickSort", "HeapSort", "Bubble Sort"],
    correct_option_index: 0,
    explanation: "Block Merge Sort (or In-place stable merge sort) achieves O(N log N) worst-case time with O(1) auxiliary space while maintaining stability.",
    category: "Algorithms",
    difficulty: "hard"
  },
  {
    question_text: "In topological sorting of a Directed Acyclic Graph (DAG), what does a cycle indicate?",
    options: ["Topological sort is impossible", "The graph has multiple sinks", "All vertices have in-degree 1", "The graph is bipartite"],
    correct_option_index: 0,
    explanation: "A topological ordering requires that for every directed edge u -> v, u comes before v. A directed cycle creates a mutual dependency contradiction.",
    category: "Algorithms",
    difficulty: "easy"
  },
  {
    question_text: "What is the space complexity of Tarjan's algorithm for finding Strongly Connected Components in a graph with V vertices and E edges?",
    options: ["O(V)", "O(V * E)", "O(E^2)", "O(V^2)"],
    correct_option_index: 0,
    explanation: "Tarjan's algorithm uses a DFS recursion stack, lowlink array, and disc array, requiring only O(V) auxiliary memory.",
    category: "Algorithms",
    difficulty: "medium"
  },

  // 2. Operating Systems & Concurrency
  {
    question_text: "In modern x86-64 operating systems, what is the default standard page size for virtual memory?",
    options: ["4 KB", "64 KB", "1 MB", "512 Bytes"],
    correct_option_index: 0,
    explanation: "Standard virtual memory architectures on x86-64 utilize 4 KB base page frames, with options for 2 MB or 1 GB HugePages.",
    category: "Operating Systems",
    difficulty: "easy"
  },
  {
    question_text: "Which condition is NOT one of Coffman's four necessary conditions for a deadlock to occur?",
    options: ["Preemptive Resource Allocation", "Mutual Exclusion", "Hold and Wait", "Circular Wait"],
    correct_option_index: 0,
    explanation: "Coffman's conditions require 'No Preemption'. If resources can be preempted from holding processes, deadlock is prevented.",
    category: "Operating Systems",
    difficulty: "easy"
  },
  {
    question_text: "What kernel mechanism allows a thread to sleep until a hardware interrupt occurs without consuming CPU cycles in a spinlock?",
    options: ["Wait Queues / Condition Variables", "Busy Waiting Loop", "Polling Registers", "Direct Memory Access"],
    correct_option_index: 0,
    explanation: "Kernel wait queues place the thread into TASK_INTERRUPTIBLE or TASK_UNINTERRUPTIBLE state, relinquishing the CPU until an interrupt handler wakes it.",
    category: "Operating Systems",
    difficulty: "medium"
  },
  {
    question_text: "In the context of CPU scheduling, what is the 'Convoy Effect'?",
    options: ["Short processes waiting behind a long CPU-bound process in FCFS", "I/O bound processes starving CPU bound ones", "Multiple threads competing for one lock", "Cache thrashing across CPU cores"],
    correct_option_index: 0,
    explanation: "Under First-Come, First-Served (FCFS) scheduling, a single heavy CPU-bound process can hold the CPU while many fast I/O processes sit idle in queue.",
    category: "Operating Systems",
    difficulty: "medium"
  },
  {
    question_text: "What CPU instruction is fundamental to implementing lock-free atomic data structures on x86 architectures?",
    options: ["CMPXCHG (Compare-and-Swap)", "MOVNTQ", "JMP", "TEST"],
    correct_option_index: 0,
    explanation: "The CMPXCHG (Compare and Exchange) instruction allows atomic read-modify-write synchronization without locking the operating system kernel.",
    category: "Operating Systems",
    difficulty: "medium"
  },
  {
    question_text: "What is the primary cause of 'Thrashing' in an operating system's virtual memory manager?",
    options: ["Excessive page faults causing continuous disk swapping", "CPU core thermal throttling", "Exhaustion of file descriptors", "Memory leaks in user space"],
    correct_option_index: 0,
    explanation: "Thrashing occurs when the sum of active processes' working sets exceeds physical RAM, spending more time swapping pages than executing instructions.",
    category: "Operating Systems",
    difficulty: "easy"
  },
  {
    question_text: "What does the copy-on-write (COW) optimization accomplish during a POSIX fork() system call?",
    options: ["Defers copying physical memory pages until a process writes to them", "Copies the entire stack immediately", "Shares disk files across network sockets", "Encrypts child process memory"],
    correct_option_index: 0,
    explanation: "COW shares read-only page table entries between parent and child until one process attempts a write, triggering a page fault that duplicates only that page.",
    category: "Operating Systems",
    difficulty: "medium"
  },
  {
    question_text: "In Linux process management, what state does a process enter if it has terminated but its parent has not yet called wait()?",
    options: ["Zombie (defunct)", "Orphan", "D-State (Uninterruptible Sleep)", "Stopped"],
    correct_option_index: 0,
    explanation: "A Zombie process retains an entry in the process table to hold its exit status code until the parent reaps it via wait() or waitpid().",
    category: "Operating Systems",
    difficulty: "easy"
  },
  {
    question_text: "Which memory allocation anomaly describes when increasing the number of page frames causes an increase in the number of page faults under FIFO?",
    options: ["Bélády's Anomaly", "Amdahl's Paradox", "Dining Philosophers Anomaly", "Priority Inversion"],
    correct_option_index: 0,
    explanation: "Bélády's Anomaly proves that under First-In-First-Out (FIFO) page replacement, allocating more physical page frames can paradoxically increase page faults.",
    category: "Operating Systems",
    difficulty: "medium"
  },
  {
    question_text: "What hardware component accelerates virtual-to-physical address translation by caching recent page table lookups?",
    options: ["Translation Lookaside Buffer (TLB)", "Instruction Pre-fetch Buffer", "Memory Controller Hub", "Branch Target Buffer"],
    correct_option_index: 0,
    explanation: "The TLB is a dedicated high-speed associative hardware cache within the MMU that stores recent virtual-to-physical page mappings.",
    category: "Operating Systems",
    difficulty: "easy"
  },

  // 3. Computer Networks & Protocols
  {
    question_text: "Which transport protocol underpins HTTP/3 to eliminate Head-of-Line blocking over unreliable connections?",
    options: ["QUIC (over UDP)", "SCTP", "Raw TCP with Fast Open", "WebSocket"],
    correct_option_index: 0,
    explanation: "HTTP/3 runs atop QUIC (which operates over UDP), multiplexing individual streams independently so packet loss in one stream never stalls others.",
    category: "Networks",
    difficulty: "easy"
  },
  {
    question_text: "In TCP congestion control, what algorithm triggers when 3 duplicate ACKs are received?",
    options: ["Fast Retransmit & Fast Recovery", "Slow Start restart to 1 MSS", "Additive Decrease", "Nagle's Algorithm"],
    correct_option_index: 0,
    explanation: "Receiving three duplicate ACKs signals that a specific packet was lost but packets ahead of it arrived, invoking Fast Retransmit without waiting for an RTO timeout.",
    category: "Networks",
    difficulty: "medium"
  },
  {
    question_text: "What is the primary difference between a Distance-Vector routing protocol (e.g., RIP) and a Link-State routing protocol (e.g., OSPF)?",
    options: ["Link-State routers build a complete topological map of the entire network", "Distance-Vector uses Dijkstra algorithm", "Link-State suffers from count-to-infinity", "Distance-Vector has faster convergence"],
    correct_option_index: 0,
    explanation: "In Link-State protocols, every router floods its local link states so all nodes compute the shortest path tree from an identical network graph map.",
    category: "Networks",
    difficulty: "medium"
  },
  {
    question_text: "In TLS 1.3, how many round trips (RTT) are required for a client and server to establish a secure handshake if resuming a session via 0-RTT?",
    options: ["0 RTT (Early Data)", "1 RTT", "2 RTT", "3 RTT"],
    correct_option_index: 0,
    explanation: "TLS 1.3 enables 0-RTT session resumption, permitting clients to transmit early application payload data in their initial ClientHello message.",
    category: "Networks",
    difficulty: "medium"
  },
  {
    question_text: "What is the maximum payload size (MTU) of a standard Ethernet frame before IP fragmentation occurs?",
    options: ["1500 Bytes", "9000 Bytes", "576 Bytes", "65535 Bytes"],
    correct_option_index: 0,
    explanation: "Standard IEEE 802.3 Ethernet defines an MTU of 1500 bytes for the data payload (excluding Ethernet header and CRC trailer).",
    category: "Networks",
    difficulty: "easy"
  },
  {
    question_text: "Which DNS record type specifies the authoritative mail servers responsible for accepting email on behalf of a domain name?",
    options: ["MX Record", "CNAME Record", "PTR Record", "NS Record"],
    correct_option_index: 0,
    explanation: "MX (Mail Exchange) records define the priority and hostnames of SMTP mail transfer agents responsible for the domain.",
    category: "Networks",
    difficulty: "easy"
  },
  {
    question_text: "What mechanism in IPv6 replaces IPv4's Address Resolution Protocol (ARP) for local link layer discovery?",
    options: ["Neighbor Discovery Protocol (NDP)", "ICMPv6 Broadcast", "DHCPv6 Snooping", "RARP"],
    correct_option_index: 0,
    explanation: "IPv6 replaces broadcast-based ARP with NDP (Neighbor Discovery Protocol), using ICMPv6 multicast solicitation and advertisement messages.",
    category: "Networks",
    difficulty: "medium"
  },
  {
    question_text: "In BGP (Border Gateway Protocol), what type of AS path loop prevention mechanism is used?",
    options: ["A router discards any update containing its own AS number in the AS_PATH attribute", "Split Horizon with Poison Reverse", "Dijkstra SPF calculation", "TTL decrementing"],
    correct_option_index: 0,
    explanation: "BGP is a path-vector protocol; if a border router inspects the incoming AS_PATH attribute and observes its own Autonomous System number, it drops the advertisement.",
    category: "Networks",
    difficulty: "hard"
  },
  {
    question_text: "What purpose does the SYN Cookie technique serve on web servers?",
    options: ["Mitigates TCP SYN Flood attacks by avoiding state allocation in the SYN queue", "Authenticates HTTP cookie sessions", "Speeds up TLS key exchange", "Performs load balancing"],
    correct_option_index: 0,
    explanation: "SYN cookies encode connection parameters into the initial sequence number of the SYN-ACK, allocating zero memory until the client returns the final ACK.",
    category: "Networks",
    difficulty: "medium"
  },
  {
    question_text: "Which HTTP status code signifies that a server refuses to process a request because the request payload is larger than the server is willing or able to process?",
    options: ["413 Content Too Large", "415 Unsupported Media Type", "422 Unprocessable Entity", "502 Bad Gateway"],
    correct_option_index: 0,
    explanation: "HTTP 413 (Payload Too Large / Content Too Large) indicates that the request body exceeds the server's configured limits.",
    category: "Networks",
    difficulty: "easy"
  },

  // 4. Databases & Distributed Systems
  {
    question_text: "According to the CAP Theorem, when a network partition (P) occurs, what trade-off must a distributed database make?",
    options: ["Choose between Consistency (C) and Availability (A)", "Choose between Latency and Durability", "Sacrifice Partition Tolerance", "Guarantee both ACID and BASE"],
    correct_option_index: 0,
    explanation: "Under Eric Brewer's CAP theorem, when nodes cannot communicate across a network partition, the system must either deny requests (Consistency) or return potentially stale data (Availability).",
    category: "Databases",
    difficulty: "easy"
  },
  {
    question_text: "In database transaction isolation levels, what concurrency phenomenon does 'Snapshot Isolation' prevent while still being susceptible to 'Write Skew'?",
    options: ["Non-repeatable reads and Phantom reads", "Dirty writes", "Lost updates", "Cascading rollbacks"],
    correct_option_index: 0,
    explanation: "Snapshot Isolation prevents dirty reads, non-repeatable reads, and phantom reads using MVCC snapshots, but can suffer from Write Skew anomalies unless Serializable is used.",
    category: "Databases",
    difficulty: "hard"
  },
  {
    question_text: "Why are Log-Structured Merge (LSM) Trees preferred over traditional B+ Trees in write-heavy storage engines like Cassandra and RocksDB?",
    options: ["LSM Trees turn random disk writes into sequential append-only writes", "LSM Trees have faster point reads", "LSM Trees require zero compaction", "LSM Trees don't use memory buffers"],
    correct_option_index: 0,
    explanation: "LSM trees buffer mutations in memory (MemTable) and flush them to disk sequentially as SSTables, yielding superior write throughput compared to random in-place B+ tree updates.",
    category: "Databases",
    difficulty: "medium"
  },
  {
    question_text: "In the Raft Consensus Algorithm, what triggers a follower node to initiate a new election and increment its term counter?",
    options: ["Election timeout elapses without receiving a heartbeat AppendEntries RPC", "Leader sends a stepped-down signal", "Disk write fails", "Client sends a direct write request"],
    correct_option_index: 0,
    explanation: "Followers reset a randomized election timer upon each heartbeat. If no message arrives before the timer expires, the follower assumes the leader is dead and becomes a candidate.",
    category: "Distributed Systems",
    difficulty: "medium"
  },
  {
    question_text: "What is the primary role of a Write-Ahead Log (WAL) in relational databases like PostgreSQL and SQLite?",
    options: ["Guarantees Atomicity and Durability (A & D) across system crashes", "Accelerates SQL string parsing", "Performs automatic query optimization", "Backs up tables to cloud storage"],
    correct_option_index: 0,
    explanation: "By recording transactions sequentially to the WAL before applying changes to database data pages, the engine can reliably replay committed transactions after an unexpected power outage.",
    category: "Databases",
    difficulty: "easy"
  },
  {
    question_text: "What distributed systems anomaly is solved by using Vector Clocks rather than standard Lamport Timestamps?",
    options: ["Detecting concurrent, causally independent events", "Total ordering of all events", "Clock skew synchronization across NTP", "Byzantine fault tolerance"],
    correct_option_index: 0,
    explanation: "While Lamport timestamps provide a total order, Vector Clocks preserve causal relationships and enable detection of concurrent conflicting modifications across replicas.",
    category: "Distributed Systems",
    difficulty: "hard"
  },
  {
    question_text: "In SQL, what is the difference between a clustered index and a non-clustered index?",
    options: ["A clustered index defines the actual physical storage order of the table data rows", "A table can have multiple clustered indexes", "A non-clustered index stores table data directly", "Clustered indexes are slower for range queries"],
    correct_option_index: 0,
    explanation: "A table can have only one clustered index because its leaf nodes contain the actual physical table data pages ordered by the index key.",
    category: "Databases",
    difficulty: "medium"
  },
  {
    question_text: "Which consistency model guarantees that if a process reads value V after writing it, any subsequent read by that same process will observe V or a later version?",
    options: ["Read-Your-Writes Consistency", "Monotonic Reads", "Linearizability", "Eventual Consistency"],
    correct_option_index: 0,
    explanation: "Read-your-writes consistency is a client-centric consistency model ensuring an actor always observes the consequences of its own previous update operations.",
    category: "Distributed Systems",
    difficulty: "medium"
  },
  {
    question_text: "In Two-Phase Locking (2PL), what does Strict 2PL require regarding exclusive write locks?",
    options: ["All exclusive locks must be held until the transaction commits or aborts", "Locks are released immediately after query completion", "No shared locks may be taken", "Locks are acquired at database startup"],
    correct_option_index: 0,
    explanation: "Strict 2PL guarantees that transactions cannot read uncommitted data (avoiding cascading aborts) by mandating that all X-locks be retained until the transaction terminates.",
    category: "Databases",
    difficulty: "hard"
  },
  {
    question_text: "What indexing structure is optimized for high-dimensional nearest-neighbor searches in vector databases for AI embeddings?",
    options: ["HNSW (Hierarchical Navigable Small World)", "B-Tree", "R-Tree", "Inverted Index"],
    correct_option_index: 0,
    explanation: "HNSW builds a multi-layer graph where proximity graphs are queried from sparse top layers to dense bottom layers, yielding fast approximate nearest neighbor (ANN) retrieval.",
    category: "Databases",
    difficulty: "medium"
  },

  // 5. Computer Architecture & Compilers
  {
    question_text: "What architectural hazard in instruction pipelining occurs when one instruction depends on the result of an earlier instruction that has not yet completed?",
    options: ["Data Hazard (Read-After-Write)", "Structural Hazard", "Control Hazard", "Branch Misprediction"],
    correct_option_index: 0,
    explanation: "A data hazard (such as RAW) arises when instructions that are close in the pipeline attempt to read a register before an earlier instruction writes back to it.",
    category: "Architecture",
    difficulty: "medium"
  },
  {
    question_text: "What is the function of the MESI cache coherency protocol in symmetric multiprocessing (SMP) hardware?",
    options: ["Maintains consistent state across L1/L2 caches (Modified, Exclusive, Shared, Invalid)", "Compresses instructions in RAM", "Translates virtual page tables", "Schedules interrupt priorities"],
    correct_option_index: 0,
    explanation: "MESI uses four line states to ensure that multiple CPU cores modifying the same memory location do not read stale or corrupted cache lines.",
    category: "Architecture",
    difficulty: "hard"
  },
  {
    question_text: "In compiler optimization, what does Static Single Assignment (SSA) form mandate for every variable in intermediate representation?",
    options: ["Every variable must be defined and assigned exactly once", "All loops are unrolled at compile time", "Registers are allocated exclusively to global variables", "All functions are inlined"],
    correct_option_index: 0,
    explanation: "SSA assigns a unique version subscript to each variable assignment (e.g. x1, x2) and uses phi-nodes at join points, dramatically simplifying dataflow optimization passes.",
    category: "Compilers",
    difficulty: "hard"
  },
  {
    question_text: "What is the primary motivation for Out-of-Order (OoO) instruction execution in modern superscalar processors?",
    options: ["Executes ready instructions while stalled instructions wait for memory operands", "Reduces chip clock frequency", "Simplifies compiler register allocation", "Eliminates branch predictors"],
    correct_option_index: 0,
    explanation: "Processors use reorder buffers and reservation stations to dynamically execute independent instructions ahead of schedule while waiting for long-latency DRAM access.",
    category: "Architecture",
    difficulty: "medium"
  },
  {
    question_text: "Which compiler pass converts source code text into a structured stream of tokens?",
    options: ["Lexical Analysis (Scanner/Lexer)", "Semantic Analysis", "Type Checker", "Code Generator"],
    correct_option_index: 0,
    explanation: "The lexer reads the raw input character stream and converts it into token records (identifiers, keywords, operators, literals) for the syntax parser.",
    category: "Compilers",
    difficulty: "easy"
  },
  {
    question_text: "What does Amdahl's Law calculate regarding parallel computing?",
    options: ["The theoretical maximum speedup of a program when utilizing multiple processors", "The energy consumption of a transistor", "The clock cycle count of a RISC CPU", "The bandwidth of PCI Express lanes"],
    correct_option_index: 0,
    explanation: "Amdahl's Law states that the speedup of a program is fundamentally limited by the proportion of the task that must be executed sequentially: S = 1 / ((1 - P) + P / N).",
    category: "Architecture",
    difficulty: "medium"
  },
  {
    question_text: "In speculative execution, what hardware vulnerability family leverages microarchitectural branch predictors to leak secret data across address spaces?",
    options: ["Spectre", "Heartbleed", "Shellshock", "Stuxnet"],
    correct_option_index: 0,
    explanation: "Spectre tricks CPU speculative execution into reading unauthorized memory and leaves measurable cache residency footprints that can be read via timing side channels.",
    category: "Architecture",
    difficulty: "medium"
  },
  {
    question_text: "What is the primary difference between RISC (Reduced Instruction Set Computer) and CISC architectures?",
    options: ["RISC emphasizes simple, single-cycle load-store instructions with fixed width", "CISC has fewer addressing modes", "RISC executes instructions micro-coded in ROM", "CISC does not support hardware registers"],
    correct_option_index: 0,
    explanation: "RISC architectures use fixed-length instructions, load/store memory operations, and uniform pipeline cycles, while CISC provides complex variable-length instructions.",
    category: "Architecture",
    difficulty: "easy"
  },
  {
    question_text: "In Just-In-Time (JIT) compilation (e.g. V8 engine), what does an 'On-Stack Replacement' (OSR) allow?",
    options: ["Replaces a currently running interpreted loop with optimized machine code mid-execution", "Deallocates stack frames", "Compiles C++ bindings to bytecode", "Swaps thread execution between CPU cores"],
    correct_option_index: 0,
    explanation: "OSR allows an executing loop that has become hot to switch execution directly to freshly JIT-compiled native code without waiting for the enclosing function to return.",
    category: "Compilers",
    difficulty: "hard"
  },
  {
    question_text: "What memory latency phenomenon is known as 'False Sharing' in multi-threaded programs?",
    options: ["Threads on different cores modifying separate variables that share the same cache line", "Threads accessing pointers without volatile qualifiers", "Pointers referencing deallocated heap memory", "Two threads acquiring mutex locks in reverse order"],
    correct_option_index: 0,
    explanation: "False sharing occurs when independent variables reside on the same 64-byte cache line; writes by one core invalidate the line on other cores, degrading performance.",
    category: "Architecture",
    difficulty: "medium"
  },

  // 6. Cybersecurity & Cryptography
  {
    question_text: "Which mathematical problem provides the hardness guarantee for standard RSA public-key cryptography?",
    options: ["Integer Factorization of large composite numbers", "Discrete Logarithm on elliptic curves", "Shortest Vector Problem in lattices", "Traveling Salesperson Problem"],
    correct_option_index: 0,
    explanation: "RSA relies on the computational difficulty of factoring the product of two large prime numbers N = p * q.",
    category: "Security",
    difficulty: "easy"
  },
  {
    question_text: "What security property ensures that even if an attacker compromises a server's long-term private key today, they cannot decrypt recorded past communications?",
    options: ["Perfect Forward Secrecy (PFS)", "Zero-Knowledge Authentication", "Homomorphic Encryption", "Non-repudiation"],
    correct_option_index: 0,
    explanation: "PFS uses ephemeral Diffie-Hellman key exchanges (e.g., ECDHE) so session keys are generated dynamically and discarded, protecting past sessions.",
    category: "Security",
    difficulty: "medium"
  },
  {
    question_text: "Why is SHA-256 resistant to length extension attacks, whereas standard SHA-1 and MD5 are vulnerable?",
    options: ["SHA-256 is vulnerable to length extension; SHA-3 (Keccak) or HMAC is used to prevent it", "SHA-256 uses double hashing internally", "SHA-256 truncates its state vector", "SHA-256 uses sponge construction"],
    correct_option_index: 0,
    explanation: "Standard Merkle-Damgård constructions including SHA-256 are vulnerable to length extension unless wrapped in HMAC or using SHA-512/256 or SHA-3 sponge functions.",
    category: "Security",
    difficulty: "hard"
  },
  {
    question_text: "What modern defense mechanism prevents execution of shellcode injected into an application's call stack?",
    options: ["Data Execution Prevention (DEP / W^X)", "Address Space Layout Randomization (ASLR)", "Stack Canaries", "Control Flow Guard"],
    correct_option_index: 0,
    explanation: "DEP marks memory pages containing the stack and heap as non-executable (NX bit), triggering a hardware fault if execution jumps into them.",
    category: "Security",
    difficulty: "easy"
  },
  {
    question_text: "In cryptographic Zero-Knowledge Proofs (ZKPs), what three properties must a proof system satisfy?",
    options: ["Completeness, Soundness, and Zero-Knowledge", "Integrity, Confidentiality, and Authenticity", "Non-repudiation, Secrecy, and Verifiability", "Determinism, Randomness, and Unforgeability"],
    correct_option_index: 0,
    explanation: "A ZKP must be Complete (honest prover convinces verifier), Sound (cheating prover cannot deceive verifier), and Zero-Knowledge (reveals nothing beyond validity).",
    category: "Security",
    difficulty: "medium"
  },

  // 7. Sci-Fi Computing & AI Systems
  {
    question_text: "In the Transformer deep learning architecture, what is the computational complexity of the standard Scaled Dot-Product Self-Attention mechanism with sequence length N?",
    options: ["O(N^2)", "O(N log N)", "O(N)", "O(N^3)"],
    correct_option_index: 0,
    explanation: "Calculating the attention score matrix involves multiplying the Query matrix (N x d) by Key transpose (d x N), resulting in an N x N matrix and O(N^2) complexity.",
    category: "AI & SciFi",
    difficulty: "medium"
  },
  {
    question_text: "In quantum computing, what phenomenon allows two entangled qubits to exhibit instantaneous correlation regardless of spatial separation?",
    options: ["Quantum Non-Locality / Entanglement", "Quantum Tunneling", "Wavefunction Decoherence", "Superconducting Flux"],
    correct_option_index: 0,
    explanation: "Quantum entanglement forms an inseparable joint state between particles where measuring one instantaneously dictates the state of the other.",
    category: "AI & SciFi",
    difficulty: "easy"
  },
  {
    question_text: "What role does the Softmax function play in the output classification layer of a deep neural network?",
    options: ["Converts raw unnormalized logit values into a valid probability distribution summing to 1", "Prevents vanishing gradients in hidden layers", "Filters out negative weights", "Performs spatial convolution"],
    correct_option_index: 0,
    explanation: "Softmax exponentiates logits and normalizes them across all classes so each output value falls between 0 and 1 with a total sum of exactly 1.0.",
    category: "AI & SciFi",
    difficulty: "easy"
  },
  {
    question_text: "In reinforcement learning, what does the Bellman Optimality Equation iteratively compute?",
    options: ["The maximum expected cumulative future reward from a given state", "The loss gradient of backpropagation", "The policy entropy penalty", "The discount factor gamma"],
    correct_option_index: 0,
    explanation: "The Bellman equation defines the optimal state-value or action-value function Q*(s, a) as the immediate reward plus the discounted expected optimal value of the successor state.",
    category: "AI & SciFi",
    difficulty: "hard"
  },
  {
    question_text: "In Interstellar-inspired robotics, if TARS is asked to calibrate its 'Humor Setting' to 75% and 'Honesty' to 90%, which algorithmic principle governs ethical AI agent alignment?",
    options: ["Constrained Objective Optimization with Human Preference Modeling (RLHF)", "Unrestricted Gradient Ascent", "Static Rule Lookups", "Stochastic Hill Climbing"],
    correct_option_index: 0,
    explanation: "Tuning agent behaviors like humor and absolute honesty while ensuring human safety aligns with Reinforcement Learning from Human Feedback (RLHF) and multi-objective Pareto optimization.",
    category: "AI & SciFi",
    difficulty: "medium"
  }
];
