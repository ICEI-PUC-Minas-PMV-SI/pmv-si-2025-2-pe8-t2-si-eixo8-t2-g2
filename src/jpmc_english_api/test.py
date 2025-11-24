
# Online Python - IDE, Editor, Compiler, Interpreter
from datetime import datetime
from zoneinfo import ZoneInfo

date = datetime.fromisoformat("2025-11-25 12:00:00")
date = date.astimezone(ZoneInfo("America/Sao_Paulo"))
print(date)
