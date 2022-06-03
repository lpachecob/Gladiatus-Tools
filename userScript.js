// ==UserScript==
// @name          Gladiatus Tools
// @namespace     https://greasyfork.org/users/904482
// @version       0.2.2
// @description   Set of tools and aids for the game Gladiatus
// @author        lpachecob
// @grant         none
// @match         *.gladiatus.gameforge.com/game/index.php*
// @icon          https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/images/favicon.ico
// @license       MIT

// @resource      https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/styles.css
// ==/UserScript==


//global variables
const getURL = window.location.search.split("&");
const oro = parseInt(document.getElementById("sstat_gold_val").innerText.replace(/\./g, ''));

var dobleClickEvent = document.createEvent('MouseEvents');
dobleClickEvent.initEvent('dblclick', true, true);

let sh;
for (let element of getURL) {
    if(element.includes("sh") == true){
        sh = element
    }
}

class GladiatusTools{
    static SetTool(){
        const mainMenu = document.getElementById("mainmenu");
        if (getURL[0] == "?mod=guildMarket" &&	getURL[1] != "submod=control") {
            Mercado.Run();
        } else if (getURL[0] == "?mod=guildMarket" && getURL[1] == "submod=control") {
            //comming soon
        } else if (getURL[0] == "?mod=auction") {
            AcutionHouseTools();
        } else if (getURL[0] == "?mod=forge" && getURL[1] == "submod=smeltery") {
            SmelteryTimeSaverExtension();
        } else if (getURL[0] == "?mod=forge" && getURL[1] == "submod=forge") {
            Herreria();
        }else if(getURL[0] == "?mod=packages"){
            Paquetes.UI();
            Paquetes.MoverFiltros();
        }
    }
    static Run(){
        Menu.Dibujar();
        GladiatusTools.SetTool();
        Notificaciones.Rotativos();
        //GuardarOro.Run();
        ExtenderBotones.Paquetes();
        window.addEventListener("load", () => {
            localStorage.TimeSaverExist = TimeSaver.Exist();
            TimeSaver.setKeyForStop(JSON.parse(localStorage.TimeSaverExist));
            TimeSaver.StopOnKey();
        });
    }
}

class insertOnPage{
    // Antes que el propio elemento.
    static beforebegin(object, html){
        object.insertAdjacentHTML("beforebegin", html);
    }
    //Justo dentro del elemento, antes de su primer elemento hijo.
    static afterbegin(object, html){
        object.insertAdjacentHTML("afterbegin", html);
    }
    //Justo dentro del elemento, después de su último elemento hijo.
    static beforeend(object, html){
        object.insertAdjacentHTML("beforeend", html);
    }
    //Después del propio elemento.
    static afterend(object, html){
        object.insertAdjacentHTML("afterend", html);
    }
}

class Observer{
    static ForRemovedNodes(ItemForWait, instructions){
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation)=> {
                if(mutation.removedNodes.length){
                    instructions();

                }
            })
        });
        // Opcions para el observer
        const observerOptions = {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: false,
            attributeOldValue: false,
            characterDataOldValue: false
        };
        observer.observe(ItemForWait, observerOptions);
    }
}

class Formatter{
    static abbreviateNumber(number){
        var SI_SYMBOL = ["", "k", "kk", "kkk", "kkkk", "kkkkk", "kkkkkk"];

        // what tier? (determines SI symbol)
        var tier = Math.log10(Math.abs(number)) / 3 | 0;

        // if zero, we don't need a suffix
        if(tier == 0) return number;

        // get suffix and determine scale
        var suffix = SI_SYMBOL[tier];
        var scale = Math.pow(10, tier * 3);

        // scale the number
        var scaled = number / scale;

        // format number and add suffix
        return scaled.toFixed(1) + suffix;
    }
}

class Menu{
    static Dibujar(){
        document.body.insertAdjacentHTML("afterbegin",`
            <button id="MenuOpen" title="𝗖𝗢𝗡𝗙𝗜𝗚𝗨𝗥𝗔𝗖𝗜𝗢𝗡\nGLADIATUS TOOLS" class="btnMenu"> <img style="height: 112px;" src="https://cdn.jsdelivr.net/gh/lpachecob/Gladiatus-Tools@main/images/favicon.ico"></button>
            <div id="menuSidenav" class="menutools">
                 <h1>Configuración</h1>
                 <hr/>
                 <a id="CloseMenu" href="#" class="closebtn">&times;</a>
                 <div id="menuContent"></div>
            </div>
            `);
        let menuOpen = document.getElementById("MenuOpen");
        menuOpen.addEventListener("click", Menu.openNav);
        let closeMenu = document.getElementById("CloseMenu");
        closeMenu.addEventListener("click", Menu.closeNav);

        document.addEventListener('mouseup', function(e) {
            var container = document.getElementById("menuSidenav");
            if (!container.contains(e.target)) {
                container.style.display = 'none';
            }
        });
    }
    static openNav() {
        document.getElementById("menuSidenav").style.display = "block";
    }

