//IMPORT
import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';
import { SharedArray } from 'k6/data';

//POBRANIE PLIKU CSV
const podatki = new SharedArray('Podatki', function() {
  return open('csvv.csv').split('\n').slice(1);
});

//DANE LOG, URL
const username = "platforma";
const password = "platforma99";
const portalUrl = "https://test.pm.bydgoszcz.pl";

export const options = {
  vus: 1,
  duration: '1s',
};

//DOSTĘP - HASŁO LOGIN, AUTORYZACJA, B64ENCODE
export function setup() {
  const credentials = `${username}:${password}`;
  const encodedCredentials = encoding.b64encode(credentials);

  const params = {
    headers: {
        'Authorization': `Basic ${encodedCredentials}`
    }
  };

  let res = http.get(portalUrl, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  }

//STATUS
function sendRequests(taxes) {
  const url = 'https://test.pm.bydgoszcz.pl';
  for (const tax of taxes) {
    const response = http.get(url, { params: { query: tax } });
    check(response, {
      'status is 200': (r) => r.status === 200,
    });
  }
}

//WYWOŁANIE ILU WIERSZY (1, 3, 10)
export default function () {
  const n = parseInt(__ENV.NUM_TAXES) || 1; 
  if (![1, 3, 10].includes(n)) {
    console.error('1, 3, 10');
    return;
  }

  sleep(1);
}
