<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>

  <h1>AI Agent API</h1>

  <p>
    This project demonstrates how to use JavaScript to build a simple AI agent
    that can call external APIs and display results in an HTML page.
  </p>

  <h2>Project Structure</h2>
  <ul>
    <li><code>index.html</code> - Main user interface</li>
    <li><code>script.js</code> - JavaScript logic and API handling</li>
    <li><code>README.html</code> - Project documentation</li>
  </ul>

  <h2>Features</h2>
  <ul>
    <li>Call public APIs using <code>fetch()</code></li>
    <li>Basic AI agent decision logic</li>
    <li>Display API responses in the browser</li>
    <li>Example integration with an AI API</li>
  </ul>

  <h2>How to Run</h2>
  <ol>
    <li>Download or clone the repository</li>
    <li>Open <code>index.html</code> in your browser</li>
    <li>Click the buttons to trigger API calls</li>
  </ol>

  <h2>Using AI API</h2>
  <p>
    To use the AI feature, open <code>script.js</code> and replace:
  </p>

  <pre>
Authorization: "Bearer YOUR_API_KEY"
  </pre>

  <p>
    with your actual API key.
  </p>

  <h3>Important</h3>
  <ul>
    <li>Do not expose API keys in frontend code in production</li>
    <li>Use a backend server for secure API calls</li>
  </ul>

  <h2>Example API Used</h2>
  <ul>
    <li>https://jsonplaceholder.typicode.com/</li>
  </ul>

  <h2>Git Setup</h2>
  <pre>
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
  </pre>

  <h2>Future Improvements</h2>
  <ul>
    <li>Add backend (Node.js)</li>
    <li>Improve UI (React or Vue)</li>
    <li>Add multi-step AI agent logic</li>
  </ul>

</body>
</html>
