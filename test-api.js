const http = require('http');

// Test if the server is responding
http.get('http://localhost:4848/api/auth/session', (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Session endpoint response received');
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
