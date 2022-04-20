// ==UserScript==
// @name         Market Buttons
// @namespace    https://greasyfork.org/users/904482
// @version      0.1.0
// @description  Venta rapida en el mercado
// @author       lpachecob
// @grant        none
// @include      *s*-*.gladiatus.gameforge.com/game/index.php?mod=guildMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @license MIT
// ==/UserScript==
 
var panelVenta=document.getElementById("sellForm");
var inputPrecio = document.getElementById("preis");
var botonVender = document.getElementsByName("anbieten")[0];
 
panelVenta.insertAdjacentHTML('beforebegin', '<h2 id="VentaRapidaMenuTitle" class="section-header" style="cursor: pointer;">Venta Rapida</h2><section id="VentaRapidaMenu" style="display: block;"></section>');
 
var ventaRapidaMenu = document.getElementById("VentaRapidaMenu");
 
ventaRapidaMenu.insertAdjacentHTML('beforeend', '<p>Coloca un item y elige el precio para vender.</p>');
ventaRapidaMenu.insertAdjacentHTML('beforeend', '<button id="buttonAdd50k" class="awesome-button" style="margin:5px;">50k</button>');
ventaRapidaMenu.insertAdjacentHTML('beforeend', '<button id="buttonAdd100k" class="awesome-button" style="margin:5px;">100k</button>');
ventaRapidaMenu.insertAdjacentHTML('beforeend', '<button id="buttonAdd200k" class="awesome-button" style="margin:5px;">200k</button>');
ventaRapidaMenu.insertAdjacentHTML('beforeend', '<button id="buttonAdd500k" class="awesome-button" style="margin:5px;">500k</button>');
ventaRapidaMenu.insertAdjacentHTML('beforeend', '<button id="buttonAdd1kk" class="awesome-button" style="margin:5px;">1kk</button>');
 
var ventaRapidaMenuTitle = document.getElementById("VentaRapidaMenuTitle");
ventaRapidaMenuTitle.addEventListener("click", ()=>{
    if(ventaRapidaMenu.style.display == "none"){
        ventaRapidaMenu.style.display="block";
    }else{
        ventaRapidaMenu.style.display="none";
    }
});
 
var add50k = document.getElementById("buttonAdd50k");
add50k.addEventListener("click", ()=>{
    inputPrecio.value=50000;
    botonVender.click();
});
var add100k = document.getElementById("buttonAdd100k");
add100k.addEventListener("click", ()=>{
    inputPrecio.value=100000;
    botonVender.click();
});
var add200k = document.getElementById("buttonAdd200k");
add200k.addEventListener("click", ()=>{
    inputPrecio.value=200000;
    botonVender.click();
});
var add500k = document.getElementById("buttonAdd500k");
add500k.addEventListener("click", ()=>{
    inputPrecio.value=500000;
    botonVender.click();
});
var add1kk = document.getElementById("buttonAdd1kk");
add1kk.addEventListener("click", ()=>{
    inputPrecio.value=1000000;
    botonVender.click();
});