    static closeNav() {
        document.getElementById("menuSidenav").style.display = "none";
    }
    static addConfig(html){
        html+= "<hr/>"
        insertOnPage.beforeend(document.getElementById("menuContent"),html);
    }
}

class Notificaciones{
    static Rotativos(){
        Menu.addConfig(`
        <h2>Notificaciones</h2>
        <ul>
            <label><input type="checkbox" id="NotificarOro" style=""> Notifica si tengo oro para guardar</label>
        </ul>
        <ul id="MontosNotificar" style="display: flex;background-color: white;width: 324px;height: auto;margin-left: 43px;padding: 6px;flex-direction: row;flex-wrap: wrap;">
           <input type="number" title="Presiona ENTER para guardar." id="InputNotificarOro" placeholder="Oro" style="background-color: #bebebe;color: white;font-weight: bold;font-size: 12px;width: 79px;height: 23px;">
        </ul>

        `);

        let MontosNotificar = document.getElementById("MontosNotificar");
        let InputNotificarOro = document.getElementById("InputNotificarOro");
        let MontosGuardados = [];

        if(localStorage.MontosGuardados == undefined){
        localStorage.MontosGuardados = '["100000"]';
        }else{
        MontosGuardados = JSON.parse(localStorage.MontosGuardados)
        }

        InputNotificarOro.addEventListener("keypress",(input)=>{
            if (input.key === 'Enter') {
                if (!MontosGuardados.includes(InputNotificarOro.value) && InputNotificarOro.value != "") {
                    MontosGuardados.push(InputNotificarOro.value);
                    InputNotificarOro.value = "";
                    localStorage.MontosGuardados = JSON.stringify(MontosGuardados.sort(function(a, b){return a - b}));
                    window.location.reload()
                }
            }
        });

        let NotificarOro = document.getElementById("NotificarOro"); //.checked indica si está activo o no
        if (localStorage.NotificarOro == undefined) {
            localStorage.NotificarOro = NotificarOro.checked
        } else {
            NotificarOro.checked = JSON.parse(localStorage.NotificarOro);
        }
        NotificarOro.addEventListener("change", () => {
            localStorage.NotificarOro = NotificarOro.checked;
        })

        if (JSON.parse(localStorage.NotificarOro) == true) {
            Notificaciones.Mensaje();
            Notificaciones.MostrarRotativosSeleccionados();
            Notificaciones.EliminarRotativo();
        }

    }
    static Mensaje(){
        let MontosGuardados = JSON.parse(localStorage.MontosGuardados);
        let mensaje = "";

        for(let monto of MontosGuardados){
            if (Math.floor(oro / monto) >= 2) {
                mensaje += `Empaqueta ` + Math.floor(oro / monto) + ` rotativos de `+ Formatter.abbreviateNumber(monto)+`\n`;
            } else if (Math.floor(oro / monto) == 1) {
                mensaje += `Empaqueta ` + Math.floor(oro / monto) + ` rotativo de `+ Formatter.abbreviateNumber(monto)+`\n`;
            }
        }

        if (mensaje != "") {
            document.getElementById("mmonetbar").insertAdjacentHTML("beforeend",`
                <a href="game/index.php?mod=guildMarket" style="display: contents;">
                    <div id="testnoti" class="notification-box notification-info" style="position: fixed;right: 0px;"><div class="icon"></div>` + mensaje + `</div>
                </a>`);
        }

    }
    static MostrarRotativosSeleccionados(){
        let MontosGuardados = JSON.parse(localStorage.MontosGuardados);
        let indiceDeRotativoBorrar;
        let MontosNotificar = document.getElementById("MontosNotificar");
        let contador = 0;
        for(let monto of MontosGuardados){
            insertOnPage.beforeend(MontosNotificar,`
               <div style="border-style: groove;color: black;width: fit-content;padding: 2px;font-size: 12px;">
                   `+Formatter.abbreviateNumber(monto)+`
                   <button name="NotificaRotativoBorrar" data-index="`+contador+`" style="color: red;font-weight: bold;font-size: 16px;border: none;background: none;">x</button>
               </div>
           `)
            contador++;
        }
    }
    static EliminarRotativo(){
        let MontosGuardados = JSON.parse(localStorage.MontosGuardados);
        let NotificaRotativoBorrar = document.getElementsByName("NotificaRotativoBorrar")
        for (let boton of NotificaRotativoBorrar) {
            boton.addEventListener("click",()=>{
                MontosGuardados.splice(boton.attributes[1].value,1)
                localStorage.MontosGuardados = JSON.stringify(MontosGuardados.sort(function(a, b){return a - b}));
                window.location.reload()
            })

        }
    }
}

