'use strict';

$('#singInForm').submit(function (e) {
  e.preventDefault();
  let url = '/signin';
  let username = $('#username1').val();

  let password = $('#password1').val();

  let header = new Headers();

  header.append('Accept', 'application/json');
  header.append('Content-Type', 'application/json');
  let encoded = window.btoa(`${username}:${password}`);
  let auth = `Basic ${encoded}`;
  header.append('Authorization', auth);

  let req = new Request(url, {
    method: 'POST',
    headers: header,
    credentials: 'include',
  });
  fetch(req).then(async response => {
    let userObject = await response.json();
    console.log(userObject);
    let token = userObject.token;
    document.cookie = `token=${token}`;

  });
});


const authorizeUrl = 'https://www.facebook.com/v10.0/dialog/oauth';
const options = {
   //'https://fb-outh-by-nour.herokuapp.com/facebookOauth'
  client_id: '855648615091740',
  // redirect_uri: 'http://localhost:3000/oauth',
  redirect_uri:'http://localhost:4222/oauth' ,
  state: 'some_random_string',
};

const queryString = Object.keys(options)
  .map((key) => {
    return `${key}=${encodeURIComponent(options[key])}`;
    // client_id=f99cc8c339968475c82d&scope=readEncodeColon&state=some_randome_string
  }).join('&');

console.log('query string: ', queryString);

const authUrl = `${authorizeUrl}?${queryString}`;
const a = document.getElementById('oauth');
a.setAttribute('href', authUrl); 