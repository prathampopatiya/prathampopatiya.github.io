---

title: "Windows Kernel Programming basics"
date: "2026-05-10"
excerpt: "Getting started into Windows Kernel Programming"
tags: ["Windows Internals", "Kernel Programming"]
author: "rayqu4z4"
------------------

# Kernel Programming Basics

## Differences Between User Mode and Kernel Mode Development

| Specification | User Mode | Kernel Mode |
|---|---|---|
| Unhandled exceptions | Crashes the process | Crashes the system |
| Terminations | When a process terminates, all private memory and resources are freed automatically | If a driver unloads without freeing everything it was using, there is a leak, only resolved in the next boot |
| IRQL | `PASSIVE_LEVEL (0)` | `DISPATCH_LEVEL (2)` or higher |
| Return values | API errors are sometimes ignored | Should almost never ignore errors |
| Bad Coding | Typically localized to the process | Can affect the entire system |
| Testing and Debugging | Typical testing and debugging done on the developer’s machine | Debugging must usually be done with another machine |
| Libraries | Can use almost any C/C++ library (e.g. STL, Boost) | Most standard libraries cannot be used |
| Exception Handling | Can use C++ exceptions or Structured Exception Handling (SEH) | Only SEH can be used |
| C++ Usage | Full C++ runtime available | No C++ runtime |
---

# The Kernel API

Kernel drivers use exported functions from kernel components. These functions are referred to as the **Kernel API**. Most functions are implemented within the kernel module itself (`ntoskrnl.exe`), but some may be implemented by other kernel modules such as the HAL (`hal.dll`).

| Prefix  | Meaning                            | Example                      |
| ------- | ---------------------------------- | ---------------------------- |
| `Ex`    | General executive functions        | `ExAllocatePoolWithTag`      |
| `Ke`    | General kernel functions           | `KeAcquireSpinLock`          |
| `Mm`    | Memory manager                     | `MmProbeAndLockPages`        |
| `Rtl`   | General runtime library            | `RtlInitUnicodeString`       |
| `FsRtl` | File system RTL                    | `FsRtlGetFileSize`           |
| `Flt`   | File system mini-filter            | `FltCreateFile`              |
| `Ob`    | Object manager                     | `ObReferenceObject`          |
| `Io`    | I/O manager                        | `IoCompleteRequest`          |
| `Se`    | Security                           | `SeAccessCheck`              |
| `Ps`    | Process manager                    | `PsLookupProcessByProcessId` |
| `Po`    | Power manager                      | `PoSetSystemState`           |
| `Wmi`   | Windows Management Instrumentation | `WmiTraceMessage`            |
| `Zw`    | Native API wrappers                | `ZwCreateFile`               |
| `Hal`   | Hardware abstraction layer         | `HalExamineMBR`              |
| `Cm`    | Config manager                     | `CmRegisterCallbackEx`       |

> **Note**
>
> If you look at the exported functions list from `ntoskrnl.exe`, you’ll find many functions that are not documented in the Windows Driver Kit.

---

# Dynamic Memory Allocation

Drivers often need to allocate memory dynamically. As discussed in Chapter 1, kernel thread stack size is rather small, so any large chunk of memory should be allocated dynamically.

The kernel provides two general memory pools for drivers to use:

* **Paged Pool** — Memory pool that can be paged out if required.
* **Non-Paged Pool** — Memory pool that is never paged out and is guaranteed to remain in RAM.

> **Note**
>
> The non-paged pool is a “better” memory pool because it can never incur a page fault.

Drivers should use this pool sparingly and only when necessary. In most other cases, drivers should use the paged pool.

The `POOL_TYPE` enumeration represents the pool types. Although the enumeration contains many pool variants, drivers commonly use only:

* `PagedPool`
* `NonPagedPool`
* `NonPagedPoolNx` (non-paged pool without execute permissions)

| Function                     | Description                                                          |
| ---------------------------- | -------------------------------------------------------------------- |
| `ExAllocatePool`             | Allocates memory from one of the pools with a default tag. Obsolete. |
| `ExAllocatePoolWithTag`      | Allocates memory from one of the pools with a specified tag          |
| `ExAllocatePoolZero`         | Same as `ExAllocatePoolWithTag`, but zeroes the allocated memory     |
| `ExAllocatePoolWithQuotaTag` | Allocates memory and charges the current process quota               |
| `ExFreePool`                 | Frees allocated memory                                               |

> **Tip**
>
> `ExAllocatePool` internally calls `ExAllocatePoolWithTag` using the tag `enoN` (`none` reversed).
>
> Older Windows versions used `mdW` (`WDM` reversed).
>
> Prefer using `ExAllocatePoolWithTag` instead.

## Sample Code

```cpp
#include <ntddk.h>
#include <ntstatus.h>
#include <wdm.h>

#define DRIVER_TAG 'dcba'

void SampleUnload(_In_ PDRIVER_OBJECT DriverObject) {
    UNREFERENCED_PARAMETER(DriverObject);
    DbgPrint(("Sample Driver Unload called\n"));
}

UNICODE_STRING g_RegistryPath;

extern "C"
NTSTATUS DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath) {
    UNREFERENCED_PARAMETER(RegistryPath);

    DriverObject->DriverUnload = SampleUnload;

    DbgPrint(("Sample driver initialized successfully\n"));

    g_RegistryPath.Buffer = (WCHAR*)ExAllocatePool2(
        PagedPool,
        RegistryPath->Length,
        DRIVER_TAG
    );

    if (g_RegistryPath.Buffer == nullptr) {
        DbgPrint(("Failed to allocate memory\n"));
        return STATUS_INSUFFICIENT_RESOURCES;
    }

    g_RegistryPath.MaximumLength = RegistryPath->Length;

    RtlCopyUnicodeString(
        &g_RegistryPath,
        (PUNICODE_STRING)RegistryPath
    );

    DbgPrint(("Original registry path: %wZ\n"), RegistryPath);
    DbgPrint(("Copied registry path: %wZ\n"), &g_RegistryPath);

    OSVERSIONINFOW osv = {0};
    osv.dwOSVersionInfoSize = sizeof(OSVERSIONINFOW);

    if (NT_SUCCESS(RtlGetVersion(&osv))) {
        DbgPrint(("OS Major Version: %lu\n"), osv.dwMajorVersion);
        DbgPrint(("OS Minor Version: %lu\n"), osv.dwMinorVersion);
        DbgPrint(("OS Build Number: %lu\n"), osv.dwBuildNumber);
    }

    return STATUS_SUCCESS;
}
```

