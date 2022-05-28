// ==UserScript==
// @name          Gladiatus Tools
// @namespace     https://greasyfork.org/users/904482
// @version       0.1.16
// @description   Set of tools and aids for the game Gladiatus
// @author        lpachecob
// @grant         none
// @match         *.gladiatus.gameforge.com/game/index.php*
// @icon          https://raw.githubusercontent.com/lpachecob/Gladiatus-Tools/main/GT_-removebg-preview.ico
// @license       MIT
// ==/UserScript==

class GladiatusTools{
    static SetTool(){
        const getURL = window.location.search.split("&")
        const mainMenu = document.getElementById("mainmenu");
        if (getURL[0] == "?mod=guildMarket" &&	getURL[1] != "submod=control") {
            MarketHelps();
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
        GladiatusTools.SetTool();
        Menu.Dibujar();
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


class Menu{
    static Dibujar(){
        document.body.insertAdjacentHTML("afterbegin",`
<style>
    .menutools {
        display: none;
        width: 422px;
        height: -webkit-fill-available;
        position: fixed;
        z-index: 10000;
        top: 0;
        right: 0;
        background-color: #111;
        overflow-x: hidden;
        padding-top: 16px;
        padding-left: 12px;
    }
    .menutools a {
        padding: 8px 8px 8px 32px;
        text-decoration: none;
        font-size: 25px;
        color: #818181;
        display: block;
    }
    .menutools a:hover {
        color: #f1f1f1;
    }
    .menutools .closebtn {
        position: absolute;
        top: 0;
        right: 25px;
        font-size: 36px;
        margin-left: 50px;
    }
    .menutools > h1{
        color: #ffffff;
    }
    .menutools > h2{
        color: #ffffff;
    }
    .menutools > h3{
        color: #ffffff;
    }
    .menutools > label{
        color: #ffffff;
    }
    .menutools > div{
        color: #ffffff;
    }

    .btnMenu{
         font-size:20px;
         cursor:pointer;
         position: fixed;
         top: 134px;
         right: 4%;
         background: transparent;
         border: transparent;
         z-index: 10000;
    }

    @media screen and (max-height: 450px) {
        .menutools {
            padding-top: 15px;
        }
        .menutools a {
            font-size: 18px;
        }
    }
</style>
            <button id="MenuOpen" class="btnMenu"> <img style="height: 112px;" src="https://raw.githubusercontent.com/lpachecob/Gladiatus-Tools/main/GT_-removebg-preview.ico"></button>
            <div id="menuSidenav" class="menutools">
                 <h1>Configuración</h1>
                 <hr/>
                 <a id="CloseMenu" href="#" class="closebtn">&times;</a>
                 <div id="menuContent"></div>
                 <!-- <label hidden><input type="checkbox" id="GuardarOro" style=""> Guardar oro automaticamente <input type="number" id="TriggerCantidadOro" placeholder="oro maximo a acumular" value="0" title="Ingresa la cantidad de oro máxima que acumulara tu personaje antes de guardarlo \n\nUtilizar el formato que usa el juego:\n- 50.000 = 50k\n- 100.000 = 100k\n- 500.000 = 500k\n- 1000.000 = 1kk"><hr></label> -->
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
        Configuracion.Notificaciones();
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

class Configuracion{
    static Notificaciones(){
        Menu.addConfig(`
        <label>
            <h2>Notificaciones</h2>
            <ul><input type="checkbox" id="NotificarOro" style=""> Notifica si tengo oro para guardar</ul>
        </label>`);

        let oro = parseFloat(document.getElementById("sstat_gold_val").textContent);
        let NotificarOro = document.getElementById("NotificarOro"); //.checked indica si está activo o no
        if (JSON.parse(localStorage.NotificarOro) == undefined) {
            localStorage.NotificarOro = NotificarOro.checked
        } else {
            NotificarOro.checked = JSON.parse(localStorage.NotificarOro);
        }
        NotificarOro.addEventListener("change", () => {
            localStorage.NotificarOro = NotificarOro.checked;
        })

        if (JSON.parse(localStorage.NotificarOro) == true) {
            console.log("aqui")
            if (oro > 50.000) {
                let mensaje = "";
                if (Math.floor(oro / 50.000) >= 2) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 50.000) + ` rotativos de 50k `
                } else if (Math.floor(oro / 50.000) == 1) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 50.000) + ` rotativo de 50k `
                }
                if (Math.floor(oro / 100.000) >= 2) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 100.000) + ` rotativos de 100k `
                } else if (Math.floor(oro / 100.000) == 1) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 100.000) + ` rotativo de 100k `
                }
                if (Math.floor(oro / 200.000) >= 2) {
                        mensaje += `Empaqueta ` + Math.floor(oro / 200.000) + ` rotativos de 100k `
                } else if (Math.floor(oro / 200.000) == 1) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 200.000) + ` rotativo de 200k `
                }
                if (Math.floor(oro / 500.000) >= 2) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 500.000) + ` rotativos de 100k `
                } else if (Math.floor(oro / 500.000) == 1) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 500.000) + ` rotativo de 500k `
                }
                if (Math.floor(oro / 1000.000) >= 2) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 1000.000) + ` rotativos de 100k `
                } else if (Math.floor(oro / 1000.000) == 1) {
                    mensaje += `Empaqueta ` + Math.floor(oro / 1000.000) + ` rotativo de 1kk `
                }
                if (mensaje != "") {
                    document.getElementById("mmonetbar").insertAdjacentHTML(
                        "beforeend",
                        `
                        <a href="game/index.php?mod=guildMarket" style="display: contents;">
                             <div id="testnoti" class="notification-box notification-info" style="position: fixed;right: 0px;"><div class="icon"></div>` + mensaje + `</div>
                        </a>
                        <style>/* Notifications */ .notification-box{cursor: pointer;background-position: 15px center;background-repeat: no-repeat;box-shadow: 0 0 12px #000;color: #FFFFFF;margin: 0 0 6px;opacity: 0.9;padding: 5px 5px 5px 28px;width: 200px;white-space: pre-wrap; z-index: 10000;}.notification-info{background-color: #2F96B4;border: 1px solid #267890;}<style>
                        `);
                }
            }
        }

    }
}


function autoGuardarOro() {
    console.log("entramos")
    let oro = parseFloat(document.getElementById("sstat_gold_val").textContent);
    let ObjetosMercado, elements, elementsArray, elementsOnlyTR = [], itemsCanBuy = [];
    var dobleClickEvent = document.createEvent ('MouseEvents');
    dobleClickEvent.initEvent ('dblclick', true, true);
    if (
	window.location.search.split("&")[0] == "?mod=guildMarket" &&
	window.location.search.split("&")[1] != "submod=control"
    ) {
        ObjetosMercado = document.getElementById("market_item_table").children[0];
        elements = document.getElementById("market_item_table").children[0];
        elementsArray = [].slice.call(elements.children);
        for (let index = 0; index < elementsArray.length; index++) {
		let element = elementsArray[index];
		if (element.tagName == "TR") {
			elementsOnlyTR.push(element)
		}
	}

        for (let item of elementsOnlyTR) {
            if (item.children[0].children[0] != undefined) {
                itemsCanBuy.push(item)
            }
        }
    }

    let GuardarOro = document.getElementById("GuardarOro"); //.checked indica si está activo o no
    let TriggerCantidadOro = document.getElementById("TriggerCantidadOro");
    if (JSON.parse(localStorage.GuardarOro) == undefined) {
        localStorage.GuardarOro = GuardarOro.checked
    } else {
        GuardarOro.checked = JSON.parse(localStorage.GuardarOro);
    }
    GuardarOro.addEventListener("change", () => {
        localStorage.GuardarOro = GuardarOro.checked;
    })

    if (localStorage.TriggerCantidadOro == undefined) {
        localStorage.TriggerCantidadOro = parseFloat(TriggerCantidadOro.value)
    } else {
        TriggerCantidadOro.value = localStorage.TriggerCantidadOro
    }

    TriggerCantidadOro.addEventListener("change", () => {
        localStorage.TriggerCantidadOro = parseFloat(TriggerCantidadOro.value)
    })
    if (GuardarOro.checked == true){
        if (oro > localStorage.TriggerCantidadOro && window.location.search.split("&")[0] != "?mod=guild") {
            if(localStorage.Comprar != "ir a comprar - Mercado" || localStorage.Comprar != "comprando" || localStorage.Comprar != "comprado"){
                localStorage.Comprar = "ir a comprar - Alianza"

            }
        }


        // Guardar oro

        if (localStorage.Comprar == "ir a comprar - Alianza"){
            console.log(localStorage.Comprar)
            let alianzaBtn = document.getElementsByClassName("menuitem advanced_menu_link");
            for (let index = 0; index < alianzaBtn.length; index++) {
                if(alianzaBtn[index].text == "Alianza" && alianzaBtn[index].text != undefined){
                    document.getElementsByClassName("menuitem advanced_menu_link")[index].click()
                }
            }
            localStorage.Comprar = "ir a comprar - Mercado";
        }
        if(localStorage.Comprar == "ir a comprar - Mercado"){
            console.log(localStorage.Comprar)
            document.getElementById("guild_market_div").click()
            localStorage.Comprar = "comprando";
        }
        if(localStorage.Comprar == "comprando"){
            console.log(localStorage.Comprar)
        let elements = document.getElementById("market_table").children[0].children[0];
            let elementsArray = [].slice.call(elements.children);
            let itemsParaComprar = [];
            for (let index = 0; index < elementsArray.length; index++) {
                let element = elementsArray[index];
                if(element.tagName == "TR"){
                    if(element.children[0].children[0] != undefined){
                        itemsParaComprar.push(element)
                    }
                }
            }
            let oroConvertido = parseFloat(document.getElementById("sstat_gold_val").textContent.replace(/\./g, ''));
            let preciosTotales = []
            let preciosOrdenados = []
            let comprarMayor = []
            for (let item of itemsParaComprar ) {
                let costo = parseFloat(item.children[2].innerText.replace(/\./g, ''));
                let costoEmpaquetado = costo * 0.04
            let total = costo + costoEmpaquetado;
                preciosTotales.push(total)
            }


            preciosOrdenados = preciosTotales.sort(function(a, b){return b - a});
            for (let total of preciosOrdenados) {
                if(oroConvertido >= total){
                    oroConvertido = oroConvertido - total;
                    comprarMayor.push(total);}
            }
            console.log(preciosOrdenados)


            let compra = []
            for (let valor of comprarMayor) {
                for (let index = 0; index < itemsParaComprar.length; index++) {
                    if(
                        (parseFloat(itemsParaComprar[index].children[2].textContent.replace(/\./g, '')) +
                         (parseFloat(itemsParaComprar[index].children[2].textContent.replace(/\./g, ''))*0.04))
                        ==
                        valor
                ){
                        localStorage.itemsComprados = itemsParaComprar[index].children[0].children[0].attributes[7].value+"?" + itemsParaComprar[index].children[2].innerText.replace(/\./g, '');
                        break;
                    }


                }
            }

            if(comprarMayor.length == 0){
                localStorage.Comprar = "comprado";
            } else {
            localStorage.Comprar = "comprando";
            }
        }
        if(localStorage.Comprar == "comprado"){
            // abre paquetes
            if(window.location.search.split("&")[0] != "?mod=packages"){
                document.getElementById("menue_packages").click()
            }
            let espaciosLibres = document.getElementsByClassName("ui-droppable grid-droparea")
            let getInventarios = document.getElementsByClassName("awesome-tabs")
            let inventarios = [];
            for (let index = 0; index < getInventarios.length; index++) {
                if(getInventarios[index].attributes[2] != undefined){
                    if(getInventarios[index].attributes[2].textContent == "true"){
                        inventarios.push(getInventarios[index])
                    }
                }
            }
            let paquetes = document.getElementById("packages").children;
            let itemsComprados = localStorage.itemsComprados.split('?');
            let itemsCompradosEncontrados = [];
            for (let index = 0; index < paquetes.length; index++) {
                for (let indexb = 0; indexb < itemsComprados.length; indexb++) {
                    if(paquetes[index].className == "packageItem"){
                        let item = paquetes[index].children[2].children[0].attributes[6].value.substring(0,65);
                        if(item == itemsComprados[indexb].substring(0,65)){
                            itemsCompradosEncontrados.push(paquetes[index])
                        }

                    }
                }
            }

            if(itemsCompradosEncontrados.length > 0){
                for (let index = 0; index < inventarios.length; index++) {
                    for (let item of itemsCompradosEncontrados) {
                        item.children[2].children[0].dispatchEvent(dobleClickEvent);
                    }
                    inventarios[index].click();
                }
            }


        }
    }

}

/**
 *  Adds quick sale buttons to the alliance marketplace
 */
function MarketHelps() {
    /* Getting the element with the id "sellForm" from the page. */
    let panelVenta = document.getElementById("sellForm");
	/* Getting the element with the id "preis" from the page. */
    let inputPrecio = document.getElementById("preis");

    let inputDuracion = document.getElementById("dauer");

    /* Getting the element with the name "anbieten" from the page. */
    let botonVender = document.getElementsByName("anbieten")[0];
    /* Getting the element with the id "market_inventory" from the page. */
    let marketInventory = document.getElementById("market_inventory");
	/* Getting the element with the id "sstat_gold_val" from the page and getting the text content of the
	  element. Then it is converting the text content to a number. */
	let oro = parseFloat(document.getElementById("sstat_gold_val").textContent);

	let cajaVenta = document.getElementsByClassName("ui-droppable")[0];

	/* Adding HTML to the page. */
	panelVenta.insertAdjacentHTML(
		"beforebegin",
		`
	  <h2
		   id="VentaRapidaMenuTitle"
		   class="section-header"
		   style="cursor: pointer;">
		   Venta Rapida
	  </h2>
	  <section
		   id="VentaRapidaMenu"
		   style="display: block;">
	  </section>`
	);

	marketInventory.insertAdjacentHTML(
		"afterbegin",
		`
	  <h2
		   id="CalcularRotativosTitle"
		   class="section-header"
		   style="cursor: pointer;">
		   Calcular Rotativos
	  </h2>
	  <section
		   id="CalcularRotativos"
		   style="display: block;">
	  </section>
	  `
	);

	/* Getting the element with the id "VentaRapidaMenu" from the page. */
	let ventaRapidaMenu = document.getElementById("VentaRapidaMenu");

	/* Adding HTML to the page. */
	ventaRapidaMenu.insertAdjacentHTML(
		"beforeend",
		`
	  <p>Coloca un item y elige el precio para vender.</p>
	  `
	);

	ventaRapidaMenu.insertAdjacentHTML(
		"beforeend",
		`
	  <button
		   id="buttonAdd50k"
		   class="awesome-button"
		   style="margin:5px;"
		   data-toggle="tooltip"
		   title="Costo de venta: 2.000 💰"
		   disabled>
		   50k
	  </button>`
	);
	ventaRapidaMenu.insertAdjacentHTML(
		"beforeend",
		`
	  <button
		   id="buttonAdd100k"
		   class="awesome-button"
		   style="margin:5px;"
		   data-toggle="tooltip"
		   title="Costo de venta: 4.000 💰"
		   disabled>
		   100k
	  </button>`
	);
	ventaRapidaMenu.insertAdjacentHTML(
		"beforeend",
		`
	  <button
		   id="buttonAdd200k"
		   class="awesome-button"
		   style="margin:5px;"
		   data-toggle="tooltip"
		   title="Costo de venta: 8.000 💰"
		   disabled>
		   200k
	  </button>`
	);
    ventaRapidaMenu.insertAdjacentHTML(
		"beforeend",
		`
	  <button
		   id="buttonAdd250k"
		   class="awesome-button"
		   style="margin:5px;"
		   data-toggle="tooltip"
		   title="Costo de venta: 10.000 💰"
		   disabled>
		   250k
	  </button>`
	);
	ventaRapidaMenu.insertAdjacentHTML(
		"beforeend",
		`
	  <button
		   id="buttonAdd500k"
		   class="awesome-button"
		   style="margin:5px;"
		   data-toggle="tooltip"
		   title="Costo de venta: 20.000 💰"
		   disabled>
		   500k
	  </button>`
	);
	ventaRapidaMenu.insertAdjacentHTML(
		"beforeend",
		`
	  <button
		   id="buttonAdd1kk"
		   class="awesome-button"
		   style="margin:5px;"
		   data-toggle="tooltip"
		   title="Costo de venta: 40.000 💰"
		   disabled>
		   1kk
	  </button>`
	);
	ventaRapidaMenu.insertAdjacentHTML(
		"beforeend",
		`
	  <section
		   id=""
		   style="display: block;">
		   <p><small>Elegir duración</small></p>
		   <select
				id="SelectHora"
				size="1">

				<option value="1">2 h</option>
				<option value="2">8 h</option>
				<option value="3">24 h</option>
		   </select>
	  </section>`
	);

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

	/* Getting the element with the id "VentaRapidaMenuTitle" from the page. */
	let ventaRapidaMenuTitle = document.getElementById("VentaRapidaMenuTitle");
	/* Adding an event listener to the element with the id "VentaRapidaMenuTitle" from the page. When the
	  user clicks on the element, the function will be executed. The function will check if the element
	  with the id "VentaRapidaMenu" is visible or not. If it is visible, it will hide it. If it is hidden,
	  it will show it. */
	ventaRapidaMenuTitle.addEventListener("click", () => {
		if (ventaRapidaMenu.style.display == "none") {
			ventaRapidaMenu.style.display = "block";
		} else {
			ventaRapidaMenu.style.display = "none";
		}
	});

	/* Adding an event listener to the element with the id "buttonAdd50k". When the user clicks on the
	  element, the function will be executed. The function will set the value of the element with the id
	  "preis" to 50000 and will click on the element with the name "anbieten". */
	let add50k = document.getElementById("buttonAdd50k");
	add50k.addEventListener("click", () => {
		inputPrecio.value = 50000;
		inputDuracion.value = localStorage.SelectHora;
		botonVender.click();
	});
	/* Adding an event listener to the element with the id "buttonAdd100k". When the user clicks on the
	  element, the function will be executed. The function will set the value of the element with the id
	  "preis" to 100000 and will click on the element with the name "anbieten". */
	let add100k = document.getElementById("buttonAdd100k");
	add100k.addEventListener("click", () => {
		inputPrecio.value = 100000;
		botonVender.click();
	});
	/* Adding an event listener to the element with the id "buttonAdd200k". When the user clicks on the
	  element, the function will be executed. The function will set the value of the element with the id
	  "preis" to 200000 and will click on the element with the name "anbieten". */
	let add200k = document.getElementById("buttonAdd200k");
	add200k.addEventListener("click", () => {
		inputPrecio.value = 200000;
		inputDuracion.value = localStorage.SelectHora;
		botonVender.click();
	});

    let add250k = document.getElementById("buttonAdd250k");
	add250k.addEventListener("click", () => {
		inputPrecio.value = 250000;
		inputDuracion.value = localStorage.SelectHora;
		botonVender.click();
	});
	/* Adding an event listener to the element with the id "buttonAdd500k". When the user clicks on the
	  element, the function will be executed. The function will set the value of the element with the id
	  "preis" to 500000 and will click on the element with the name "anbieten". */
	let add500k = document.getElementById("buttonAdd500k");
	add500k.addEventListener("click", () => {
		inputPrecio.value = 500000;
		inputDuracion.value = localStorage.SelectHora;
		botonVender.click();
	});
	/* Adding an event listener to the element with the id "buttonAdd1kk". When the user clicks on the
	  element, the function will be executed. The function will set the value of the element with the id
	  "preis" to 1000000 and will click on the element with the name "anbieten". */
	let add1kk = document.getElementById("buttonAdd1kk");
	add1kk.addEventListener("click", () => {
		inputPrecio.value = 1000000;
		inputDuracion.value = localStorage.SelectHora;
		botonVender.click();
	});

	/* Getting the element with the id "CalcularRotativos" from the page. */
	let calcularRotativos = document.getElementById("CalcularRotativos");

	/* Adding HTML to the page. */
	calcularRotativos.insertAdjacentHTML(
		"beforeend",
		"<p>Puedes comprar los siguientes rotativos</p>"
	);
	calcularRotativos.insertAdjacentHTML(
		"beforeend",
		`
	  <section
		   style="
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;">
		   <section
				id="col1"
				style="
					 width: 50%;">
		   </section>
		   <section
				id="col2"
				style="
					 width: 50%;">
		   </section>
	  </section>`
	);

	/* Getting the elements with the id "col1" and "col2" from the page. */
	let col1 = document.getElementById("col1");
	let col2 = document.getElementById("col2");

	/* Creating a variable called text50k and setting it to a string. Then it is inserting the string into
	  the element with the id "col1". */
	let text50k = "<p>50k: " + Math.floor(oro / 50.0) + "</p>";
	col1.insertAdjacentHTML("beforeend", text50k);
	/* Creating a variable called text100k and setting it to a string. Then it is inserting the string into
	  the element with the id "col1". */
	let text100k = "<p>100k: " + Math.floor(oro / 100.0) + "</p>";
	col1.insertAdjacentHTML("beforeend", text100k);
	/* Creating a variable called text200k and setting it to a string. Then it is inserting the string into
	  the element with the id "col1". */
	let text200k = "<p>200k: " + Math.floor(oro / 200.0) + "</p>";
	col1.insertAdjacentHTML("beforeend", text200k);
	/* Creating a variable called text500k and setting it to a string. Then it is inserting the string into
	  the element with the id "col2". */
	let text500k = "<p>500k: " + Math.floor(oro / 500.0) + "</p>";
	col2.insertAdjacentHTML("beforeend", text500k);
	/* Creating a variable called text1kk and setting it to a string. Then it is inserting the string into
	  the element with the id "col2". */
	let text1kk = "<p>1kk: " + Math.floor(oro / 1000.0) + "</p>";
	col2.insertAdjacentHTML("beforeend", text1kk);

	/* Adding an event listener to the element with the id "CalcularRotativosTitle". When the user clicks
	  on the element, the function will be executed. The function will check if the element with the id
	  "CalcularRotativos" is visible or not. If it is visible, it will hide it. If it is hidden, it will
	  show it. */
	let calcularRotativosTitle = document.getElementById(
		"CalcularRotativosTitle"
	);
	calcularRotativosTitle.addEventListener("click", () => {
		if (calcularRotativos.style.display == "none") {
			calcularRotativos.style.display = "block";
		} else {
			calcularRotativos.style.display = "none";
		}
	});

	document.addEventListener("mouseup", () => {
		if (cajaVenta.children.length > 0) {
			add50k.disabled = false;
			add100k.disabled = false;
			add200k.disabled = false;
            add250k.disabled = false;
			add500k.disabled = false;
			add1kk.disabled = false;
		}
	});

	//Auto Compra/Venta
	// hace doble click a un objeto de los paquetes, 3 children indica el contenedor del item
	// document.getElementById("packages_wrapper").children[0].children[1].children[2].children[0].dispatchEvent(new MouseEvent("dblclick"))

	//       function Find(textContent) {
	//         let elements = document.getElementById("market_table").children[0].children[0].children;
	//         let elementsArray = [].slice.call(elements);
	//         for (let index = 0; index < elementsArray.length; index++) {
	//           let element = elementsArray[index];
	//           if (element.tagName === "TR" &&
	//               element.children[0].tagName === "TD") {
	//             console.log(element)
	//           }
	//         }
	//       }
}

/**
 * It adds a button to the auction house that buys all the food you can afford
 */
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

/**
 * Adds a button that merges all objects in your selected inventory
 */
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
                 <option>Casa de subastas</option>
                 <option>Expedición</option>
                 <option>Fundición</option>
                 <option>Jefe de la Mazmorra</option>
                 <option>Mazmorra</option>
                 <option>Mercado</option>
                 <option>Recompensa de la misión</option>
            </datalist>
            <div id="MercadoFavoritos" class="Favoritos"><h2 id="mensaje"></h2></div>
            <style>
                .panelBusqueda{
                    position: absolute;height: 41px;width: 408px;background: #ded2ad;left: 405px;top: -33px;
                }
                .Favoritos {
                    position: absolute; width: 388px; height: 395px; left: 405px; top: 8px; background: rgb(222, 210, 173); padding: 10px; display: block;overflow: scroll;overflow-x: hidden; display:none;
                }
                .Favoritos::-webkit-scrollbar {
                    width: 10px;
                }

                /* Track */
                .Favoritos::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                /* Handle */
                .Favoritos::-webkit-scrollbar-thumb {
                    background: #888;
                }

                /* Handle on hover */
                .Favoritos::-webkit-scrollbar-thumb:hover {
                   background: #555;
                }
            </style>
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
        let sh;
        console.log(sh)
        for (let element of url) {
            if(element.includes("sh") == true){
                sh = element
            }
        }
        console.log(sh)
        insertOnPage.afterend(menue_packages,`
            <button id="extenderPaquetes" class="awesome-button extederPaquetes" title="Presiona para abrir el menú de paquetes">+</button>
            <div id="menuBotonPaquetes" class="menuBotonPaquetes">
                <div class="icon-out"><a class="icon food-icon" href="index.php?mod=packages&f=7&fq=-1&qry=&page=1&`+sh+`" title="Ir a paquetes, Utilizable"></a></div>
            </div>
            <style>
                 .menuBotonPaquetes {
                    display: none;
                    position: absolute;
                    opacity: 1;
                    background: rgb(222, 210, 173);
                    top: 42px;
                    right: 4px;
                    padding: 10px;
                 }
                 #menuBotonPaquetes .icon-out {
                    float: left;
                 }
                 #menuBotonPaquetes .icon {
                    width: 25px;
                    height: 25px;
                    display: block;
                    cursor: pointer;
                 }
                 .food-icon {
                    background: transparent url(https://raw.githubusercontent.com/lpachecob/Gladiatus-Tools/main/main_buttons.png) -395px 0px no-repeat;
                 }
                 .extederPaquetes {
                    position: absolute;
                    right: -10px;
                    top: -3px;
                    height: 19px;
                    width: 21px;
                    color: white;
                    background: #8e2a2a;
                    border: none;
                }
            </style>
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


//////////////////////////////////////////////////////////////////////
/**
* run script
*/
GladiatusTools.Run();