class Mercado{
    static Config(){
        Menu.addConfig(`
            <h2>Mercado de la Alianza</h2>
            <ul id="MercadoAlianza" style="display: flex;background-color: white;width: 324px;height: auto;margin-left: 43px;padding: 6px;flex-direction: row;flex-wrap: wrap;">
                <input type="number" title="Presiona ENTER para guardar." id="InputMercadoAlianza" placeholder="Oro" style="background-color: #bebebe;color: white;font-weight: bold;font-size: 12px;width: 79px;height: 23px;">
            </ul>
        `);
        let MercadoAlianza = document.getElementById("MercadoAlianza");
        let InputMercadoAlianza = document.getElementById("InputMercadoAlianza");
        let MontosMercado = [];

        if(localStorage.MontosMercado == undefined){
        localStorage.MontosMercado = '["100000"]';
        }else{
        MontosMercado = JSON.parse(localStorage.MontosMercado)
        }

        InputMercadoAlianza.addEventListener("keypress",(input)=>{
            if (input.key === 'Enter') {
                if (!MontosMercado.includes(InputMercadoAlianza.value) && InputMercadoAlianza.value != "") {
                    MontosMercado.push(InputMercadoAlianza.value);
                    InputMercadoAlianza.value = "";
                    localStorage.MontosMercado = JSON.stringify(MontosMercado.sort(function(a, b){return a - b}));
                    window.location.reload()
                }
            }
        });
    }
    static MostrarRotativosSeleccionados(){
        let MontosMercado = JSON.parse(localStorage.MontosMercado);
        let indiceDeRotativoBorrar;
        let MercadoAlianza = document.getElementById("MercadoAlianza");
        let contador = 0;
        for(let monto of MontosMercado){
            insertOnPage.beforeend(MercadoAlianza,`
               <div style="border-style: groove;color: black;width: fit-content;padding: 2px;font-size: 12px;">
                   `+Formatter.abbreviateNumber(monto)+`
                   <button name="MercadoRotativoBorrar" data-index="`+contador+`" style="color: red;font-weight: bold;font-size: 16px;border: none;background: none;">x</button>
               </div>
           `)
            contador++;
        }
    }
    static EliminarRotativo(){
        let MontosMercado = JSON.parse(localStorage.MontosMercado);
        let NotificaRotativoBorrar = document.getElementsByName("MercadoRotativoBorrar")
        for (let boton of NotificaRotativoBorrar) {
            boton.addEventListener("click",()=>{
                MontosMercado.splice(boton.attributes[1].value,1)
                localStorage.MontosMercado = JSON.stringify(MontosMercado.sort(function(a, b){return a - b}));
                window.location.reload()
            })

        }
    }
    static VentaRapida(){
        let panelVenta = document.getElementById("sellForm");
        let inputPrecio = document.getElementById("preis");
        let inputDuracion = document.getElementById("dauer");
        let botonVender = document.getElementsByName("anbieten")[0];
        let marketInventory = document.getElementById("market_inventory");
        let oro = parseFloat(document.getElementById("sstat_gold_val").textContent);
        let cajaVenta = document.getElementsByClassName("ui-droppable")[0];

        insertOnPage.beforebegin(panelVenta,`
            <h2 id="VentaRapidaMenuTitle" class="section-header" style="cursor: pointer;">Venta Rapida</h2>
	        <section id="VentaRapidaMenu" style="display: block;"> <p>Coloca un item y elige el precio para vender.</p> </section>
        `);

        let MontosMercado = JSON.parse(localStorage.MontosMercado);
        let ventaRapidaMenu = document.getElementById("VentaRapidaMenu");

        for(let monto of MontosMercado){
            insertOnPage.beforeend(ventaRapidaMenu,`
             <button name="BotonVender" data-input="`+monto+`" class="awesome-button" style="margin:5px;" data-toggle="tooltip" title="Costo de venta: `+Formatter.abbreviateNumber(monto*0.04)+` 💰" >`+Formatter.abbreviateNumber(monto)+`</button>
            `)
        };
        insertOnPage.beforeend(ventaRapidaMenu,`
            <section id="" style="display: block;">
                <p><small>Elegir duración</small></p>
                <select id="SelectHora" size="1">
				    <option value="1">2 h</option>
				    <option value="2">8 h</option>
				    <option value="3">24 h</option>
		        </select>
	        </section>`);
        let selectHora = document.getElementById("SelectHora");
        if (localStorage.SelectHora == undefined) {
            localStorage.SelectHora = 1;
            selectHora.value = 1;
        } else {
            selectHora.value = localStorage.SelectHora;
        }
        selectHora.addEventListener("change", (event) => {
            localStorage.SelectHora = selectHora.value;
        });
        let ventaRapidaMenuTitle = document.getElementById("VentaRapidaMenuTitle");
        ventaRapidaMenuTitle.addEventListener("click", () => {
            if (ventaRapidaMenu.style.display == "none") {
                ventaRapidaMenu.style.display = "block";
            } else {
                ventaRapidaMenu.style.display = "none";
            }
        });

        let BotononesVender = document.getElementsByName("BotonVender")

        for (let boton of BotononesVender) {
            boton.addEventListener("click",()=>{
                inputPrecio.value = boton.attributes[1].value;
                inputDuracion.value = localStorage.SelectHora;
                botonVender.click();
            })

        }

    }
    static Run(){
        Mercado.Config();
        Mercado.MostrarRotativosSeleccionados();
        Mercado.EliminarRotativo();
        Mercado.VentaRapida();
    }
}