---

# Linked Lists

The Windows kernel uses circular doubly linked lists in many of its internal data structures.

For example, all processes on the system are managed by `EPROCESS` structures connected in a circular doubly linked list. The head of this list is stored in the kernel variable `PsActiveProcessHead`.

```cpp
typedef struct _LIST_ENTRY {
    struct _LIST_ENTRY* Flink;
    struct _LIST_ENTRY* Blink;
} LIST_ENTRY, *PLIST_ENTRY;
```

A `LIST_ENTRY` is embedded inside another structure.

For example, the `EPROCESS` structure contains a member named `ActiveProcessLinks` of type `LIST_ENTRY`.

To retrieve the parent structure from a `LIST_ENTRY`, the kernel uses the `CONTAINING_RECORD` macro.

## Common Linked List Functions

| Function                      | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `InitializeListHead`          | Initializes an empty list                       |
| `InsertHeadList`              | Inserts an item at the head                     |
| `InsertTailList`              | Inserts an item at the tail                     |
| `IsListEmpty`                 | Checks whether the list is empty                |
| `RemoveHeadList`              | Removes the head item                           |
| `RemoveTailList`              | Removes the tail item                           |
| `RemoveEntryList`             | Removes a specific item                         |
| `ExInterlockedInsertHeadList` | Atomically inserts at the head using a spinlock |
| `ExInterlockedInsertTailList` | Atomically inserts at the tail using a spinlock |
| `ExInterlockedRemoveHeadList` | Atomically removes the head item                |

---

# The Driver Object

```cpp
NTSTATUS DriverEntry(
    PDRIVER_OBJECT DriverObject,
    PUNICODE_STRING RegistryPath
)
```

The `DriverEntry` routine accepts two parameters:

1. `DriverObject`
2. `RegistryPath`

The driver uses the `DriverObject` structure to initialize supported driver operations.

One important part of `DRIVER_OBJECT` is the `MajorFunction` array.

This array stores dispatch routines for different I/O request types.

## Major Functions

| Major Function                   | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `IRP_MJ_CREATE`                  | Create operation (`CreateFile`, `ZwCreateFile`)       |
| `IRP_MJ_CLOSE`                   | Close operation (`CloseHandle`, `ZwClose`)            |
| `IRP_MJ_READ`                    | Read operation (`ReadFile`, `ZwReadFile`)             |
| `IRP_MJ_WRITE`                   | Write operation (`WriteFile`, `ZwWriteFile`)          |
| `IRP_MJ_DEVICE_CONTROL`          | Invoked through `DeviceIoControl`                     |
| `IRP_MJ_INTERNAL_DEVICE_CONTROL` | Similar to device control but for kernel-mode callers |
| `IRP_MJ_SHUTDOWN`                | Invoked during system shutdown                        |
| `IRP_MJ_CLEANUP`                 | Invoked when the last handle to a file object closes  |
| `IRP_MJ_PNP`                     | Plug and Play callback                                |
| `IRP_MJ_POWER`                   | Power manager callback                                |

---

# Object Attributes

A common structure used by many kernel APIs is `OBJECT_ATTRIBUTES`.

```cpp
typedef struct _OBJECT_ATTRIBUTES {
    ULONG Length;
    HANDLE RootDirectory;
    PUNICODE_STRING ObjectName;
    ULONG Attributes;
    PVOID SecurityDescriptor;
    PVOID SecurityQualityOfService;
} OBJECT_ATTRIBUTES;

typedef OBJECT_ATTRIBUTES* POBJECT_ATTRIBUTES;
typedef const OBJECT_ATTRIBUTES* PCOBJECT_ATTRIBUTES;
```

The structure is typically initialized using the `InitializeObjectAttributes` macro.

## Object Attribute Flags

| Flag                                | Description                                              |
| ----------------------------------- | -------------------------------------------------------- |
| `OBJ_INHERIT`                       | Returned handle is inheritable                           |
| `OBJ_PERMANENT`                     | Object remains alive even after all handles are closed   |
| `OBJ_EXCLUSIVE`                     | Object allows exclusive access                           |
| `OBJ_CASE_INSENSITIVE`              | Performs case-insensitive lookup                         |
| `OBJ_OPENIF`                        | Opens existing object if it exists                       |
| `OBJ_OPENLINK`                      | Opens the symbolic link itself instead of resolving it   |
| `OBJ_KERNEL_HANDLE`                 | Creates a kernel-only handle                             |
| `OBJ_FORCE_ACCESS_CHECK`            | Forces access checks even in kernel mode                 |
| `OBJ_IGNORE_IMPERSONATED_DEVICEMAP` | Uses process device map instead of impersonated user map |
| `OBJ_DONT_REPARSE`                  | Prevents following reparse points                        |
