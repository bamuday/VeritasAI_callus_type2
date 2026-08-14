VeritasAI Installation Guide

This guide explains how to install and run the Python backend dependencies from requirements.txt on macOS and Windows.

1. Prerequisites

Python 3.11 recommended

pip

Git (if cloning the project)

A terminal

Check Python:

macOS

python3 --version

Windows

python --version

Python 3.11 is recommended for the current VeritasAI backend.

2. Go to the Backend Directory

macOS

cd "/path/to/type2/backend"

Example:

cd "/Users/yourname/Desktop/callus hackthon/type2/backend"

Windows

cd "C:\path\to\type2\backend"

Example:

cd "C:\Users\YourName\Desktop\callus hackthon\type2\backend"

Make sure requirements.txt exists.

macOS:

ls

Windows:

dir

You should see:

requirements.txt
app/

3. Create a Virtual Environment

The project uses .venv.

macOS

python3.11 -m venv .venv

If python3.11 is unavailable:

python3 -m venv .venv

Activate:

source .venv/bin/activate

Windows PowerShell

py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1

If PowerShell blocks script execution:

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Then activate again:

.\.venv\Scripts\Activate.ps1

Windows Command Prompt

py -3.11 -m venv .venv
.venv\Scripts\activate.bat

4. Verify the Virtual Environment

Do this before installing packages.

macOS

which python
python -c "import sys; print(sys.executable)"

Expected path contains:

.../backend/.venv/bin/python

Windows PowerShell

where.exe python
python -c "import sys; print(sys.executable)"

Expected path contains:

backend\.venv\Scripts\python.exe

If Python points to the system installation instead of .venv, activate the environment again.

5. Upgrade pip

python -m pip install --upgrade pip

Using python -m pip is recommended because it ensures pip belongs to the selected Python environment.

6. Install requirements.txt

With .venv activated:

python -m pip install -r requirements.txt

The current backend requirements include packages such as:

fastapi==0.116.1
uvicorn==0.35.0
pydantic==2.11.7
torch==2.8.0
transformers==4.55.4
tokenizers==0.21.4

Do not manually change package versions unless you intentionally update the project requirements.

7. Verify PyTorch and Transformers

python -c "import torch; print('Torch:', torch.__version__)"

Expected:

Torch: 2.8.0

Then:

python -c "import transformers; print('Transformers:', transformers.__version__)"

Expected:

Transformers: 4.55.4

Or check both:

python -c "import torch, transformers; print('Torch:', torch.__version__); print('Transformers:', transformers.__version__)"

8. Verify the Backend

From the backend directory:

python -m py_compile app/analysis/pipeline.py

No output means compilation succeeded.

Then:

python test_pipeline.py

This should not produce:

ModuleNotFoundError: No module named 'torch'

9. Start the FastAPI Server

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

Expected:

INFO:     Started server process [...]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000

Keep this terminal open.

10. Test the Health Endpoint

Open another terminal and activate .venv again if necessary.

macOS

source .venv/bin/activate

Windows PowerShell

.\.venv\Scripts\Activate.ps1

Then:

curl http://127.0.0.1:8000/health

Expected:

{"status":"ok","service":"veritasai"}

11. Test the Analysis API

Create request.json in the backend directory:

{
  "essay": "I have always been fascinated by technology. When I was younger, I built small projects with whatever materials I could find. One experiment failed repeatedly, but the failure taught me to approach problems differently. Eventually, I learned that understanding why something breaks can be more valuable than simply making it work.",
  "model_id": "custom"
}

macOS

curl -s -X POST http://127.0.0.1:8000/api/analyze \
-H "Content-Type: application/json" \
--data-binary @request.json

Windows PowerShell

Invoke-RestMethod `
  -Uri "http://127.0.0.1:8000/api/analyze" `
  -Method Post `
  -ContentType "application/json" `
  -InFile "request.json"

The response should contain:

id
title
processedAt
rawText
wordCount
sentenceCount
reviewPriority
distribution
sentences
summaryMessage

12. Python Alias Problems on macOS

Sometimes .venv is activated but python is still aliased to the system Python.

Check:

which python
python -c "import sys; print(sys.executable)"

Both should point to .venv.

If an alias is overriding the environment:

unalias python
hash -r

Then:

which python
python -c "import sys; print(sys.executable)"

If necessary, bypass aliases completely:

.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

On Windows, use:

.\.venv\Scripts\python.exe -m pip install -r requirements.txt

and:

.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000

13. Do Not Confuse venv and .venv

The project uses:

.venv/

not:

venv/

Therefore this is incorrect if venv/ does not exist:

source venv/bin/activate

Use:

source .venv/bin/activate

Windows PowerShell:

.\.venv\Scripts\Activate.ps1

14. Port 8000 Already in Use

If Uvicorn reports:

ERROR: [Errno 48] error while attempting to bind on address
('127.0.0.1', 8000): address already in use

another process is already using port 8000.

macOS

Find it:

lsof -nP -iTCP:8000 -sTCP:LISTEN

Example:

python3    12345    ... TCP 127.0.0.1:8000

Kill the actual numeric PID:

kill -9 12345

Then verify:

lsof -nP -iTCP:8000 -sTCP:LISTEN

Do not type placeholders such as:

kill -9 PID1 PID2

unless those are actual numeric process IDs.

Windows

Find the process:

netstat -ano | findstr :8000

Then terminate the displayed PID:

taskkill /PID 12345 /F

15. Recreate the Virtual Environment

If .venv becomes corrupted, recreate it.

macOS

deactivate
rm -rf .venv
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

Windows PowerShell

deactivate
Remove-Item -Recurse -Force .venv
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

16. Normal Startup

macOS

cd "/path/to/type2/backend"
source .venv/bin/activate
python -c "import sys; print(sys.executable)"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

Windows PowerShell

cd "C:\path\to\type2\backend"
.\.venv\Scripts\Activate.ps1
python -c "import sys; print(sys.executable)"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

The Python executable must point to the project's .venv.

17. Quick Installation Checklist

Python 3.11 installed

Project downloaded/cloned

Terminal opened in backend/

.venv created

.venv activated

Python points to .venv

pip upgraded

requirements.txt installed

PyTorch imports successfully

Transformers imports successfully

pipeline.py compiles

test_pipeline.py passes

FastAPI server starts

/health returns status: ok

/api/analyze returns an analysis

Frontend communicates with port 8000

18. Troubleshooting No module named 'torch'

If you see:

ModuleNotFoundError: No module named 'torch'

do not immediately reinstall PyTorch.

First check:

which python
python -c "import sys; print(sys.executable)"

Then:

python -m pip show torch

The Python executable and pip installation must belong to the same .venv.

A correct macOS setup looks like:

.../backend/.venv/bin/python

and PyTorch should be installed under:

.../backend/.venv/lib/python3.11/site-packages/

This prevents the common problem where PyTorch is installed correctly but the shell runs a different system Python.