function AcutionHouseTools() {
    let item = document.getElementsByTagName("TD");
    let oro = parseInt(document.getElementById("sstat_gold_val").textContent.replace(/\./g, ''));

	let menu = document.getElementsByClassName("section-header")[1];
	menu.insertAdjacentHTML(
		"beforebegin",
		`
  <h2
	   id = "MenuCompraTitle"
	   class = "section-header"
	   style = "cursor: pointer;">
	   Compra Rápida
  </h2>
  <section
	   id = "MenuCompra"
	   style = "display: block;">
  </section>`
	);

	let SectionMenuCompra = document.getElementById("MenuCompra");
	/*
	SectionMenuCompra.insertAdjacentHTML('beforeend', `
	<p>Indica un precio máximo para comprar o compra todo lo que te alcance.</p>
	<p><small>No se sobrepujará a los compañeros de alianza.</small></p>
	`);
	*/
	SectionMenuCompra.insertAdjacentHTML(
		"beforeend",
		`
  <p>Se comprará todo lo que alcance con el oro que tienes.</p>
  <p><small>No se sobrepujará a los compañeros de alianza.</small></p>
  `
	);

	SectionMenuCompra.insertAdjacentHTML(
		"beforeend",
		`
  <input
	   type = "number"
	   id = "OroMaximo"
	   placeholder = "Oro máximo a gastar"
	   style = "width:150px" hidden>`
	);

	SectionMenuCompra.insertAdjacentHTML(
		"beforeend",
		`
  <button
	   id = "BotonComprar"
	   class = "awesome-button"
	   style = "margin:5px;"
	   data-toggle = "tooltip"
	   title = "Se comprará toda la comida que alcance con el oro que tengas">
	   Comprar todo
  </button>`
	);

    let oroMaximo = document.getElementById("OroMaximo");
	let botonComprar = document.getElementById("BotonComprar");
	oroMaximo.addEventListener("input", () => {
		if (oroMaximo.value.length > 0) {
			botonComprar.title =
				"Se comprara la comida que alcance con: " + oroMaximo.value + " 🥇";
			botonComprar.innerHTML = "\n Comprar \n";
		} else if (oroMaximo.value.length == 0) {
			botonComprar.title =
				"Se comprará toda la comida que alcance con el oro que tengas";
			botonComprar.innerHTML = "\n Comprar todo\n";
		}
	});

	botonComprar.addEventListener("click", () => {
        if (oroMaximo.value.length > 0) {
            //Proximamente
        } else if (oroMaximo.value.length == 0) {
            for (let isItem = 0; isItem < item.length; isItem++) {
                if(item[isItem].hasAttribute("width")==true){
                    let auction_bid_div = item[isItem].children[1].children[0].children[7].children;
                    let auction_item_div = item[isItem].children[1].children[0].children[6].children[1].children[0];
                    let itemSplit = auction_item_div.attributes[6].textContent.substring(4,9);
                    //console.log(auction_bid_div[2]);
                    let costo = parseInt(auction_bid_div[2].value);
                    if (costo < oro) {
                        oro = oro - costo;
                        //console.log(oro," - ",costo)
                        let PujaDeAlguien;
                        if (
                            auction_bid_div[0].innerText.split("\n")[0] == "No hay pujas." ||
                            auction_bid_div[0].innerText.split("\n")[0] == "Ya hay pujas existentes."
                        ) {
                            //items[i].children[3].click();
                            if(itemSplit != "Pollo"){
                                auction_bid_div[3].click();
                            }

                        }
                    }
                }
            }
        }
    });

    let menuCompraTitle = document.getElementById("MenuCompraTitle");
    menuCompraTitle.addEventListener("click", () => {
        if (SectionMenuCompra.style.display == "none") {
            SectionMenuCompra.style.display = "block";
        } else {
            SectionMenuCompra.style.display = "none";
        }
    });
}

