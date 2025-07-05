// Utilidad para probar diferentes formatos de petición al backend

export const testLoginFormats = async (username, password) => {
  const baseUrl = 'http://localhost:8000/login';
  const results = {};

  // Test 1: Form Data (como espera FastAPI por defecto)
  try {
    console.log('=== Test 1: Form Data ===');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response1 = await fetch(baseUrl, {
      method: 'POST',
      body: formData
    });
    
    results.formData = {
      status: response1.status,
      ok: response1.ok,
      body: await response1.text()
    };
    console.log('Form Data Result:', results.formData);
  } catch (error) {
    results.formData = { error: error.message };
    console.log('Form Data Error:', error.message);
  }

  // Test 2: JSON
  try {
    console.log('=== Test 2: JSON ===');
    const response2 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    results.json = {
      status: response2.status,
      ok: response2.ok,
      body: await response2.text()
    };
    console.log('JSON Result:', results.json);
  } catch (error) {
    results.json = { error: error.message };
    console.log('JSON Error:', error.message);
  }

  // Test 3: URL Encoded
  try {
    console.log('=== Test 3: URL Encoded ===');
    const urlEncoded = new URLSearchParams();
    urlEncoded.append('username', username);
    urlEncoded.append('password', password);
    
    const response3 = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncoded
    });
    
    results.urlEncoded = {
      status: response3.status,
      ok: response3.ok,
      body: await response3.text()
    };
    console.log('URL Encoded Result:', results.urlEncoded);
  } catch (error) {
    results.urlEncoded = { error: error.message };
    console.log('URL Encoded Error:', error.message);
  }

  return results;
};

 