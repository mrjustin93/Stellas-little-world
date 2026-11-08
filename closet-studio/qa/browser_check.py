"""Run the current walkable-character browser checks."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name('mobile_check.py')),run_name='__main__')
