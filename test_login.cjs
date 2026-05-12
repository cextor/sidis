const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@admin.com',
      password: 'password'
    });
    console.log('Login with password "password" SUCCESS:', res.data);
  } catch (err) {
    console.log('Login with password "password" FAILED:', err.response ? err.response.status : err.message);
  }

  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@admin.com',
      password: '123456'
    });
    console.log('Login with password "123456" SUCCESS:', res.data);
  } catch (err) {
    console.log('Login with password "123456" FAILED:', err.response ? err.response.status : err.message);
  }
}

testLogin();
