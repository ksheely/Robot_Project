.PHONY: help setup install run debug prod test lint format clean help-db start-db end-db

# Default target
help:
	@echo "FastAPI Development Commands"
	@echo "============================"
	@echo ""
	@echo "make setup      	Install all dependencies (first time setup)"
	@echo "make install    	Install Python dependencies"
	@echo "make run        	Run development server (http://127.0.0.1:5173)"
	@echo "make debug      	Run with debug logging enabled"
	@echo "make prod       	Run production server with multiple workers"
	@echo "make test       	Run pytest tests"
	@echo "make lint       	Lint code with flake8 and black"
	@echo "make format     	Format code with Black"
	@echo "make clean      	Remove Python cache files"
	@echo "make start-db		Start the database container"
	@echo "make end-db			Stop the database container"
	@echo ""

setup:
	@echo "🛠️  FastAPI Project Setup"
	@python --version
	@python -m venv .venv
	@pip install -r requirements.txt
	@echo "✅ Setup complete!"

install:
	@echo "🔧 Installing Python dependencies..."
	@pip install -r requirements.txt
	@echo "✅ Dependencies installed successfully!"

run:
	@echo "🚀 Starting FastAPI development server..."
	@echo "📍 http://127.0.0.1:8000"
	@echo "📚 API Docs: http://127.0.0.1:8000/docs"
	@echo ""
	uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload

debug:
	@echo "🐛 Starting FastAPI in DEBUG mode..."
	@echo "📍 http://127.0.0.1:8000"
	@echo "📚 API Docs: http://127.0.0.1:8000/docs"
	@echo ""
	PYTHONUNBUFFERED=1 uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload --log-level debug

prod:
	@echo "🚀 Starting FastAPI production server..."
	@echo "📍 http://0.0.0.0:8000"
	@which gunicorn > /dev/null && \
		gunicorn api.main:app \
			--workers 4 \
			--worker-class uvicorn.workers.UvicornWorker \
			--bind 0.0.0.0:8000 \
			--access-logfile - \
			--error-logfile - || \
		uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4

test:
	@echo "🧪 Running tests..."
	@python -m pip show pytest > /dev/null || pip install pytest pytest-asyncio httpx
	@if [ -d "tests" ]; then \
		pytest tests/ -v --tb=short; \
	else \
		echo "ℹ️  No tests directory found. Create tests/ directory with test files."; \
	fi

lint:
	@echo "🔍 Linting Python code..."
	@python -m pip show flake8 > /dev/null || pip install flake8 black
	@flake8 api/ --max-line-length=100 --exclude=__pycache__
	@echo ""
	@echo "✨ Checking code formatting with black..."
	@black --check api/ 2>/dev/null || echo "📝 Run 'make format' to fix formatting"
	@echo "✅ Linting complete!"

format:
	@echo "✨ Formatting Python code with Black..."
	@python -m pip show black > /dev/null || pip install black
	@black api/
	@echo "✅ Code formatted successfully!"

clean:
	@echo "🗑️  Cleaning up Python cache files..."
	@find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete
	@find . -type f -name "*.pyo" -delete
	@echo "✅ Clean complete!"

# Default target
help-db:
	@echo "Docker Commands"
	@echo "============================"
	@echo ""
	@echo "make run        Run the container"
	@echo "make end        Stop the container"
	@echo ""
	
start-db:
	docker compose up -d

end-db:
	docker compose down

update-db:
	docker compose pull
 