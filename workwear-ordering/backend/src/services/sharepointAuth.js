const axios = require('axios');
const qs = require('qs');
const config = require('../config/sharepoint');

let cachedToken = null;
let tokenExpiresAt = 0;

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
  const data = qs.stringify({
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: 'https://graph.microsoft.com/.default',
  });

  const response = await axios.post(url, data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  cachedToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000;
  return cachedToken;
}

async function graphRequest(method, path, body = null) {
  const token = await getToken();
  const url = `${config.graphBase}${path}`;
  const options = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) options.data = body;
  const response = await axios(options);
  return response.data;
}

module.exports = { getToken, graphRequest };
