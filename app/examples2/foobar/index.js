import html from './index.jade';

window.onload = () => {
  document.body.innerHTML = html();

  document.getElementById('target').innerHTML = 'hello!';
};
