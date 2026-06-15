# -*- coding: utf-8 -*-
"""Fix unescaped double quotes in all interleaved practice sections across A2 and B2 files."""

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
        lines = f.readlines()
    
    modified = False
    new_lines = []
    in_interleaved = False
    
    for line in lines:
        # Track if we're inside an interleaved practice section
        if 'Interleaved Practice:' in line:
            in_interleaved = True
        elif line.strip().startswith('export const ') and ': DailyLesson' in line:
            in_interleaved = False
        
        if in_interleaved:
            # Fix: replace " inside string values with curly quotes
            # Pattern: explanation: "..." where ... contains "
            # We need to find and fix these
            
            # Check if line has a string value with unescaped " inside it
            # Strategy: replace specific known patterns
            new_line = line
            
            # Replace straight double quotes that appear inside explanation/instruction/question/correct strings
            # with curly/smart quotes to avoid breaking the string delimiter
            if 'explanation: "' in line or 'instruction: "' in line or 'question: "' in line or 'correct: "' in line:
                # Count the number of " in the line
                quote_count = new_line.count('"')
                if quote_count > 2:
                    # There are unescaped quotes inside the string
                    # Smart fix: replace the opening and closing quotes with different chars
                    # Actually, let's just escape internal quotes
                    pass  # handled below
            
            # Simple approach: for lines with explanation/question containing " inside,
            # use sed-like replacement of specific patterns
            if '"Can swim"' in new_line:
                new_line = new_line.replace('"Can swim"', '\u201cCan swim\u201d')
            if '"Swim every weekend"' in new_line:
                new_line = new_line.replace('"Swim every weekend"', '\u201cSwim every weekend\u201d')
            if '"A dog"' in new_line:
                new_line = new_line.replace('"A dog"', '\u201cA dog\u201d')
            if '"The dog"' in new_line:
                new_line = new_line.replace('"The dog"', '\u201cThe dog\u201d')
            if '"Music" = general' in new_line:
                new_line = new_line.replace('"Music" = general', '\u201cMusic\u201d = general')
            if '"A guitar"' in new_line:
                new_line = new_line.replace('"A guitar"', '\u201cA guitar\u201d')
            if '"Honest"' in new_line:
                new_line = new_line.replace('"Honest"', '\u201cHonest\u201d')
            if '"In 1999"' in new_line:
                new_line = new_line.replace('"In 1999"', '\u201cIn 1999\u201d')
            if '"in Tashkent"' in new_line:
                new_line = new_line.replace('"in Tashkent"', '\u201cin Tashkent\u201d')
            if '"on Monday"' in new_line:
                new_line = new_line.replace('"on Monday"', '\u201con Monday\u201d')
            if '"Depend on"' in new_line:
                new_line = new_line.replace('"Depend on"', '\u201cDepend on\u201d')
            if '"Wait for"' in new_line:
                new_line = new_line.replace('"Wait for"', '\u201cWait for\u201d')
            if '"Do you like"' in new_line:
                new_line = new_line.replace('"Do you like"', '\u201cDo you like\u201d')
            if '"What do you like"' in new_line:
                new_line = new_line.replace('"What do you like"', '\u201cWhat do you like\u201d')
            if '"It is necessary"' in new_line:
                new_line = new_line.replace('"It is necessary"', '\u201cIt is necessary\u201d')
            if '"must"' in new_line:
                new_line = new_line.replace('"must"', '\u201cmust\u201d')
            
            if new_line != line:
                modified = True
            
            new_lines.append(new_line)
        else:
            new_lines.append(line)
    
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f'Fixed: {filepath}')
    else:
        print(f'No changes: {filepath}')
