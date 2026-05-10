---
title: "Markdown Syntax Guide"
date: "2026-05-10"
excerpt: "A complete reference for all supported markdown features on this blog"
tags: ["guide", "markdown", "reference"]
author: "rayqu4z4"
---

# Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4

---

# Text Formatting

This is **bold text** and this is *italic text*.

This is ***bold and italic*** together.

This is ~~strikethrough~~ text.

This is `inline code` within a sentence.

---

# Tables

Tables must have each row on a **separate line**:

| Specification | User Mode | Kernel Mode |
|---------------|-----------|-------------|
| Unhandled exceptions | Crashes the process | Crashes the system |
| Terminations | Private memory freed automatically | Must free everything manually |
| IRQL | PASSIVE_LEVEL (0) | DISPATCH_LEVEL (2) or higher |
| Bad Coding | Localized to process | Affects entire system |

Another table example:

| Prefix | Meaning | Example |
|--------|---------|---------|
| Ex | General executive functions | ExAllocatePoolWithTag |
| Ke | General kernel functions | KeAcquireSpinLock |
| Mm | Memory manager | MmProbeAndLockPages |
| Rtl | General runtime library | RtlInitUnicodeString |
| Io | I/O manager | IoCompleteRequest |
| Zw | Native API wrappers | ZwCreateFile |

---

# Code Blocks

## C Code

```c
#include <ntddk.h>

NTSTATUS DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath) {
    UNREFERENCED_PARAMETER(RegistryPath);
    
    DriverObject->DriverUnload = DriverUnload;
    
    DbgPrint("Driver loaded successfully\n");
    return STATUS_SUCCESS;
}

void DriverUnload(PDRIVER_OBJECT DriverObject) {
    UNREFERENCED_PARAMETER(DriverObject);
    DbgPrint("Driver unloaded\n");
}
```

## Assembly

```asm
section .text
global _start

_start:
    xor eax, eax        ; Clear EAX
    mov ebx, 0x41414141 ; Move value to EBX
    push ebx            ; Push to stack
    call some_function  ; Call function
    ret
```

## Python

```python
import pefile

def analyze_pe(file_path):
    pe = pefile.PE(file_path)
    
    print(f"Entry Point: {hex(pe.OPTIONAL_HEADER.AddressOfEntryPoint)}")
    print(f"Image Base: {hex(pe.OPTIONAL_HEADER.ImageBase)}")
    
    for section in pe.sections:
        print(f"Section: {section.Name.decode().strip()}")
```

---

# Lists

## Unordered List

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

## Ordered List

1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B

---

# Blockquotes

> This is a blockquote. Use it for notes or important callouts.

> **Note:** The non-paged pool is a "better" memory pool because it can never incur a page fault.

> **Warning:** Kernel code runs at high privilege. A bug can crash the entire system.

> **Tip:** Always check return values in kernel mode development.

---

# Links and Images

[Link to Google](https://google.com)

[Link to my GitHub](https://github.com/prathampopatiya)

---

# Horizontal Rules

Use three dashes for a horizontal rule:

---

# Nested Content

> **Memory Pools in Windows Kernel:**
>
> - **Paged Pool** — Can be paged out if required
> - **Non-Paged Pool** — Never paged out, guaranteed in RAM
>
> Choose wisely based on your IRQL requirements.

---

# Inline Elements Mixed

Here is some `ExAllocatePoolWithTag` code that allocates memory from the **non-paged pool**. See the [Microsoft Docs](https://docs.microsoft.com) for more details.