function SmelteryTimeSaverExtension() {
    let inv = document.getElementById("inv")
    window.addEventListener("load", () => {
        if (document.getElementsByClassName("smelter-actions")[0] != undefined) {
            let inventario = document.getElementsByClassName("smelter-actions")[0];
            let items = document.getElementsByClassName("ui-draggable");
            let btnFundicion = FindBtn("Iniciar función");
            let btnGuardarRecursos = FindBtn("Enviar todo a Horreum");
            let mensaje = document.getElementsByClassName("gts-error-message")[0];
			inventario.insertAdjacentHTML(
				"beforeend",
				`
               <strong>Acciones Rapidas</strong>
               <br/>
               Selecciona un inventario para fundir
               <select
			   id="SelectInventario"
			   size="1">
				  <option value="Ⅰ">Ⅰ</option>
				  <option value="Ⅱ">Ⅱ</option>
				  <option value="Ⅲ">Ⅲ</option>
				  <option value="Ⅳ">Ⅳ</option>
				  <option value="Ⅴ">Ⅴ</option>
				  <option value="Ⅵ">Ⅵ</option>
				  <option value="Ⅶ">Ⅶ</option>
				  <option value="Ⅷ">Ⅷ</option>
				</select>
                <hr>
                <button
					class="awesome-button"
					type="button"
					id="FundirTodo">
					Fundir Todo
			   </button>
               <button
					class="awesome-button"
					type="button"
					id="GuardarFundir">
					Guardar y Fundir
			   </button>

		  `
			);

			let selectInventario = document.getElementById("SelectInventario");
			if (localStorage.InventarioFundicion == undefined) {
				localStorage.InventarioFundicion = "Ⅰ";
				selectInventario.value = "Ⅰ";
			} else {
				selectInventario.value = localStorage.InventarioFundicion;
			}
			selectInventario.addEventListener("change", (event) => {
				localStorage.InventarioFundicion = selectInventario.value;
			});

			let inventoryTabs = document.getElementsByClassName("awesome-tabs");
			let inventorySelected;
			for (let index = 4; index < inventoryTabs.length; index++) {
				if (inventoryTabs[index].text == localStorage.InventarioFundicion) {
					inventorySelected = inventoryTabs[index];
				}
			}

            if(localStorage.GuardarRecursos == undefined){
                localStorage.GuardarRecursos = false;
            }
            const observer = new MutationObserver((mutationList) => {
                mutationList.forEach((mutation)=> {
                    if(mutation.removedNodes.length){
                        if(JSON.parse(localStorage.GuardarRecursos) == true){
                            inventorySelected.click();
                            btnFundicion.click();
                            for (let index = 9; index < items.length; index++) {
                                items[index].click();
                            }
                            localStorage.GuardarRecursos = false;
                        }
                    }

                })
            });
            // Opcions para el observer
            const observerOptions = {
                attributes: true,
                childList: true,
                subtree: true,
                characterData: false,
                attributeOldValue: false,
                characterDataOldValue: false
            };
            observer.observe(inv, observerOptions);

            if(JSON.parse(localStorage.GuardarRecursos) == true){
                inventorySelected.click();
                btnFundicion.click();
                for (let index = 9; index < items.length; index++) {
                    items[index].click();
                }
                localStorage.GuardarRecursos = false;
            }
            let GuardarFundir = document.getElementById("GuardarFundir");
            GuardarFundir.addEventListener("click", () => {
                localStorage.GuardarRecursos = true;
                btnGuardarRecursos.click();
            });

            let fundirTodo = document.getElementById("FundirTodo");
            fundirTodo.addEventListener("click",()=>{
                inventorySelected.click();
                btnFundicion.click();
                for (let index = 9; index < items.length; index++) {
                    items[index].click();
                }
            });

            mensaje.addEventListener("DOMNodeInserted", () => {
                window.location.reload();
            }, false);



        } else {
            console.log("time saver extension not installed");
		}
	});

    function FindBtn(textContent) {
        let elements = document.getElementsByClassName("awesome-button");
        let elementsArray = [].slice.call(elements);
        for (let index = 0; index < elementsArray.length; index++) {
            let element = elementsArray[index];
            if (element.textContent === textContent) {
                return element;
            }
        }
    }

    function Observer(observar){
        let observerReturn = [[],[]]
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation)=> {
                if(mutation.addedNodes.length){
                    observerReturn[0].push(mutation.addedNodes[0]);
                }
                if(mutation.removedNodes.length){
                    observerReturn[1].push(mutation.removedNodes[0]);
                }
                //console.log(mutation.type);

            })
        });
        // Opcions para el observer
        const observerOptions = {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: false,
            attributeOldValue: false,
            characterDataOldValue: false
        };
        observer.observe(observar, observerOptions);
        return observerReturn;
    }

}

function Herreria(){
     /*let selectPrefix0 = document.getElementById("prefix0")
     selectPrefix0.hidden;
     selectPrefix0.insertAdjacentHTML("beforebegin",`<input id="inputPrefix" list="prefixList" style="width: 102px;"><datalist id="prefixList"></option></datalist>`);
     let inputPrefix = document.getElementById("inputPrefix");
     inputPrefix.setAttribute("onkeyup",selectPrefix0.attributes.onkeyup.textContent);
     inputPrefix.setAttribute("onchange",selectPrefix0.attributes.onchange.textContent);

     let prefixList = document.getElementById("prefixList");
     let prefijos = [[],[],[],[]]
     let prefijosOptgroup = document.getElementsByTagName("optgroup")[0].children
     for (let index = 0; index < prefijosOptgroup.length; index++) {
         prefijos[0].push(prefijosOptgroup[index].text)
         prefijos[1].push(prefijosOptgroup[index].value)
         prefijos[2].push(prefijosOptgroup[index].attributes["data-level"].textContent);
         prefijos[2].push(prefijosOptgroup[index].attributes["data-name"].textContent);
     }
     for (let index = 0; index < prefijos[0].length; index++) {
         var option = document.createElement('option');
         option.value = prefijos[0][index];
         option.setAttribute("data_value",prefijos[1][index]);
         prefixList.appendChild(option);
     }

     inputPrefix.addEventListener("change",()=>{
         selectPrefix0.selectedIndex = prefijos[0].indexOf(inputPrefix.value);
         selectPrefix0.value = prefijos[1][prefijos[0].indexOf(inputPrefix.value)];
     });*/
 }

