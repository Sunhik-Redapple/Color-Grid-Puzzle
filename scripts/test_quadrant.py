import sys
sys.path.append('scripts')
from validator import verify_solution
from auto_designer import check_no_joker_leak

# Test Region Concept
# Quadrants:
# Q1: r: 0..2, c: 0..2
# Q2: r: 0..2, c: 3..5
# Q3: r: 3..5, c: 0..2
# Q4: r: 3..5, c: 3..5

print("Quadrant layout verification module ready")
