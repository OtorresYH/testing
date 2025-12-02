#!/bin/bash

echo "🔍 Whitmore PAYMENTS - Deployment Verification"
echo "================================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  Node.js: $NODE_VERSION"
else
    echo "  ❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "  npm: $NPM_VERSION"
else
    echo "  ❌ npm not found."
    exit 1
fi

# Check package.json
echo "✓ Checking package.json..."
if [ -f "package.json" ]; then
    echo "  ✓ package.json found"
else
    echo "  ❌ package.json not found"
    exit 1
fi

# Check node_modules
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✓ node_modules exists"
else
    echo "  ℹ node_modules not found. Run: npm install"
fi

# Check .env file
echo "✓ Checking environment variables..."
if [ -f ".env" ]; then
    echo "  ✓ .env file found"
    if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo "  ✓ Environment variables configured"
    else
        echo "  ❌ Missing environment variables in .env"
        exit 1
    fi
else
    echo "  ❌ .env file not found"
    exit 1
fi

# Check entry point
echo "✓ Checking entry point..."
if [ -f "index.html" ] && [ -f "src/main.tsx" ]; then
    echo "  ✓ Entry points found (index.html, src/main.tsx)"
else
    echo "  ❌ Entry points missing"
    exit 1
fi

# Check key source files
echo "✓ Checking source files..."
if [ -f "src/App.tsx" ] && [ -d "src/components" ]; then
    echo "  ✓ Source files found"
else
    echo "  ❌ Source files missing"
    exit 1
fi

echo ""
echo "================================================"
echo "✅ All checks passed! Ready to deploy."
echo ""
echo "Next steps:"
echo "  1. Run: npm install"
echo "  2. Run: npm run dev"
echo "  3. Open: http://localhost:5173"
echo "  4. Deploy: vercel"
echo ""
echo "See QUICKSTART.md for detailed instructions."