class Paquetes {
    static filtros(){
        let inputQry = document.getElementsByName("qry");
        inputQry[0].setAttribute("list","customSearch");
        inputQry[0].insertAdjacentHTML("afterend", `<datalist id="customSearch"></datalist>`);

        /*let GladiatusToolsMenu = document.getElementById("GladiatusToolsMenu");
    GladiatusToolsMenu.insertAdjacentHTML("beforeend",`
    <button class="dropbtn"></button>
    <div class="dropdown-content" id="GladiatusToolsMenu">
       menu de paquetes
    </div>
    `);*/

    }

    static UI(){
        let inventoryBox = document.getElementsByClassName("inventoryBox")[0];
        insertOnPage.afterbegin(inventoryBox,`
        <div>
            <div class="panelBusqueda"></div>
            <button id="buscarRotativos" class="awesome-button" style="position: absolute;right: -255px;top: -25px;color: white;font-weight: bold;font-size: 13px;">🔎 Buscar Items</button>
            <input type="search" id="categoria" list="listaCategorias" style="position: absolute; right: -476px; top: -23px;" value="Mercado">
            <datalist id="listaCategorias">
                 <option>Banco de trabajo</option>
                 <option>Casa de subastas</option>
                 <option>Ermitaño</option>
                 <option>Expedición</option>
                 <option>Fundición</option>
                 <option>Jefe de la Mazmorra</option>
                 <option>Mazmorra</option>
                 <option>Mercado</option>
                 <option>Panteón</option>
                 <option>Recompensa de la misión</option>
            </datalist>
            <div id="MercadoFavoritos" class="Favoritos"><h2 id="mensaje"></h2></div>
        </div>`)
        let buscarRotativos = document.getElementById("buscarRotativos");
        let categoria = document.getElementById("categoria");

        buscarRotativos.addEventListener("click",()=>{
            Paquetes.PonerEnFavoritos(categoria.value)
        })
        if(localStorage.paquetesCategoria == undefined){
            localStorage.paquetesCategoria = "Mercado";
        }else{categoria.value = localStorage.paquetesCategoria}
        categoria.addEventListener("change",()=>{localStorage.paquetesCategoria = categoria.value});
    }

    static PonerEnFavoritos(textContent){
        let MercadoFavoritos = document.getElementById("MercadoFavoritos");
        let rotativos = Paquetes.EncontrarRotativos(textContent);
        MercadoFavoritos.style.display = "block";
        MercadoFavoritos.innerHTML = `<h2 id="mensaje"></h2>`;

        let mensaje = document.getElementById("mensaje");
        if (rotativos.length > 0){
            mensaje.innerText = "Objetos Encontrados!";
            for (let item of rotativos) {
                MercadoFavoritos.append(item)
            }
        } else {mensaje.innerHTML = `
        <div title="Se recomienda utilizar la extención gladiatus crazy addon\ny colocar el 'Número de paginas a cargar' desde 10 en adelante" style="text-align: center;">
             No se encontraron objetos, intenta nuevamente.
             <?xml version="1.0" ?><svg style="width: 13px; margin-top: -42px; margin-bottom: -25px; margin-left: 281px;" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"/><path d="M22 34h4v-12h-4v12zm2-30c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z"/></svg>
        </div>
        <br/>`;}
    }

    static EncontrarRotativos(textContent){
        let rotativos = []
        let packages = document.getElementById("packages");
        //packages.children[1].children[2].children[0].attributes[6].textContent.includes("Oro")
        for (let item of packages.children) {
            if(!!item.children[1] == true &&
               item.children[1].textContent == textContent
              ){
                let atributes = item.children[2].children[0].attributes;
                for (let atribute of atributes) {
                    if(atribute.name == "data-tooltip"){
                        if(atribute.textContent.includes('Oro","white"') == false){
                            rotativos.push(item)
                        }
                    }
                }
            }
        }
        return rotativos
    }
    static MoverFiltros(){
        let filtros = document.getElementsByClassName("package-advance-filters")[0];
        filtros.setAttribute("style","width: 500px;margin-left: auto;")
        let article = document.getElementsByTagName("article")[0];
        let sectionHeaders = document.getElementsByClassName("section-header")
        for (let section of sectionHeaders) {
            if(section.innerHTML.includes("Paquetes")==true){
                article.insertBefore(filtros,section)
            }
        }
    }
}
//style="width: 500px;margin-left: auto;"

class TimeSaver{

    static Exist(){
        const timeSaverr = !!document.getElementsByClassName("auto-settings")[0]
        return timeSaverr;
    }

