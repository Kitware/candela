import html from './index.jade';
import examples from './index.json';

window.onload = () => {
  document.body.innerHTML = html({examples});
}
