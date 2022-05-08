if (
	window.location.search.split("&")[0] == "?mod=guildMarket" &&
	window.location.search.split("&")[1] != "submod=control"
) {
	MarketHelps();
} else if (
	window.location.search.split("&")[0] == "?mod=guildMarket" &&
	window.location.search.split("&")[1] == "submod=control"
) {
	//comming soon
} else if (window.location.search.split("&")[0] == "?mod=auction") {
	AcutionHouseTools();
} else if (
	window.location.search.split("&")[0] == "?mod=forge" &&
	window.location.search.split("&")[1] == "submod=smeltery"
) {
	SmelteryTimeSaverExtension();
}

Menu();
autoGuardarOro();

function Menu(){
    let header_game = document.getElementById("header_game");
    header_game.insertAdjacentHTML(
        "beforeend",
        `
        <div class="dropdown" style="position: absolute; top: 157px; left: 90%;">
             <button class="dropbtn">Gladiatus Tools</button>
             <div class="dropdown-content" id="GladiatusToolsMenu">
                  <label>
                       <input type="checkbox"
                            id="NotificarOro"
                            style="color=white">
                            Notifica si tengo oro para guardar
                  </label>
                  <hr/>
                  <label>
                       <input type="checkbox"
                            id="GuardarOro"
                            style="color=white"
                            >
                            Guardar oro automaticamente
                       <input type=number
                            id="TriggerCantidadOro"
                            placeholder="oro maximo a acumular"
                            value="0"
                            title="Ingresa la cantidad de oro máxima que acumulara tu personaje antes de guardarlo \n\nUtilizar el formato que usa el juego:\n- 50.000 = 50k\n- 100.000 = 100k\n- 500.000 = 500k\n- 1000.000 = 1kk"
                            >
                  </label>
                  <hr/>
             </div>
        </div>
        <style>
             .dropbtn {
                  background-color: #154001;
                  color: white;
                  padding: 16px;
                  font-size: 12px;
                  border: none;
                  }
             .dropdown {
                  position: relative;
                  display: inline-block;
                  }

             .dropdown-content {
                  display: none;
                  position: absolute;
                  background-color: #f1f1f1;
                  min-width: 160px;
                  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                  z-index: 1;
                  }

             .dropdown-content a {
                  color: black;
                  padding: 12px 16px;
                  text-decoration: none;
                  display: block;
                  }

             .dropdown-content a:hover {background-color: #ddd;}

             .dropdown:hover .dropdown-content {display: block;}

             .dropdown:hover .dropbtn {background-color: #3e8e41;}
        </style>
        `
	);
    timeSaver();
}


function Notificaciones(){

}

function timeSaver() {

    function menu(){
        let menu = document.getElementById("GladiatusToolsMenu");
        menu.insertAdjacentHTML(
        "beforeend",
            `
            <label>
                 <input type="checkbox"
                      id="TimeSaverOff"
                      style="color=white">
                      Detén el bot si no estoy en expedicion, mazmorra,
            </label>
            <hr/>
            `);
    }

    if(document.getElementsByClassName("auto-settings")[0] =! undefined){
        console.log("sadsad")
    }
    function apagar(){
    let botonPlay = timeSaver.children[3];
        if (botonPlay.classList[2] == "show") {
            //bot desactivado
            botonPlay.click();
        }
    }
}


function autoGuardarOro() {

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

	let NotificarOro = document.getElementById("NotificarOro"); //.checked indica si está activo o no
	if (JSON.parse(localStorage.NotificarOro) == undefined) {
		localStorage.NotificarOro = NotificarOro.checked
	} else {
		NotificarOro.checked = JSON.parse(localStorage.NotificarOro);
	}
	NotificarOro.addEventListener("change", () => {
		localStorage.NotificarOro = NotificarOro.checked;
	})
	window.addEventListener("load", () => {
		if (document.getElementById("mmonetbar") != undefined && JSON.parse(localStorage.NotificarOro) == true) {
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
                <a href="game/index.php?mod=guildMarket">
                <div id="test" class="notification-box notification-info"><div class="icon"></div>` + mensaje + `</div>
                </a>
                <style>
                /* Notifications */
                     .notification-box {cursor: pointer;background-position: 15px center;background-repeat: no-repeat;box-shadow: 0 0 12px #000;color: #FFFFFF;margin: 0 0 6px;opacity: 0.9;padding: 5px 5px 5px 28px;width: 200px;white-space: pre-wrap;}
                     .notification-info {background-color: #2F96B4;border: 1px solid #267890;}
                <style>
                `)
				}
			}
		}
	});

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
	let items = document.getElementsByClassName("auction_bid_div");
	let oro = parseFloat(document.getElementById("sstat_gold_val").textContent);

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
			for (let i = 0; i < items.length; i++) {
				let costo = parseFloat(items[i].children[2].value);
				if (costo > oro) {
					let PujaDeAlguien;
					if (
						items[i].children[0].innerText.split("\n")[0] == "No hay pujas." ||
						items[i].children[0].innerText.split("\n")[0] ==
						"Ya hay pujas existentes."
					) {
						items[i].children[3].click();
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
	window.addEventListener("load", () => {
		if (document.getElementsByClassName("smelter-actions")[0] != undefined) {
			let inventario = document.getElementsByClassName("smelter-actions")[0];

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

			let btnFundicion = FindBtn("Iniciar función");
			let items = document.getElementsByClassName("ui-draggable");
			inventario.insertAdjacentHTML(
				"beforeend",
				`
               <button
					class="awesome-button"
					type="button"
					id="FundirTodo">
					Fundir Todo
			   </button>
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
		  `
			);

			let selectInventario = document.getElementById("SelectInventario");
			if (localStorage.InventarioFundicion == undefined) {
				localStorage.SelectHora = "Ⅰ";
				selectInventario.value = "Ⅰ";
			} else {
				selectInventario.value = localStorage.InventarioFundicion;
			}
			selectInventario.addEventListener("change", (event) => {
				localStorage.InventarioFundicion = selectInventario.value;
			});

			let inventoryTabs = document.getElementsByClassName("awesome-tabs");
			let inventorySelected;
			for (let index = 0; index < inventoryTabs.length; index++) {
				if (inventoryTabs[index].text == "Ⅳ") {
					inventorySelected = inventoryTabs[index];
				}
			}
			let btnFundirTodo = document.getElementById("FundirTodo");
			btnFundirTodo.addEventListener("click", () => {
				inventorySelected.click();
				btnFundicion.click();
				for (let index = 9; index < items.length; index++) {
					items[index].click();
				}
			});
		} else {
			console.log("time saver extension not installed");
		}
	});
}