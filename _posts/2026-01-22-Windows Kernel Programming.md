---
tags:
  - WindowsInternals
  - kernel
  - Programming
date: 22-01-26
Author: Pratham Popatiya
title: Windows kernel Programming
---

## Kernel Programming basics

**Differences between user mode and kernel mode development**

| specification         | user mode                                                                           | kernel mode                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Unhandled exceptions  | crashes the process                                                                 | crashes the system                                                                                           |
| Terminations          | When a process terminates, all private memory and resources are freed automatically | If a driver unloads without freeing everything it was using, there is a leak, only resolved in the next boot |
| IRQL                  | Always PASSIVE_LEVEL (0)                                                            | May be DISPATCH_LEVEL (2) or higher                                                                          |
| Return values         | API errors are sometimes ignored                                                    | Should (almost) never ignore errors                                                                          |
| Bad Coding            | Typically localized to the process                                                  | Typically localized to the process                                                                           |
| Testing and Debugging | Typical testing and debugging done on the developer’s machine                       | Debugging must be done with another machine                                                                  |
| Libraries             | Can use almost and C/C++ library (e.g. STL, boost)                                  | Most standard libraries cannot be used                                                                       |
| Exception Handling    | Can use C++ exceptions or Structured Exception Handling (SEH)                       | Only SEH can be used                                                                                         |
| C++ usage             | Full C++ runtime available                                                          | No C++ runtime                                                                                               |

---

## The Kernel API

Kernel drivers use exported functions from kernel components. These functions will be referred to as the Kernel API. Most functions are implemented within the kernel module itself (NtOskrnl.exe), but some may be implemented by other kernel modules, such the HAL (hal.dll).

| Prefix | Meaning                            | Example                    |
| ------ | ---------------------------------- | -------------------------- |
| Ex     | general executive functions        | ExAllocatePoolWithTag      |
| Ke     | general kernel functions           | KeAcquireSpinLock          |
| Mm     | memory manager                     | MmProbeAndLockPages        |
| Rtl    | general runtime lib                | RtlInitUnicodeString       |
| FsRtl  | file system Rtl                    | FsRtlGetFileSize           |
| Flt    | file system mini filter            | FltCreateFile              |
| Ob     | object manager                     | ObReferenceObject          |
| Io     | I/O manager                        | IoCompleteRequest          |
| Se     | Security                           | SeAccessCheck              |
| Ps     | Process manager                    | PsLookupProcessByProcessId |
| Po     | Power manager                      | PoSetSystemState           |
| Wmi    | windows management instrumentation | WmiTraceMessage            |
| Zw     | native API wrappers                | ZwCreateFile               |
| Hal    | Hardware abstraction layer         | HalExamineMBR              |
| Cm     | Config manager                     | CmRegisterCallbackEx       |

>[!Note]
>If you take a look at the exported functions list from NtOsKrnl.exe, you’ll find many functions that are not documented in the Windows Driver Kit


## Dynamic memory allocation

Drivers often need to allocate memory dynamically. As discussed in chapter 1, kernel thread stack size is rather small, so any large chunk of memory should be allocated dynamically.

The kernel provides two general memory pools for drivers to use (the kernel itself uses them as well). 
- Paged pool - memory pool that can be paged out if required. 
-  Non-Paged Pool - memory pool that is never paged out and is guaranteed to remain in RAM.

>[!Note]
>Clearly, the non-paged pool is a “better” memory pool as it can never incur a page fault.

Drivers should use this pool sparingly, only when necessary. In all other cases, drivers should use the paged pool. The `POOL_TYPE` enumeration represents the pool types. This enumeration includes many “types” of pools, but only three should be used by drivers: `PagedPool, NonPagedPool, NonPagedPoolNx (non-page pool without execute permissions)`.


| Function                     | Description                                                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ExAllocatePool`             | Allocate memory from one of the pools with a default tag. This function is considered obsolete. The next function in this table should be used instead |
| `ExAllocatePoolWithTag`      | Allocate memory from one of the pools with the specified tag                                                                                           |
| `ExAllocatePoolZero`         | Same as ExAllocatePoolWithTag, but zeroes out the memory block                                                                                         |
| `ExAllocatePoolWithQuotaTag` | Allocate memory from one of the pools with the specified tag and charge the current process quota for the allocation                                   |
| `ExFreePool`                 | Free an allocation. The function knows from which pool the allocation was made                                                                         |

>[!Tip]
>ExAllocatePool calls ExAllocatePoolWithTag using the tag enoN (the word “none” in reverse). Older Windows versions used ‘ mdW (WDM in reverse). 
>You should avoid this function and use ExAllocatePoolWithTag‘ instead. ExAllocatePoolZero is implemented inline in wdm.h by calling ExAllocatePoolWithTag and adding the POOL_ZERO_ALLOCATION (=1024) flag to the pool type.

### Sample code
```c++
#include <ntddk.h>
#include <ntstatus.h>
#include <wdm.h>
#define DRIVER_TAG 'dcba'

