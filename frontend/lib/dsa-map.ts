export interface Pattern {
  id: string;
  name: string;
  description: string;
  prerequisites?: string[];
  companies?: string[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  patterns: Pattern[];
}

export const DSA_KNOWLEDGE_MAP: Topic[] = [
  {
    id: "arrays",
    name: "Arrays",
    description: "Fundamental data structure storing elements sequentially.",
    patterns: [
      {
        id: "basics",
        name: "Basics",
        description:
          "Fundamental array operations, traversals, and in-place manipulations.",
      },
      {
        id: "two-pointer",
        name: "Two Pointer",
        description:
          "Use two pointers to iterate through data to optimize space and time.",
        prerequisites: ["Basics"],
        companies: ["Google", "Meta", "Amazon"],
      },
      {
        id: "sliding-window",
        name: "Sliding Window",
        description:
          "Maintain a dynamic range while processing contiguous subsets of data.",
        prerequisites: ["Two Pointer"],
        companies: ["Google", "Amazon", "Microsoft"],
      },
      {
        id: "prefix-sum",
        name: "Prefix Sum",
        description:
          "Precompute cumulative sums to answer range queries efficiently.",
        prerequisites: ["Basics"],
      },
      {
        id: "kadanes-algorithm",
        name: "Kadane's Algorithm",
        description:
          "Dynamic programming technique to find the maximum subarray sum.",
        prerequisites: ["Basics"],
      },
    ],
  },
  {
    id: "strings",
    name: "Strings",
    description:
      "Sequence of characters, often involving pattern matching and manipulation.",
    patterns: [
      {
        id: "string-manipulation",
        name: "Manipulation",
        description:
          "Basic operations like reversing, validating palindromes, and parsing.",
      },
      {
        id: "anagrams",
        name: "Anagrams",
        description: "Group or check strings by character frequency.",
      },
      {
        id: "trie-basics",
        name: "Trie (Prefix Tree)",
        description:
          "Tree structure optimized for prefix-based string searching.",
        companies: ["Amazon", "Google", "Microsoft"],
      },
    ],
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    description: "Linear collection of nodes, where each points to the next.",
    patterns: [
      {
        id: "fast-slow-pointers",
        name: "Fast & Slow Pointers",
        description:
          "Also known as Tortoise and Hare algorithm, used for cycle detection.",
      },
      {
        id: "in-place-reversal",
        name: "In-place Reversal",
        description: "Reverse links between nodes without using extra space.",
      },
      {
        id: "merge-lists",
        name: "Merging Lists",
        description: "Techniques for combining multiple sorted linked lists.",
      },
    ],
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    description: "LIFO and FIFO data structures.",
    patterns: [
      {
        id: "monotonic-stack",
        name: "Monotonic Stack",
        description:
          "Stack whose elements are strictly increasing or decreasing.",
        companies: ["Amazon", "Meta"],
      },
      {
        id: "parentheses",
        name: "Valid Parentheses",
        description:
          "Using stacks to track opened brackets and validate expressions.",
      },
    ],
  },
  {
    id: "trees",
    name: "Trees",
    description: "Hierarchical data structure with a root and child nodes.",
    patterns: [
      {
        id: "bfs",
        name: "Breadth-First Search (BFS)",
        description: "Level-by-level traversal using a queue.",
      },
      {
        id: "dfs",
        name: "Depth-First Search (DFS)",
        description:
          "Deep traversal exploring as far as possible along each branch.",
      },
      {
        id: "bst",
        name: "Binary Search Tree",
        description:
          "Tree where left children are smaller and right are larger than the parent.",
      },
    ],
  },
  {
    id: "graphs",
    name: "Graphs",
    description: "Nodes connected by edges representing complex networks.",
    patterns: [
      {
        id: "graph-bfs-dfs",
        name: "Graph Traversals",
        description: "Standard BFS and DFS applied to graph structures.",
      },
      {
        id: "topological-sort",
        name: "Topological Sort",
        description:
          "Linear ordering of vertices in a Directed Acyclic Graph (DAG).",
        companies: ["Amazon", "Google", "Microsoft"],
      },
      {
        id: "union-find",
        name: "Union Find",
        description:
          "Disjoint-set data structure to track connected components.",
      },
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    description:
      "Solving complex problems by breaking them down into simpler subproblems.",
    patterns: [
      {
        id: "1d-dp",
        name: "1D DP",
        description:
          "State depends only on a single parameter (e.g., Fibonacci, Climbing Stairs).",
      },
      {
        id: "2d-dp",
        name: "2D DP",
        description:
          "State depends on two parameters (e.g., Grid paths, Longest Common Subsequence).",
      },
      {
        id: "knapsack",
        name: "0/1 Knapsack",
        description:
          "Choosing a subset of items to maximize value without exceeding capacity.",
      },
    ],
  },
  {
    id: "backtracking",
    name: "Backtracking",
    description:
      "Incrementally building candidates to solutions and abandoning them when they fail.",
    patterns: [
      {
        id: "subsets",
        name: "Subsets & Permutations",
        description:
          "Generating all possible combinations or orderings of a set.",
      },
      {
        id: "combinations",
        name: "Combinations",
        description:
          "Generating sets of elements satisfying specific criteria.",
      },
    ],
  },
  {
    id: "greedy",
    name: "Greedy",
    description:
      "Making locally optimal choices at each step to find a global optimum.",
    patterns: [
      {
        id: "intervals",
        name: "Intervals",
        description:
          "Merging, scheduling, or finding overlaps in ranges of data.",
        companies: ["Google", "Meta", "Amazon"],
      },
    ],
  },
  {
    id: "math",
    name: "Math & Geometry",
    description: "Algorithmic problems relying on mathematical principles.",
    patterns: [
      {
        id: "prime-numbers",
        name: "Prime Numbers",
        description: "Sieve of Eratosthenes and prime factorization.",
      },
    ],
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    description: "Operating directly on bits for extreme efficiency.",
    patterns: [
      {
        id: "xor",
        name: "XOR Operations",
        description: "Using XOR properties to find missing/duplicate numbers.",
      },
    ],
  },
];
