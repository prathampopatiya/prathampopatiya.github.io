---
title: "Introduction to Ghidra Scripting with Python"
date: "2026-05-05"
excerpt: "Learn how to automate reverse engineering tasks using Ghidra's Python scripting capabilities."
tags: ["reverse-engineering", "ghidra", "python", "automation"]
author: "Security Researcher"
---

# Introduction to Ghidra Scripting with Python

Ghidra's scripting capabilities allow us to automate repetitive reverse engineering tasks. In this post, we'll explore the basics of Ghidra scripting using Python (Jython).

## Getting Started

Scripts can be accessed via `Window > Script Manager` or by pressing `Alt+F11`.

## Basic Script Structure

```python
# Basic Ghidra script template
#@category Analysis
#@author Security Researcher

from ghidra.program.model.symbol import SymbolType
from ghidra.program.model.listing import Function

def run():
    # Get current program
    program = currentProgram
    listing = program.getListing()
    
    # Iterate through functions
    functions = listing.getFunctions(True)
    for func in functions:
        print("Function: {} at {}".format(
            func.getName(), 
            func.getEntryPoint()
        ))

run()
```

## Useful APIs

### Finding Cross-References

```python
def find_xrefs(address):
    """Find all references to an address"""
    refs = getReferencesTo(address)
    for ref in refs:
        print("Reference from: {}".format(ref.getFromAddress()))
```

### Renaming Functions

```python
def rename_function(old_name, new_name):
    """Rename a function by name"""
    func = getFunction(old_name)
    if func:
        func.setName(new_name, SourceType.USER_DEFINED)
        print("Renamed {} to {}".format(old_name, new_name))
```

### Searching for Strings

```python
def find_strings_containing(pattern):
    """Find all strings containing a pattern"""
    strings = currentProgram.getListing().getDefinedData(True)
    for data in strings:
        if data.hasStringValue():
            value = data.getValue()
            if pattern.lower() in str(value).lower():
                print("{}: {}".format(data.getAddress(), value))
```

## Practical Example: API Call Extraction

```python
#@category Malware
#@description Extract Windows API calls

from ghidra.program.model.symbol import SymbolType

def extract_api_calls():
    """Extract all imported API calls"""
    symbol_table = currentProgram.getSymbolTable()
    external_symbols = symbol_table.getExternalSymbols()
    
    api_calls = []
    for symbol in external_symbols:
        if symbol.getSymbolType() == SymbolType.FUNCTION:
            api_calls.append(symbol.getName())
    
    # Print sorted API calls
    for api in sorted(set(api_calls)):
        print(api)
    
    print("\nTotal unique APIs: {}".format(len(set(api_calls))))

extract_api_calls()
```

## Tips

1. **Use the Script Manager** - Browse existing scripts for examples
2. **Check the API docs** - `Help > Ghidra API Help`
3. **Use `askChoice()`** - For interactive scripts
4. **Transaction handling** - Wrap changes in transactions

## Conclusion

Ghidra scripting is powerful for automating analysis tasks. Start with simple scripts and gradually build more complex automation.

Check out the [Ghidra API documentation](https://ghidra.re/ghidra_docs/api/) for more details.
