import {Game} from './js/game.js';
try{const game=new Game();if(new URLSearchParams(location.search).has('test'))window.__game=game;}catch(error){console.error(error);document.querySelector('#welcome').innerHTML='<div class="welcome-card"><h2>A little pause</h2><p>The cabin could not load. Please reload in a modern browser, using an HTTP or HTTPS address.</p></div>';}