    static setKeyForStop(timeSaverExist){
        if(timeSaverExist==true){
            Menu.addConfig(`
            <h3>TimeSaver</h3>
            <ul>Atajos de Teclado
                <ul>Pausar Bot: <input maxlength="1" id="timeSaverHotKeySelectedKey" style="width: 100px;background: white;"><button id="Btnconfirmar" title="click para guardar" style="background: transparent; border: transparent;"></button></ul>
                <ul style="color: #0fea0f;" id="timeSaverHotKeyConfirmation" hidden>✔ Cambios guardados correctamente</ul>
                <ul><label><input id="timeSaverHotKeyCheckbox" type="checkbox"> Utilizar combinación con ctrl<label></ul>
            </ul>`);

            let timeSaverHotKeySelectedKey = document.getElementById("timeSaverHotKeySelectedKey");
            let timeSaverHotKeyCheckbox = document.getElementById("timeSaverHotKeyCheckbox");
            let timeSaverHotKeyConfirmation = document.getElementById("timeSaverHotKeyConfirmation");

            let Btnconfirmar = document.getElementById("Btnconfirmar");

            Btnconfirmar.addEventListener("click",()=>{Btnconfirmar.textContent = ""; timeSaverHotKeyConfirmation.hidden = false;});

            if(localStorage.timeSaverHotKeyCheckbox == undefined){
                localStorage.timeSaverHotKeyCheckbox = false;
            } else {
                timeSaverHotKeyCheckbox.checked = JSON.parse(localStorage.timeSaverHotKeyCheckbox);
            }
            timeSaverHotKeyCheckbox.addEventListener("change",()=>{localStorage.timeSaverHotKeyCheckbox=timeSaverHotKeyCheckbox.checked;})

            if(localStorage.timeSaverHotKeySelectedKey == undefined){
                localStorage.timeSaverHotKeySelectedKey = "";
            } else {
                timeSaverHotKeySelectedKey.value = localStorage.timeSaverHotKeySelectedKey;
            }
            timeSaverHotKeySelectedKey.addEventListener("keydown",()=>{timeSaverHotKeySelectedKey.select();
                                                                     Btnconfirmar.textContent = "✅";
                                                                    })
            timeSaverHotKeySelectedKey.addEventListener("change",()=>{localStorage.timeSaverHotKeySelectedKey = timeSaverHotKeySelectedKey.value;})
        }
    }

    static StopOnKey(){
        document.addEventListener('keyup', (e)=>{
            let selectKey = localStorage.timeSaverHotKeySelectedKey;
            let useControl = JSON.parse(localStorage.timeSaverHotKeyCheckbox);

            if (useControl == true && e.ctrlKey && e.key === selectKey) {
                TimeSaver.StopBot();
            }

            if (useControl == false && e.key === selectKey) {
                TimeSaver.StopBot();
            }
        }, false);
    }

    static StopBot(){
        let timeSaver = document.getElementsByClassName("auto-settings")[0]
        let botonPlay = timeSaver.children[3];
        if (botonPlay.classList[2] == "show") {
            //bot desactivado
            botonPlay.click();
        }
    }
}

class ExtenderBotones{
    static Paquetes(){
        let menue_packages = document.getElementById("menue_packages");
        let url = window.location.search.split("&");
        insertOnPage.afterend(menue_packages,`
            <button id="extenderPaquetes" class="awesome-button extederPaquetes" title="Presiona para abrir el menú de paquetes">+</button>
            <div id="menuBotonPaquetes" class="menuBotonPaquetes">
                <div class="icon-out"><a class="icon food-icon" href="index.php?mod=packages&f=7&fq=-1&qry=&page=1&`+sh+`" title="Ir a paquetes, Utilizable"></a></div>
            </div>
            `);
        let menuBotonPaquetes = document.getElementById("menuBotonPaquetes");
        let extenderPaquetes = document.getElementById("extenderPaquetes");
        let menuAbierto = false;
        extenderPaquetes.addEventListener("click",()=>{
            menuAbierto = !menuAbierto;
            if(menuAbierto == true){
                menuBotonPaquetes.style.display = 'block';
            } else {
                menuBotonPaquetes.style.display = 'none';
            }
        })
         document.addEventListener('mouseup', function(e) {
            var container = document.getElementById("extenderPaquetes");
            if (!container.contains(e.target)) {
                menuBotonPaquetes.style.display = 'none';
            }
        });


    }
}

class GuardarOro{
    static UI(){
        Menu.addConfig(`
            <h3>Guardar Oro</h3>
            <ul><label><input id="GuardarOroCheck" type="checkbox"> Guardar tu oro automaticamente<label></ul>
            <ul>Oro Máximo a tener suelto: <input id="OroMaximoSuelto" style="width: 100px;background: white;" value="0"></ul>
        `);
        let GuardarOroCheck = document.getElementById("GuardarOroCheck");
        let OroMaximoSuelto = document.getElementById("OroMaximoSuelto");

        if (localStorage.GuardarOroCheck == undefined) {
            localStorage.GuardarOroCheck = GuardarOroCheck.checked
        } else {
            GuardarOroCheck.checked = JSON.parse(localStorage.GuardarOroCheck);
        }
        GuardarOroCheck.addEventListener("change", () => {
            localStorage.GuardarOroCheck = GuardarOroCheck.checked;
        })

        if (localStorage.OroMaximoSuelto == undefined) {
            localStorage.OroMaximoSuelto = OroMaximoSuelto.value
        } else {
            OroMaximoSuelto.value = localStorage.OroMaximoSuelto;
        }
        OroMaximoSuelto.addEventListener("input", () => {
            localStorage.OroMaximoSuelto = OroMaximoSuelto.value;
        })
    }
    static VerSiTengoOro(oroTrigger){
        let oroTriggerParse = parseInt(oroTrigger.replace(/\./g, ''))
        if(oro > oroTriggerParse){
            return true;
        }else{
            return false;
        }
    }
    static ItemsParaComprar(){
        if(getURL[0] == "?mod=guildMarket" &&	getURL[1] != "submod=control"){
            let market_table = document.getElementById("market_table")
            let market_table_trs = market_table.children[0].children[0].children
            let itemsEnVenta = [];

            for (let item of market_table_trs) {
                if(item.tagName == "TR" &&
                   !!item.children[5].children[0] == true &&
                   item.children[5].children[0].name == "buy"){
                    itemsEnVenta.push(item)
                }
            }
            return itemsEnVenta;
        } else {
            return [];
        }
    }