void SampleUnload(_In_ PDRIVER_OBJECT DriverObject) {
	UNREFERENCED_PARAMETER(DriverObject);
	DbgPrint(("Sample Driver Unload called\n"));
}

UNICODE_STRING g_RegistryPath;
extern "C" NTSTATUS
DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath) {
	UNREFERENCED_PARAMETER(RegistryPath);

	DriverObject->DriverUnload = SampleUnload;
	DbgPrint(("Sample driver initialized successfully\n"));
	g_RegistryPath.Buffer = (WCHAR*)ExAllocatePool2(PagedPool, RegistryPath->Length, DRIVER_TAG);
	if (g_RegistryPath.Buffer == nullptr) {
		DbgPrint(("Failed to allocate memory\n"));
		return STATUS_INSUFFICIENT_RESOURCES;
	}
	g_RegistryPath.MaximumLength = RegistryPath->Length;
	RtlCopyUnicodeString(&g_RegistryPath, (PUNICODE_STRING)RegistryPath);
	DbgPrint(("Original registry path: %wZ\n"),RegistryPath);
	DbgPrint(("Copied registry path: %wZ\n"), &g_RegistryPath);

	
	OSVERSIONINFOW osv = {0};
	osv.dwOSVersionInfoSize = sizeof(OSVERSIONINFOW);
	if (NT_SUCCESS(RtlGetVersion(_Out_ &osv))) {
		DbgPrint(("OS Major Version:%lu\n"), osv.dwMajorVersion);
		DbgPrint(("OS Minor Version:%lu\n"), osv.dwMinorVersion);
		DbgPrint(("OS build Number:%lu\n"), osv.dwBuildNumber);
	}

	return STATUS_SUCCESS;
}
```

## Linked Lists

The kernel uses circular doubly linked lists in many of its internal data structures. For example, all processes on the system are managed by `EPROCESS` structures, connected in a `circular doubly linked list`, where its head is stored the kernel variable `PsActiveProcessHead`.

```c++
typedef struct _LIST_ENTRY{
	struct _LIST_ENTRY *Flink;
	struct _LIST_ENTRY *Blink;
} LIST_ENTRY, *PLIST_ENTRY;
```

 One such structure is embedded inside the real structure of interest. For example, in the `EPROCESS` structure, the member `ActiveProcessLinks` is of type `LIST_ENTRY`, pointing to the next and previous `LIST_ENTRY` objects of other `EPROCESS` structures. 
 The head of a list is stored separately; in the case of the process, that’s `PsActiveProcessHead`. To get the pointer to the actual structure of interest given the address of a `LIST_ENTRY` can be obtained with the `CONTAINING_RECORD` macro.

When working with these linked lists, we have a head for the list, stored in a variable. This means that natural traversal is done by using the `Flink` member of the list to point to the next `LIST_ENTRY` in the list. Given a pointer to the `LIST_ENTRY`, what we’re really after is the `MyDataItem` that contains this list entry member. This is where the `CONTAINING_RECORD` comes in:

#### The common functions that are used while working with the above linked lists are listed below:-

| $\color{Aquamarine}Function$  | $\color{CadetBlue}Description$                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| `InitializeListHead`          | Initializes a list head to make an empty list. The forward and back pointers point to the forward pointer |
| `InsertHeadList`              | Insert an item to the head of the list.                                                                   |
| `InsertTailList`              | Insert an item to the tail of the list.                                                                   |
| `IsListEmpty`                 | Check if the list is empty.                                                                               |
| `RemoveHeadList`              | Remove the head of the list.                                                                              |
| `RemoveTailList`              | Remove the tail of the list.                                                                              |
| `RemoveEntryList`             | Remove the specific item from the list.                                                                   |
| `ExInterlockedInsertHeadList` | Insert an item at the head of the list atomically by using the specified spinlock.                        |
| `ExInterlockedInsertTailList` | Insert an item at the tail of the list atomically by using the specified spinlock.                        |
| `ExInterlockedRemoveHeadList` | Remove an item from the head of the list atomically by using the specified spinlock.                      |

### The Driver Object
```c++
NTSTATUS DriverEntry(PDRIVER_OBJECT DriverObject,PUNICODE_STRING Registrypath)
```

From the declaration it's quite obvious it accepts two arguments, the first is driver object, and another a `UNICODE_STRING`. The role of the driver at this point is to further initialize the structure to indicate what operations are supported by the driver.

The other important set of operations to initialize are called Dispatch Routines. This is an array of function pointers, stored in the in the MajorFunction member of `DRIVER_OBJECT`. This set specifies which operations the driver supports, such as Create, Read, Write, and so on.


| $\color{Brown}Major Functions$   | $\color{Green}Description$                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `IRP_MJ_CREATE`                  | Create operation. Typically invoked for `CreateFile` or `ZwCreateFile` calls.                                                   |
| `IRP_MJ_CLOSE`                   | Close operation. Normally invoked for `CloseHandle or ZwClose`                                                                  |
| `IRP_MJ_READ`                    | Read operation. Typically invoked for `ReadFile, ZwReadFile` and similar read APIs.                                             |
| `IRP_MJ_DEVICE_CONTROL`          | Write operation. Typically invoked for `WriteFile, ZwWriteFile`, and similar write APIs                                         |
| `IRP_MJ_INTERNAL_DEVICE CONTROL` | Generic call to a driver, invoked because of `DeviceIoControl` or `ZwDeviceIoControlFile` calls                                 |
| `IRP_MJ_SHUTDOWN`                | Similar to the previous one, but only available for kernel-mode callers.                                                        |
| `IRP_MJ_CLEANUP`                 | Called when the system shuts down if the driver has registered for shutdown notification with `IoRegisterShutdownNotification`. |
| `IRP_MJ_PNP`                     | Invoked when the last handle to a file object is closed, but the file object’s reference count is not zero                      |
| `IRP_MJ_POWER`                   | Power callback invoked by the Power Manager. Generally interesting for hardware-based drivers or filters to such drivers.       |

### Object Attributes
One of the common structures that shows up in many kernel APIs is OBJECT_ATTRIBUTES, defined like so:
```c++
typedef struct _OBJECT_ATTRIBUTES{
	ULONG Length;
	HANDLE RootDirectory;
	PUNICODE_STRING ObjectName;
	ULONG Attributes;
	PVOID SecurityDescriptors;
	PVOID SecurityQualityOfService;
} OBJECT_ATTRIBUTES;
typedef OBJECT_ATTRIBUTES,*POBJECT_ATTRIBUTES;
typedef const OBJECT_ATTRIBUTES,*POBJECT_ATTRIBUTES;
```

The structure is typically initialized with the` InitializeObjectAttributes macro`, that allows specifying all the structure members except Length (set automatically by the macro), and `SecurityQualityOfService`, which is not normally needed. Here is the description of the members:

### Object Attributes flags

| Flag(OBJ_)                             | Description                                                                                                                                                                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `INHERIT`(2)                           | The returned handle should be marked as inheritable                                                                                                                                                                                              |
| `PERMANENT`(0X10)                      | The object created should be marked as permanent. Permanent objects have an additional reference count that prevents them from dying even if all handles to them are closed                                                                      |
| `EXCLUSIVE`(0X20)                      | If creating an object, the object is created with exclusive access. No other handles can be opened to the object. If opening an object, exclusive access is requested, which is granted only if the object was originally created with this flag |
| `CASE_INSENSITIVE`(0X40)               | When opening an object, perform a case insensitive search for its name. Without this flag, the name must match exactly                                                                                                                           |
| `OPENIF`(0X80)                         | Open the object if it exists. Otherwise, fail the operation (don’t create a new object)                                                                                                                                                          |
| `OPENLINK`(0X100)                      | If the object to open is a symbolic link object, open the symbolic link object itself, rather than following the symbolic link to its target                                                                                                     |
| `KERNEL_HANDLE`(0X200)                 | The returned handle should be a kernel handle. Kernel handles are valid in any process context, and cannot be used by user mode code                                                                                                             |
| `FORCE_ACCESS_CHECK`(0X400)            | Access checks should be performed even if the object is opened in `KernelMode` access mode                                                                                                                                                       |
| `IGNORE_IMPERSONATED_DEVICEMAP`(0X800) | Use the process device map instead of the user’s if it’s impersonating (consult the documentation for more information on device maps)                                                                                                           |
| `DONT_REPARSE`(0X1000)                 | Don’t follow a reparse point, if encountered. Instead an error is returned (`STATUS_REPARSE_POINT_ENCOUNTERED`).                                                                                                                                 |

