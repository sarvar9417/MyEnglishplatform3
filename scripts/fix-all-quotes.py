# -*- coding: utf-8 -*-
"""Comprehensively fix all unescaped double quotes in interleaved practice sections."""

import re

files = [
    'src/data/daily/a2Part1.ts',
    'src/data/daily/a2Part2.ts',
    'src/data/daily/a2Part3.ts',
    'src/data/daily/a2Part4.ts',
    'src/data/daily/b2Part1.ts',
    'src/data/daily/b2Part2.ts',
    'src/data/daily/b2Part3.ts',
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Function to fix a string value by replacing internal " with \u201c/\u201d
    def fix_string_value(match):
        full = match.group(0)
        prefix = match.group(1)  # e.g. 'explanation: "'
        value = match.group(2)   # the content between first and last "
        suffix = match.group(3)  # the closing "
        
        # Replace " inside the value with curly quotes
        # We need to alternate between opening and closing curly quotes
        fixed = ''
        open_quote = True
        for ch in value:
            if ch == '"':
                if open_quote:
                    fixed += '\u201c'
                else:
                    fixed += '\u201d'
                open_quote = not open_quote
            else:
                fixed += ch
        
        return prefix + fixed + suffix
    
    # Match patterns like: explanation: "some text with "internal" quotes"
    # The regex captures: (explanation: ") (content) (")
    # We need to be careful to match the right number of quotes
    # Pattern: key: "value" where value may contain ""
    
    # Fix explanation, question, instruction, correct, desc fields
    for key in ['explanation', 'question', 'instruction', 'correct', 'desc']:
        # Match: key: "..." where ... may contain "
        pattern = re.compile(
            r'(' + re.escape(key) + r': )"((?:[^"\\]|\\.)*)"',
            re.DOTALL
        )
        
        # Find all matches and fix those with internal unescaped quotes
        new_content = ''
        last_end = 0
        for m in pattern.finditer(content):
            start = m.start()
            end = m.end()
            new_content += content[last_end:start]
            
            prefix = m.group(1)
            value = m.group(2)
            
            # Check if value contains unescaped " 
            # (i.e., not preceded by \)
            if '"' in value:
                # Fix internal quotes
                fixed_value = ''
                i = 0
                open_quote = True
                while i < len(value):
                    if value[i] == '\\' and i + 1 < len(value):
                        # Keep escaped sequences
                        fixed_value += value[i:i+2]
                        i += 2
                    elif value[i] == '"':
                        if open_quote:
                            fixed_value += '\u201c'
                        else:
                            fixed_value += '\u201d'
                        open_quote = not open_quote
                        i += 1
                    else:
                        fixed_value += value[i]
                        i += 1
                new_content += prefix + '"' + fixed_value + '"'
            else:
                new_content += m.group(0)
            
            last_end = end
        
        if last_end > 0:
            new_content += content[last_end:]
            content = new_content
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed: {filepath}')
    else:
        print(f'No changes needed: {filepath}')
