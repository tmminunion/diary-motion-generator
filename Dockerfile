FROM node:20-bookworm-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

# Install system dependencies required by Headless Chrome, FFmpeg, Python 3, and fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    chromium \
    fonts-dejavu-core \
    fonts-noto-color-emoji \
    fonts-freefont-ttf \
    libnss3 \
    libdbus-1-3 \
    libatk1.0-0 \
    libgbm-dev \
    libasound2 \
    libxrandr2 \
    libxkbcommon-dev \
    libxfixes3 \
    libxcomposite1 \
    libxdamage1 \
    libatk-bridge2.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libcups2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Install Node.js dependencies
COPY package.json tsconfig.json ./
RUN npm install

# Download & ensure Remotion compatible headless browser inside the container image
RUN npx remotion browser ensure

# Copy source code and application files
COPY . .

# Pre-bundle Remotion composition so renders start instantly with 0 compile latency!
RUN npx remotion bundle src/remotion/entry.tsx remotion-bundle

# Ensure runtime directories exist
RUN mkdir -p out data

# Expose Cloud Run port
EXPOSE 8080

CMD ["python3", "server.py"]