    static sComprarTodo(){
        let OroMaximoSuelto = document.getElementById("OroMaximoSuelto").value;
        let inv = document.getElementById("inv");

        if((!localStorage.CompraItem=="" && !localStorage.CompraVinculado=="" && !localStorage.CompraPrecioCompra=="" && localStorage.itemEnInventario == "No") == true){
            console.log("Item Comprado ir a recogerlo")
            if(getURL[0] != "?mod=packages"){
                document.getElementById("menue_packages").click()
            }
            if(getURL[0] == "?mod=packages"){
                
            }
        }else{
            if(localStorage.itemEnInventario == "Si"){
                if(getURL[0] != "?mod=guildMarket"){
                    window.location.replace("index.php?mod=guildMarket&s=pd&"+sh)
                }
            }

        }
    }
    static VenderItem(){
        window.addEventListener("load", ()=>{
            let items = document.getElementById("inv").children;
            for (let item of items) {
                for(let attribute of item.attributes){
                    if(attribute.name == "data-tooltip"){
                        if(attribute.textContent.slice(0,19).split(",")[0] == localStorage.CompraItem.slice(0,19)){
                            item.dispatchEvent(dobleClickEvent);
                            setTimeout(function () {
                                document.getElementById("preis").value = localStorage.CompraPrecioCompra;
                                document.getElementById("dauer").selectedIndex = 2;
                                // document.getElementsByName("anbieten")[0].click();
                                localStorage.itemEnInventario = "No"
                                localStorage.CompraItem = "";
                                localStorage.CompraVinculado = "";
                                localStorage.CompraPrecioCompra = "";
                            }, 2000);
                        }
                    }
                }
            }

        })
    }
    static CogerDeInventario(){
         let inv = document.getElementById("inv");
        document.getElementById("buscarRotativos").click()
        let items = document.getElementById("MercadoFavoritos").children;
        for (let index = 1; index < items.length; index++) {
            let item = items[index].children[2].children[0];
            for (let attribute of item.attributes) {
                if(attribute.name == "data-tooltip"){
                    localStorage.CompraItem_Comprobar = attribute.textContent.slice(0,22).split(",")[0]
                }
            }
            if(localStorage.CompraItem_Comprobar.slice(0,19) == localStorage.CompraItem.slice(0,19)){
                Observer.ForRemovedNodes(inv, ()=>{
                    item.dispatchEvent(dobleClickEvent);
                    localStorage.itemEnInventario = "Si";
                });

            }
        }
    }
    static ComprarTodo(){
        let OroMaximoSuelto = document.getElementById("OroMaximoSuelto").value;
        if(GuardarOro.VerSiTengoOro(OroMaximoSuelto) == true){
            let itemsComprados = [];
            for(let item of GuardarOro.ItemsParaComprar()){
                let itemPrice = parseInt(item.children[2].textContent.replace(/\./g, ''));
                if(itemPrice<oro){
                    oro = oro - itemPrice;
                    for(let attribute of item.children[0].children[0].attributes){
                        if(attribute.name == "data-tooltip"){
                            let objeto = attribute.textContent.slice(0,200).split(",");
                            let contador = 0;
                            for (let elemento of objeto) {
                                if(elemento.includes('#')==false){
                                    if(contador==0){
                                        localStorage.CompraItem = elemento;
                                    }
                                    if(contador==1){
                                        localStorage.CompraVinculado = elemento;
                                    }
                                    contador++;
                                }
                                if(contador>2){
                                    break;
                                }
                            }
                            localStorage.CompraPrecioCompra = itemPrice;
                            //itemsComprados.push(atributosGuardar)
                        }
                        }
                    item.children[5].children[0].click();
                }
            }
            //Guardar Objetos en local storage
            //localStorage.test3 = JSON.stringify({"test":"testContend"})
            //let test = JSON.parse(localStorage.test3)
        }
    }

    static Run(){
        GuardarOro.UI();
        let OroMaximoSuelto = document.getElementById("OroMaximoSuelto").value;
        localStorage.AutoGuardarOro = "NoGuardado";
        //console.log(localStorage.AutoGuardarOro, OroMaximoSuelto)
    }
}

//////////////////////////////////////////////////////////////////////
/**
* run script
*/
GladiatusTools.Run();
