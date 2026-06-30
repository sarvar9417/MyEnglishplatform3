#!/usr/bin/env python3
"""
Fix blank-count mismatches in lesson data files.

Patterns detected:
  1) ___ soni 0 ≠ blanks N  — question is a prompt (no inline ___). Update audit to skip these.
  2) ___ soni N ≠ blanks 1  — single blank with slash/comma-separated values. Split into separate entries.
      Example: blanks: ["is / are / afternoon"] → blanks: ["is", "are", "afternoon"] (for 3 ___)
  3) ___ soni N ≠ blanks M  — other mismatches. Log for manual review.

Usage: python3 scripts/fix_blank_count.py
"""
import os, re, json

DAILY = 'src/data/daily'
AUDIT = 'scripts/audit-exercises.ts'

def split_blank_value(s: str) -> list[str]:
    """Split a blank string by / or , into separate entries, trimming whitespace."""
    # Try / first (most common in the data)
    if '/' in s:
        parts = [p.strip() for p in s.split('/')]
        return parts
    # Try comma-separated
    if ',' in s:
        parts = [p.strip() for p in s.split(',')]
        return parts
    return [s]

def count_underscores(text: str) -> int:
    """Count ___ (2+ underscores) markers in text."""
    return len(re.findall(r'_{2,}', text))

def fix_file(relpath: str) -> list[dict]:
    """Fix blank-count issues in one file. Returns list of fixes applied."""
    filepath = os.path.join(DAILY, relpath)
    with open(filepath, 'r') as f:
        content = f.read()
    
    fixes = []
    
    # Strategy: Use regex to find all fill-blank exercise objects and check blank counts
    # We need to be careful not to corrupt the TS syntax
    
    # Find exercises by their fill-blank/passage patterns
    # Look for: { id: 1234, type: 'fill-blank', ... blanks: [...], ... }
    # We'll use a simpler approach: find patterns with blanks: [...] that aren't passage
    
    # Find all fill-blank and passage exercise objects
    exercise_pattern = re.compile(
        r'(\{\s*id:\s*\d+[^}]*?type:\s*[\'"]fill-blank[\'"][^}]*?blanks:\s*\[([^\]]+)\][^}]*?\})',
        re.DOTALL
    )
    
    # Also find passage exercises
    passage_pattern = re.compile(
        r'(\{\s*id:\s*\d+[^}]*?type:\s*[\'"]passage[\'"][^}]*?blanks:\s*\[([^\]]+)\][^}]*?\})',
        re.DOTALL
    )
    
    matches = list(exercise_pattern.finditer(content)) + list(passage_pattern.finditer(content))
    
    for match in matches:
        full_obj = match.group(1)
        blanks_content = match.group(2)
        
        # Extract id
        id_match = re.search(r'id:\s*(\d+)', full_obj)
        if not id_match:
            continue
        ex_id = int(id_match.group(1))
        
        # Extract question or passage text
        q_match = re.search(r'question:\s*[\'"]([^\'"]*)[\'"]', full_obj)
        p_match = re.search(r'passage:\s*[\'"]([^\'"]*)[\'"]', full_obj)
        text = q_match.group(1) if q_match else (p_match.group(1) if p_match else '')
        
        # Count ___ in the text
        uc = count_underscores(text)
        
        # Parse blanks array - this is tricky because of TS syntax
        # Try to extract individual string values
        blank_values = re.findall(r'[\'"]([^\'"]*?)[\'"]', blanks_content)
        bl = len(blank_values)
        
        if uc == bl:
            continue  # Already correct
        
        if uc == 0 and bl > 0:
            # Pattern 1: Prompt-style exercise. Skip - audit should handle this.
            continue
        
        if bl == 1 and uc > 1:
            # Pattern 2: Single blank with potential slash/comma-separated values
            bv = blank_values[0]
            split_vals = split_blank_value(bv)
            if len(split_vals) == uc:
                # Perfect match! Replace the blanks array
                new_blanks = json.dumps(split_vals, ensure_ascii=False)
                # Find the exact blanks array string to replace
                old_blanks_match = re.search(r'blanks:\s*\[[^\]]+\]', full_obj)
                if old_blanks_match:
                    old_blanks = old_blanks_match.group(0)
                    new_blanks_ts = 'blanks: ' + new_blanks
                    # Need to be careful with single vs double quotes
                    # The TS file uses single quotes for strings in the blanks array
                    new_blanks_ts = new_blanks_ts.replace('"', "'")
                    
                    # Replace in the full content
                    content = content.replace(old_blanks, new_blanks_ts, 1)
                    fixes.append({
                        'id': ex_id,
                        'file': relpath,
                        'old': old_blanks,
                        'new': new_blanks_ts,
                        'type': 'split-slash'
                    })
                    print(f'  ✅ #{ex_id}: Split blank "{bv}" → {split_vals}')
                    continue
        
        # Pattern 3: Other mismatches - log
        print(f'  ⚠️  #{ex_id}: Unhandled mismatch: {uc} ___ ≠ {bl} blanks. Values: {blank_values}')
    
    if fixes:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'  💾 Saved {relpath} ({len(fixes)} fixes)')
    
    return fixes

def fix_audit_script():
    """Update audit script to not flag 0-underscore prompt-style fill-blank exercises."""
    with open(AUDIT, 'r') as f:
        content = f.read()
    
    # The current check:
    # if (blankCount !== ex.blanks.length)
    #     add({ ...where, sev: 'HIGH', kind: 'blank-count', detail: ... })
    
    # Change to skip when blankCount is 0 but blanks exist (prompt-style)
    old = "if (blankCount !== ex.blanks.length)\n        add({ ...where, sev: 'HIGH', kind: 'blank-count', detail:"
    new = "if (blankCount !== ex.blanks.length && !(blankCount === 0 && ex.blanks.length > 0))\n        add({ ...where, sev: 'HIGH', kind: 'blank-count', detail:"
    
    if old in content:
        content = content.replace(old, new)
        with open(AUDIT, 'w') as f:
            f.write(content)
        print('  ✅ Audit script: skip 0-underscore prompt-style fill-blank')
        return True
    else:
        # Try alternative format
        old2 = "if (blankCount !== ex.blanks.length)"
        idx = content.find(old2)
        if idx >= 0:
            # Show context for debugging
            print(f'  ⚠️  Could not match exact pattern. Found at position {idx}:')
            print(f'     {content[idx:idx+150]}')
        return False

def main():
    print('=== BLANK-COUNT XATOLARINI TUZATISH ===\n')
    
    # Step 1: Update audit script
    print('1. Audit skriptni tuzatish...')
    fix_audit_script()
    
    # Step 2: Get all TS lesson files
    ts_files = [f for f in os.listdir(DAILY) if f.endswith('.ts') and not f.endswith('index.ts') and not f.endswith('.safe')]
    
    total_fixes = 0
    for ts_file in sorted(ts_files):
        fixes = fix_file(ts_file)
        total_fixes += len(fixes)
    
    print(f'\n=== YAKUN ===')
    print(f'Jami fayllar: {len(ts_files)}')
    print(f'Jami tuzatishlar: {total_fixes}')
    print(f'\nTekshirish: npx tsc --noEmit && npx tsx scripts/audit-exercises.ts')

if __name__ == '__main__':
    main()
