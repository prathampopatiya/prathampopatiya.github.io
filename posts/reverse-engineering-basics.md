---
title: "Reverse Engineering a Simple Binary"
date: "2026-05-11"
excerpt: "Learn the basics of reverse engineering with a simple C binary. We'll disassemble, analyze control flow, and understand function calls."
tags: ["reverse-engineering", "binary-analysis", "tutorial", "assembly"]
author: "rayqu4z4"
category: "reverse-engineering"
risk: "low"
---

# Reverse Engineering a Simple Binary

Reverse engineering is the process of discovering the principles, structure, and functioning of a system through analysis of its artifacts. In this post, we'll walk through reversing a simple C binary using common tools and techniques.

## Tools You'll Need

Before we begin, make sure you have these tools installed:

```bash
# Install dependencies on Linux
sudo apt-get install binutils gdb radare2

# Or using homebrew on macOS
brew install binutils gdb radare2
```

## The Binary

Let's start with this simple C program:

```c
#include <stdio.h>
#include <string.h>

int verify_password(char *input) {
    char password[] = "superSecret123";
    
    if (strcmp(input, password) == 0) {
        return 1;
    }
    return 0;
}

int main() {
    char buffer[50];
    
    printf("Enter password: ");
    scanf("%49s", buffer);
    
    if (verify_password(buffer)) {
        printf("Access granted!\\n");
    } else {
        printf("Access denied!\\n");
    }
    
    return 0;
}
```

## Compilation and Initial Analysis

First, let's compile the binary with debugging symbols:

```bash
gcc -g -o verify_bin verify.c
```

Now let's examine it with `strings` to see what we can learn:

```bash
$ strings verify_bin | grep -i secret
superSecret123
```

**Key Finding**: The password is stored in plaintext in the binary. This is a common vulnerability in amateur code.

## Disassembly with GDB

Let's use GDB to understand the assembly:

```bash
gdb ./verify_bin
(gdb) disassemble main
```

Looking at the `main` function, we can see:
1. Stack space is allocated for the buffer
2. `printf` is called to display the prompt
3. `scanf` reads user input
4. The `verify_password` function is called
5. Conditional jump based on the return value

## Analysis of verify_password

The `verify_password` function contains:
- A stack-allocated string with the password
- A call to `strcmp` to compare input with the hardcoded password
- Returns 1 on success, 0 on failure

## Security Implications

This binary demonstrates several security issues:

1. **Plaintext Password Storage**: The password is hardcoded and visible via `strings`
2. **No Input Validation**: The scanf could be exploited with buffer overflow
3. **Timing Attacks**: The string comparison could leak information about correct characters
4. **No Authentication Mechanism**: Only a single string comparison for access

## Proper Implementation

Here's how this should be done in a real application:

```c
#include <stdio.h>
#include <string.h>
#include <crypt.h>

int verify_password(const char *input, const char *hash) {
    // Use a proper hashing algorithm like bcrypt or Argon2
    // Never store plaintext passwords
    struct crypt_data data;
    char *encrypted = crypt_r(input, hash, &data);
    return (encrypted != NULL && strcmp(encrypted, hash) == 0);
}
```

## Key Takeaways

- Always examine binaries with `strings`, `file`, and `readelf`
- Use GDB and radare2 for deeper analysis
- Never store credentials in plaintext
- Use proper cryptographic hashing for passwords
- Validate all input thoroughly

---

**Last Updated**: May 11, 2026  
**Difficulty**: Beginner  
**Time to Read**: 5 minutes
