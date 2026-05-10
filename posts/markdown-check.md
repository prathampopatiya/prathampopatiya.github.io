Windows Kernel Programming basics
Windows Internals
Kernel Programming
Kernel Programming Basics
Differences Between User Mode and Kernel Mode Development
| Specification | User Mode | Kernel Mode | |---|---|---| | Unhandled exceptions | Crashes the process | Crashes the system | | Terminations | When a process terminates, all private memory and resources are freed automatically | If a driver unloads without freeing everything it was using, there is a leak, only resolved in the next boot | | IRQL | PASSIVE_LEVEL (0) | DISPATCH_LEVEL (2) or higher | | Return values | API errors are sometimes ignored | Should almost never ignore errors | | Bad Coding | Typically localized to the process | Can affect the entire system | | Testing and Debugging | Typical testing and debugging done on the developer’s machine | Debugging must usually be done with another machine | | Libraries | Can use almost any C/C++ library (e.g. STL, Boost) | Most standard libraries cannot be used | | Exception Handling | Can use C++ exceptions or Structured Exception Handling (SEH) | Only SEH can be used | | C++ Usage | Full C++ runtime available | No C++ runtime |
The Kernel API
Kernel drivers use exported functions from kernel components. These functions are referred to as the Kernel API. Most functions are implemented within the kernel module itself (ntoskrnl.exe), but some may be implemented by other kernel modules such as the HAL (hal.dll).

| Prefix | Meaning | Example | | ------- | ---------------------------------- | ---------------------------- | | Ex | General executive functions | ExAllocatePoolWithTag | | Ke | General kernel functions | KeAcquireSpinLock | | Mm | Memory manager | MmProbeAndLockPages | | Rtl | General runtime library | RtlInitUnicodeString | | FsRtl | File system RTL | FsRtlGetFileSize | | Flt | File system mini-filter | FltCreateFile | | Ob | Object manager | ObReferenceObject | | Io | I/O manager | IoCompleteRequest | | Se | Security | SeAccessCheck | | Ps | Process manager | PsLookupProcessByProcessId | | Po | Power manager | PoSetSystemState | | Wmi | Windows Management Instrumentation | WmiTraceMessage | | Zw | Native API wrappers | ZwCreateFile | | Hal | Hardware abstraction layer | HalExamineMBR | | Cm | Config manager | CmRegisterCallbackEx |

Note

If you look at the exported functions list from ntoskrnl.exe, you’ll find many functions that are not documented in the Windows Driver Kit.

Dynamic Memory Allocation
Drivers often need to allocate memory dynamically. As discussed in Chapter 1, kernel thread stack size is rather small, so any large chunk of memory should be allocated dynamically.

The kernel provides two general memory pools for drivers to use:

Paged Pool — Memory pool that can be paged out if required.
Non-Paged Pool — Memory pool that is never paged out and is guaranteed to remain in RAM.
Note

The non-paged pool is a “better” memory pool because it can never incur a page fault.
