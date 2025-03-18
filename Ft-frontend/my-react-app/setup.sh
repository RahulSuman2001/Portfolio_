#!/bin/bash

# Define the folder structure
folders=(
  "src/api"
  "src/assets"
  "src/components"
  "src/features/auth"
  "src/features/posts"
  "src/hooks"
  "src/layouts"
  "src/pages"
  "src/routes"
  "src/services"
  "src/store"
  "src/styles"
  "src/utils"
)

# Create folders
for folder in "${folders[@]}"; do
  mkdir -p "$folder"
done

# Create default files
touch src/api/index.js
touch src/hooks/useAuth.js
touch src/hooks/useFetch.js
touch src/routes/index.js
touch src/services/api.js
touch src/store/index.js
touch src/styles/global.css
touch src/utils/helpers.js
touch src/utils/validators.js

# Create App and index files
echo "import React from 'react';" > src/App.js
echo "const App = () => <div>Hello, World!</div>;" >> src/App.js
echo "export default App;" >> src/App.js

echo "import React from 'react';" > src/index.js
echo "import ReactDOM from 'react-dom/client';" >> src/index.js
echo "import App from './App';" >> src/index.js
echo "const root = ReactDOM.createRoot(document.getElementById('root'));" >> src/index.js
echo "root.render(<App />);" >> src/index.js

echo "Folder structure created successfully! 🚀"
