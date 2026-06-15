# -*- coding: utf-8 -*-
"""Fix unescaped double quotes in interleaved practice exercises."""

import re

files = [
    'src/data/daily/a2Part2.ts',
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Find all interleaved practice sections
    pattern = r'(// Interleaved Practice:.*?)(?=\n// Interleaved Practice:|\n\nexport const|\Z)'
    
    def fix_quotes(match):
        section = match.group(0)
        # Replace straight double quotes inside questions with curly quotes
        # These are in strings like: "She said: "I like coffee." she said"
        # We need to be careful to only fix quotes that are INSIDE string values
        
        # Strategy: find lines with question: "..." and fix internal quotes
        lines = section.split('\n')
        fixed_lines = []
        for line in lines:
            # Fix specific known patterns
            if 'She said: \\"I like coffee.\\"' in line:
                line = line.replace('She said: \\"I like coffee.\\"', 'She said: \u201cI like coffee.\u201d')
            if 'He said: \\"I will come.\\"' in line:
                line = line.replace('He said: \\"I will come.\\"', 'He said: \u201cI will come.\u201d')
            if 'He said: \\"Sit down!\\"' in line:
                line = line.replace('He said: \\"Sit down!\\"', 'He said: \u201cSit down!\u201d')
            if '\\"I have finished my homework,\\" she said.' in line:
                line = line.replace('\\"I have finished my homework,\\" she said.', '\u201cI have finished my homework,\u201d she said.')
            fixed_lines.append(line)
        
        return '\n'.join(fixed_lines)
    
    content = re.sub(pattern, fix_quotes, content, flags=re.DOTALL)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed: {filepath}')
    else:
        print(f'No changes: {filepath}')
