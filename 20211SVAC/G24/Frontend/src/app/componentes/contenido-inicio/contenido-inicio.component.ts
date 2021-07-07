import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Errores from 'src/app/Backend/XML/Analizador/Excepciones/NodoErrores';
import tablaSimbolos from 'src/app/Backend/XML/Analizador/Simbolos/tablaSimbolos';
import tablaSimbolosXQuery from 'src/app/Backend/XQUERY/Analizador/Simbolos/tablaSimbolos';
import { InicioService } from 'src/app/servicios/inicio.service';
import * as Analizador from 'src/app/Backend/XML/Analizador/GramaticaXML';
import * as AnalizadorD from 'src/app/Backend/XML/Analizador/GramaticaXMLDescPRUEBA';
import * as AnalizarAscXpath from 'src/app/Backend/XPATH/GramaticaXPath'
import * as AnalizarDscXpath from 'src/app/Backend/XPATH/Analizador/GramaticaXPathDesc'
import * as Gramatical from 'src/app/Backend/XML/Analizador/XMLgraph'
import * as GramaticalDes from 'src/app/Backend/XML/Analizador/XMLgraphDesc'
import * as Optimizacion from 'src/app/Backend/Optimizacion/grammar'
import * as AnalizadorXQUERY from 'src/app/Backend/XQUERY/Analizador/GrammXQuery'
import TreeOptimo from 'src/app/Backend/Optimizacion/Simbolo/Arbol'
import Simbolo from 'src/app/Backend/XML/Analizador/Simbolos/Simbolo';
import SimboloXQuery from 'src/app/Backend/XQUERY/Analizador/Simbolos/Simbolo';
import Tipo, { tipoDato } from 'src/app/Backend/XML/Analizador/Simbolos/Tipo';
import Arbol from 'src/app/Backend/XML/Analizador/Simbolos/Arbol';
import ArbolXpath from 'src/app/Backend/XPATH/Analizador/Simbolos/Arbol';
import ArbolXQUERY from 'src/app/Backend/XQUERY/Analizador/Simbolos/Arbol';
import nodoAST from 'src/app/Backend/XML/Analizador/Abstracto/nodoAST';
import nodoAst from 'src/app/Backend/XPATH/Analizador/Abstracto/nodoAST'
import { Instruccion } from 'src/app/Backend/XPATH/Analizador/Abstracto/Instruccion';

import NodoErrores from 'src/app/Backend/XML/Analizador/Excepciones/NodoErrores';
import Objeto from 'src/app/Backend/XML/Analizador/Expresiones/Objeto';

import { reporteTabla } from 'src/app/Backend/XML/Analizador/Reportes/reporteTabla';
import Identificador from 'src/app/Backend/XPATH/Analizador/Expresiones/Identificador';
import BarrasNodo from 'src/app/Backend/XPATH/Analizador/Instrucciones/BarrasNodo';
import Axes from 'src/app/Backend/XPATH/Analizador/Funciones/Axes';
import 'codemirror/mode/htmlmixed/htmlmixed';
import { ViewChild } from '@angular/core';
import Declaracion from 'src/app/Backend/Optimizacion/Instrucciones/Declaracion';
import Funcion from 'src/app/Backend/Optimizacion/Instrucciones/Funcion';
import { reporteOp } from 'src/app/Backend/Optimizacion/Reportes/reporteOp';
import ForSimple from 'src/app/Backend/XQUERY/Analizador/Instrucciones/ForSimple';
import { collectExternalReferences } from '@angular/compiler';
import Let from 'src/app/Backend/XQUERY/Analizador/Instrucciones/Let';
import { element } from 'protractor';
import If from 'src/app/Backend/XQUERY/Analizador/Instrucciones/If';
import Funciones from 'src/app/Backend/XQUERY/Analizador/Instrucciones/Funciones';
import Llamada from 'src/app/Backend/XQUERY/Analizador/Instrucciones/Llamada';
import Number from 'src/app/Backend/XQUERY/Analizador/Funciones/Number';
import StringF from 'src/app/Backend/XQUERY/Analizador/Funciones/String';
import Upper from 'src/app/Backend/XQUERY/Analizador/Funciones/Upper';
import Lower from 'src/app/Backend/XQUERY/Analizador/Funciones/Lower';
import Substring from 'src/app/Backend/XQUERY/Analizador/Funciones/Substring';
import IfFuncionAnidado from 'src/app/Backend/XQUERY/Analizador/Instrucciones/IfFuncionAnidado';
import ForToSimple from 'src/app/Backend/XQUERY/Analizador/Instrucciones/ForToSimple';
import ForToCompuesto from 'src/app/Backend/XQUERY/Analizador/Instrucciones/ForToCompuesto';


export let listaErrores: Array<NodoErrores>;
export let listainstrucciones: Array<Instruccion[]>
export let Ambito: String;
export let Ambito2: String;
export let tabsim: Map<String, String>
export var contenidocd3 = ""
export let ArbolGlobalReporte: reporteTabla[];
export let ReporteOptimizacion: reporteOp[];
export let cd3XPath: String[];
export let cd3XQuery: String[];
export let Funcionescd3: String[];
export var TreeAsc: Arbol;
export var TreeXQuery: ArbolXQUERY;
@Component({
  selector: 'app-contenido-inicio',
  templateUrl: './contenido-inicio.component.html',
  template: `<codemirror [(ngModel)]="code" [config]="{...}" placeholder="Here is the code placeholder"></codemirror>`,
  styleUrls: ['./contenido-inicio.component.css'],
})

export class ContenidoInicioComponent implements OnInit {
  public textoEntrada;
  @ViewChild('editor') editor;
  codeMirrorOptions: any = {
    theme: '3024-night',
    mode: 'application/xml',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: false,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    color: "#fe3",
    matchBrackets: true,
    lint: true

  };
  codeMirrorOptions2: any = {
    theme: '3024-night',
    mode: 'application/typescript',
    readOnly: true,
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: false,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true

  };
  constructor(private inicioSrv: InicioService, private dialog: MatDialog) {
    this.code = 'asd';

  }
  tablaGlobal: tablaSimbolos = new tablaSimbolos();
  code = '';
  contenido = '';
  ngOnInit(): void {
    console.log(document.querySelector('#codigo'))
    /* var editor = CodeMirror.fromTextArea(document.querySelector('#editor'), {
       mode: "javascript",
       lineNumbers: true,
   });
   editor.save()*/
  }
  ngAfterViewInit(): void {

    this.editor.getEditor().setOptions({
      showLineNumbers: true,
      tabSize: 2
    });

    this.editor.mode = 'javascript';
    this.editor.value = `function testThis() {
  console.log("it's working!")
}`

    this.editor.getEditor().commands.addCommand({
      name: "showOtherCompletions",
      bindKey: "Ctrl-.",
      exec: function (editor) {

      }
    })

    this.data = JSON.parse(localStorage.getItem('contenido'));
    if (this.data != '' || this.data != undefined) {
      this.mostrarContenido(this.data.console, 'consolas');
    }
  }
  data;
  getValue() {
    console.log(this.editor.value)
    console.log(eval(this.editor.value));
  }
  colocarConsola(res, texto) {
    const dataObject = {
      text: 'asd',
      console: 'res',
    };
    localStorage.setItem('consulta', JSON.stringify(dataObject));
  }
  getConsola() {
    this.data = JSON.parse(localStorage.getItem('contenido'));
    if (this.data != '' || this.data != undefined) {
      this.mostrarContenido(this.data.text, 'contenido');
    }
  }

  /*A R B O L  A S C E N D E N T E */
  interpretarContenido(texto: string) {
    listaErrores = new Array<Errores>();
    if (texto == null) return document.write('Error');

    try {
      const analizador = Analizador;
      const objetos = analizador.parse(texto);

      TreeAsc = new Arbol([objetos]);
      TreeAsc.settablaGlobal(this.tablaGlobal);

      //  PARA GUARDAR DATOS
      // TODO FOR INTERPRETAR
      for (let i of TreeAsc.getinstrucciones()) {
        if (i instanceof Objeto) {
          var objetito = i.interpretar(TreeAsc, this.tablaGlobal); //retorna simbolo
          //this.tablaGlobal.setVariable(objetito)
        }
      }
      console.log(this.tablaGlobal);

      var atributos = "";
      /***************************************************************************************************
     ************************* MANEJO DE CODIGO 3 DIRECCIONES ASCENDENTE *******************************
     * *************************************************************************************************
    */
      contenidocd3 = ""
      TreeAsc.codigo3d.push("int main(){\n");


      for (let i of TreeAsc.getinstrucciones()) {
        if (i instanceof Objeto) {
          var lista = i.codigo3D(TreeAsc, this.tablaGlobal); //retorna simbolo
          this.tablaGlobal.setVariable(lista);
        }
      }




      /* **********************L L E N A D O    T A B L A    D E    S I M B O L O S************************* */
      Ambito = "Global"
      tabsim = new Map<String, String>();
      for (var key of this.tablaGlobal.tablaActual) {

        if (key.getvalor() instanceof tablaSimbolos) {
          var Reporte = new reporteTabla(key.getidentificador(), "Objeto", Ambito, "Objeto", key.getLinea(), key.getColumna(), key.setcd3Value());
          TreeAsc.listaSimbolos.push(Reporte);
          if (key.getAtributo().size != 0) {
            for (var [key2, value2,] of key.getAtributo()) {
              var Reporte = new reporteTabla(key2, "Atributo", key.getidentificador(), value2, key.getAtributoLinea(), key.getAtributoColumna(), key.get3DAtributo());
              TreeAsc.listaSimbolos.push(Reporte);
            }
          }

          tabsim.set(Ambito, key.getidentificador())
          Ambito = key.getidentificador();
          this.ReportSimbolos(key.getvalor(), TreeAsc)
        } else {
          var Reporte = new reporteTabla(key.getidentificador(), "Objeto", key.getidentificador(), key.getvalor(), key.getLinea(), key.getColumna(), key.setcd3Value());
          TreeAsc.listaSimbolos.push(Reporte);
        }
      }
      ArbolGlobalReporte = TreeAsc.getSimbolos()
      tabsim.clear();
      /***************************************************************************************************************
       * ***********************************************A R B O L ****************************************************
       **************************************************************************************************************/
      var init = new nodoAST("RAIZ");
      var instrucciones = new nodoAST("HIJOS");
      for (let i of TreeAsc.getinstrucciones()) {
        instrucciones.agregarHijoAST(i.getNodo());

      }

      for (let i of TreeAsc.getinstrucciones()) {

        if (i instanceof Errores) {
          listaErrores.push(i);
        }
      }

      init.agregarHijoAST(instrucciones);

      let sim_string = JSON.stringify(init);
      localStorage.setItem("simbolos", sim_string);
      const gramat = Gramatical;
      const gramar = gramat.parse(texto);
      localStorage.setItem("gramatica", gramar);
      console.log(listaErrores)

      let errores = JSON.stringify(listaErrores);
      localStorage.setItem("errores", errores);




      var reco = TreeAsc.getSimbolos();
      let tabla = JSON.stringify(reco);
      localStorage.setItem("symbol", tabla);

      /**M A N E J O   E R R O R  S I N T A C T I C O */
      let errorsito = Analizador;
      let errorts = errorsito.parse(texto);


      //console.log(listaErrores);
    } catch (error) {
      if (error instanceof ReferenceError) {
        let errores = JSON.stringify(listaErrores);
        localStorage.setItem("errores", errores);
      }
    } finally {
      let errores = JSON.stringify(listaErrores);
      localStorage.setItem("errores", errores);
    }


  }
  ReportSimbolos(tablaGlobal: tablaSimbolos, Tree: Arbol) {
    for (var key of tablaGlobal.tablaActual) {

      if (key.getvalor() instanceof tablaSimbolos) {
        if (Ambito === key.getidentificador().toString()) {
          for (var [key2, value2,] of tabsim) {

            if (value2 === key.getidentificador()) {
              Ambito = key2
            }

          }
        }
        var Reporte = new reporteTabla(key.getidentificador(), "Objeto", Ambito, "Objeto", key.getLinea(), key.getColumna(), key.setcd3Value());
        Tree.listaSimbolos.push(Reporte);

        for (var [key2, value2,] of tabsim) {
          if (Ambito != key.getidentificador().toString()) {
            if (key2 === Ambito && value2 === key.getidentificador()) {
              Ambito = value2
            } else {
              tabsim.set(Ambito, key.getidentificador())
              Ambito = key.getidentificador();
            }

          }
        }
        if (key.getAtributo().size != 0) {
          for (var [key2, value2,] of key.getAtributo()) {
            var Reporte = new reporteTabla(key2, "Atributo", key.getidentificador(), value2, key.getAtributoLinea(), key.getAtributoColumna(), key.get3DAtributo());
            Tree.listaSimbolos.push(Reporte);
          }
        }
        this.ReportSimbolos(key.getvalor(), Tree)
      } else {
        var Reporte = new reporteTabla(key.getidentificador(), "Objeto", Ambito, key.getvalor(), key.getLinea(), key.getColumna(), key.setcd3Value());
        Tree.listaSimbolos.push(Reporte);
      }
    }
  }

  /**%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
   * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% FINALIZAR CD3 MOSTRAR EN PANTALLA %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
   * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
   */
  finalizarCD3() {
    //ES VARIABLES AL INICIO
    contenidocd3 = "#include <stdio.h>\n#include<math.h>\n"
    let bandera: Boolean = false;
    try {

      if (TreeAsc.codigo3d.length != 0) {
        for (let x = 0; x < TreeAsc.contadort; x++) {
          if (x == 0) { contenidocd3 = contenidocd3 + "double " }
          else if (x % 20 == 0) { contenidocd3 = contenidocd3 + "\n" }
          contenidocd3 = contenidocd3 + "$t" + x;
          if (TreeAsc.contadort - 1 !== x) { contenidocd3 = contenidocd3 + "," }

        }

        if (TreeXQuery.codigo3d.length != 0) {
          contenidocd3 += ";\n"
          for (let x = TreeAsc.contadort; x < TreeXQuery.contadort; x++) {
            if (x == 0) { contenidocd3 = contenidocd3 + "double " }
            else if (x % 20 == 0) { contenidocd3 = contenidocd3 + "\n" }
            contenidocd3 = contenidocd3 + "$t" + x;
            if (TreeXQuery.contadort - 1 !== x) { contenidocd3 = contenidocd3 + "," }

          }
        }
        bandera = true;
        if (TreeAsc.contadort !== 0) { contenidocd3 = contenidocd3 + ";\n" }
        TreeAsc.Encabezadocodigo3d.forEach(element => {
          contenidocd3 += element + "\n"
        });
      }

      //ITERA PARA EL CONTENIDO DEL MAIN
      if (TreeAsc.codigo3d != null) {
        TreeAsc.codigo3d.forEach(element => {
          contenidocd3 += element + "\n"
        });

      }
      try {
        cd3XPath.forEach(element => {
          contenidocd3 += element + "\n"
        });
      } catch (error) {

      }
      if (TreeXQuery.codigo3d != null) {
        
        TreeXQuery.codigo3d.forEach(element => {
          contenidocd3 += element + "\n"
        });
      }
    } catch (error) {
      //CONTENIDO DE XQUERY

      if (TreeXQuery.codigo3d != null) {


        if (bandera == false) {
          for (let x = 0; x < TreeXQuery.contadort; x++) {
            if (x == 0) { contenidocd3 = contenidocd3 + "double " }
            else if (x % 20 == 0) { contenidocd3 = contenidocd3 + "\n" }
            contenidocd3 = contenidocd3 + "$t" + x;
            if (TreeXQuery.contadort - 1 !== x) { contenidocd3 = contenidocd3 + "," }

          }
          if (TreeXQuery.contadort !== 0) { contenidocd3 = contenidocd3 + ";\n" }
          TreeXQuery.Encabezadocodigo3d.forEach(element => {
            contenidocd3 += element + "\n"
          });
          contenidocd3 += "\nint main(){\n"
        }

        TreeXQuery.codigo3d.forEach(element => {
          contenidocd3 += element + "\n"
        });
      }
    }
    if (Funcionescd3.length != 0) {
      contenidocd3 += "return 1;\n}\n"
      Funcionescd3.forEach(element => {
        contenidocd3 += element + "\n"
      });
    } else {
      contenidocd3 += contenidocd3 + "return 1;\n}"
    }
    this.mostrarContenido(contenidocd3, 'cdirecciones');
  }

  /*A R B O L  D E S C E N D E N T E */

  interpretarContenidoDesc(texto: string) {
    listaErrores = new Array<Errores>();
    if (texto == null) return document.write('Error');
    const analizador = AnalizadorD;
    const objetos = analizador.parse(texto);
    const tablaGlobal: tablaSimbolos = new tablaSimbolos();
    var Tree: Arbol = new Arbol([objetos]);
    Tree.settablaGlobal(tablaGlobal);
    console.log(tablaGlobal);
    //  PARA GUARDAR DATOS

    // TODO FOR INTERPRETAR

    var init2 = new nodoAST("RAIZ");
    var instrucciones = new nodoAST("HIJOS");
    for (let i of Tree.getinstrucciones()) {
      instrucciones.agregarHijoAST(i.getNodo());

    }
    for (let i of Tree.getinstrucciones()) {
      /*if (i instanceof Errores) {
        listaErrores.push(i);
      }*/
    }

    init2.agregarHijoAST(instrucciones);

    let sim_string = JSON.stringify(init2);
    localStorage.setItem("simbolos1", sim_string);

    /***************************************************************************************************
     ************************* MANEJO DE CODIGO 3 DIRECCIONES DESCENDENTE ******************************
     * *************************************************************************************************
    */

    var contenidocd3 = "#include <stdio.h>\n#include<math.h>\n"

    Tree.codigo3d.push("int main(){\n");


    for (let i of Tree.getinstrucciones()) {
      if (i instanceof Objeto) {
        var lista = i.codigo3D(Tree, this.tablaGlobal); //retorna simbolo
        this.tablaGlobal.setVariable(lista);
      }
    }
    //ES VARIABLES AL INICIO
    for (let x = 0; x < Tree.contadort; x++) {
      if (x == 0) { contenidocd3 = contenidocd3 + "double " }
      else if (x % 20 == 0) { contenidocd3 = contenidocd3 + "\n" }
      contenidocd3 = contenidocd3 + "t" + x;
      if (Tree.contadort - 1 !== x) { contenidocd3 = contenidocd3 + "," }

    }
    if (Tree.contadort !== 0) { contenidocd3 = contenidocd3 + ";\n" }
    Tree.Encabezadocodigo3d.forEach(element => {
      contenidocd3 += element + "\n"
    });
    //ITERA PARA EL CONTENIDO DEL MAIN
    Tree.codigo3d.forEach(element => {
      contenidocd3 += element + "\n"
    });

    const gramat = GramaticalDes;
    const gramar = gramat.parse(texto);
    localStorage.setItem("gramatica1", gramar);


    //console.log(gramar);
  }

  /*********************************************************************************************************/
  /***********************************************XPATH ASCENDENTE******************************************/
  /*********************************************************************************************************/


  EjecutarAsc(texto: string) {

    // if (texto == null) return document.write('Error');
    cd3XPath = null;
    cd3XPath = [];
    const analizador = AnalizarAscXpath;
    let objetos = analizador.parse(texto);
    let ast = new ArbolXpath(analizador.parse(texto)); //ejecucion
    console.log("lista ins xpath")
    console.log(listainstrucciones)
    var Tree: ArbolXpath = new ArbolXpath([objetos]);
    var tabla = new tablaSimbolos();                    //ejecucion
    ast.settablaGlobal(tabla);                        //ejecucion
    var tablita = this.tablaGlobal;
    var c = 0;
    var consolita = ''

    for (var key of tablita.getTabla()) {//SIMBOLOS
      if (key.getidentificador() == 'xml') {
        tablita = key.getvalor()
      }
    }
    console.log(ast.getinstrucciones().length)
    for (let index = 0; index < ast.getinstrucciones().length; index++) {
      const instructions = ast.getinstrucciones()[index];

      instructions.forEach(element => {
        c++
        console.log(element)
        if (element instanceof BarrasNodo) {
          console.log("es barranodo");

          var resultador = element.interpretar(Tree, tablita);
          if (resultador instanceof tablaSimbolos) {
            tablita = resultador
            if (c == instructions.length) {
              if (TreeAsc != null) {
                consolita += this.recorrerTabla(tablita, TreeAsc);
                consolita += "\n"
              }
            }
          }
          else { //VIENE STRING
            consolita += resultador + "\n"
          }
        }
      });
      c = 0;
      console.log("SIGUIENTE")
    }



    this.mostrarContenido(consolita, 'resultado');


  }

  ArbolAscAST(texto: string) {
    if (texto == null) return document.write('Error');
    const analizador = AnalizarDscXpath;
    const objetos = analizador.parse(texto);
    var Tree: ArbolXpath = new ArbolXpath([objetos]);
    //GRAFICAS
    var instrucciones = new nodoAst("INSTRUCCIONES");
    var contador = 0;

    for (let i of Tree.getinstrucciones()) {
      this.ciclo(i, contador, instrucciones)
    }

    let sim_string = JSON.stringify(instrucciones);
    localStorage.setItem("astpath", sim_string);
    //TERMINA GRAFICAS
  }

  /*ESTE MUESTRA LOS CICLOS PARA COLOCAR EL ARBOL AST CON GETNODO*/
  ciclo(i: any, numero: number, instruc: nodoAst) {
    if (i[numero] != null) {

      if (i[numero] instanceof BarrasNodo) {
        let temp: BarrasNodo = i[numero]

        instruc.agregarHijoAST(temp.getNodosAST())
      }
      if (i[numero] instanceof Axes) {
        let temp: Axes = i[numero]
        instruc.agregarHijoAST(temp.getNodosAST())
      }
      numero++
      this.ciclo(i, numero, instruc);
    }
  }
  /*********************************************************************************************************/
  /***********************************************XPATH DESCENDENTE*****************************************/
  /*********************************************************************************************************/
  EjecutarDesc(texto: string) {
    if (texto == null) return document.write('Error');
    const analizador = AnalizarDscXpath;
    const objetos = analizador.parse(texto);
    var Tree: ArbolXpath = new ArbolXpath([objetos]);



    var instrucciones = new nodoAst("INSTRUCCIONES");
    var contador = 0;


    for (let i of Tree.getinstrucciones()) {
      this.ciclo(i, contador, instrucciones)
    }


    let sim_string = JSON.stringify(instrucciones);
    localStorage.setItem("astpath", sim_string);
  }
  /****************************************************************************************************************/

  textoEsperado = '';
  textInputChange(fileInputEvent: any) {
    var archivo = fileInputEvent.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = (e) => {
      var contenido = e.target.result;
      this.mostrarContenido(contenido, 'contenido');
    };
    lector.readAsText(archivo);
  }


  mostrarContenido(contenido, identificador) {
    var elemento = document.getElementById(identificador);
    elemento.innerHTML = contenido;
  }

  generarAst() {
    this.inicioSrv.graficarAst().subscribe((res) => {
      if (res.msg == false) {
        alert('ALGO FALLO EN EL GRAFICO');
      } else {
        this.presentAlert();
      }
    });
  }
  presentAlert() {
    // #docregion focus-restoration
    this.dialog.open(Pruebas, {});
  }
  /**
   * *********************************RECORRER TABLA PARA XPATH*************************************
   * @param t 
   * @returns 
   */
  recorrerTabla(t: tablaSimbolos, arbol: Arbol) {
    var salida = ''
    for (var key of t.tablaActual) {

      var listaobjetitos = "";

      let objetos = key.getvalor();
      if (objetos instanceof tablaSimbolos) {
        for (var key3 of objetos.tablaActual) {
          listaobjetitos += `${key3.getidentificador()}, `
        }
        //  let recorrido=
        let atributos = ""

        /**@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
         * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ IMPRIMIR DATOS CD3 XPATH @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
         * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
         */

        let etiqueta1 = "<" + key.getidentificador()
        this.generarEtiquetascd3("<" + key.getidentificador(), arbol);
        if (key.getAtributo().size != 0) {
          for (var [key2, value2,] of key.getAtributo()) {
            etiqueta1 += " " + key2 + "=" + value2
            this.generarEtiquetascd3(" " + key2 + "=", arbol);
            let atrib = key.get3DAtributo()
            this.printcd3Simple(atrib, arbol, key2);
          }
        }
        etiqueta1 += ">"
        this.generarEtiquetascd3(">", arbol);
        cd3XPath.push(`printf("%c",10);`);
        let etiqueta2 = "</" + key.getidentificador() + ">"
        salida += etiqueta1 + "\n" + this.recorrerTabla(objetos, arbol) + etiqueta2 + "\n";
        this.generarEtiquetascd3(etiqueta2, arbol);
        cd3XPath.push(`printf("%c",10);`);
      } else {
        let atributos = ""
        this.generarEtiquetascd3("<" + key.getidentificador(), arbol);
        if (key.getAtributo().size != 0) {
          for (var [key2, value2,] of key.getAtributo()) {
            atributos += " " + key2 + "=" + value2
            this.generarEtiquetascd3(" " + key2 + "=", arbol);
            let atrib = key.get3DAtributo()
            this.printcd3Simple(atrib, arbol, key2);
          }
        }
        let contain = key.setcd3Value()
        this.generarEtiquetascd3(">", arbol);
        this.printcd3Simple(contain, arbol, key.getidentificador());
        salida += "<" + key.getidentificador() + atributos + ">"
        salida += objetos.replaceAll("%20", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&apos;", "'").replaceAll("&quot;", "\"");
        let etiqueta2 = "</" + key.getidentificador() + ">"
        salida += etiqueta2 + "\n"
        this.generarEtiquetascd3(etiqueta2, arbol);
        cd3XPath.push(`printf("%c",10);`);
      }
    }
    return salida;

  }
  /**
   * 
   * @param contenido 
   * @param arbol 
   */
  printcd3Simple(contenido: String, arbol: Arbol, identificador: String) {
    cd3XPath.push(`//***print  ${identificador}****`)
    let countprint = arbol.getContadort();
    cd3XPath.push(`$t${countprint}=stack[(int)${contenido}]; `);
    cd3XPath.push(`$t0= $t${countprint}; `);
    cd3XPath.push("imprimirString();");

  }
  /**$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
   * *****************************************GENERACION DE <ETIQUTA></ETIQUETA>***********************
   * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
   * @param contenido 
   */
  generarEtiquetascd3(contenido: String, arbol: Arbol) {
    let stackID = arbol.getSTACK();
    let contadorID = arbol.getContadort(); //temporales
    cd3XPath.push(`// declaracion para imprimir etiquetas ${contenido}`);
    cd3XPath.push(`$t${contadorID}=sp+${stackID};`);
    let data: string = contenido + "";
    let estado = 0;
    for (let x = 0; x < data.length; x++) {
      const iterator = data[x];
      switch (estado) {
        case 0: {
          if (iterator == "\\") { estado = 1; continue; }
          cd3XPath.push(`//agregamos el string al heap ${iterator}`);
          cd3XPath.push("$t0=hp;");

          cd3XPath.push("$t1=" + iterator.charCodeAt(0) + ";");
          cd3XPath.push("guardarString();");
          break;
        }
        case 1:
          {
            let assci = 0;
            if (iterator == "n") { assci = 10; }
            else if (iterator == "\"") { assci = 34; }
            else if (iterator == "\\") { assci = 92 }
            else if (iterator == "r") { assci = 10 }
            else if (iterator == "t") { assci = 9; }
            else {
              cd3XPath.push("//agregamos el string al heap");
              cd3XPath.push("$t0=hp;");

              cd3XPath.push("$t1=" + 34 + ";");
              cd3XPath.push("guardarString();");
              cd3XPath.push("//agregamos el string al heap");
              cd3XPath.push("$t0=hp;");

              cd3XPath.push("$t1=" + iterator.charAt(0) + ";");
              cd3XPath.push("guardarString();");
            }
            cd3XPath.push("//agregamos el string al heap");
            cd3XPath.push("$t0=hp;");

            cd3XPath.push("$t1=" + assci + ";");
            cd3XPath.push("guardarString();");
            estado = 0;
            break;
          }
      }

    }
    cd3XPath.push("$t0=hp;");
    cd3XPath.push("$t1=-1;");
    cd3XPath.push("guardarString();");
    const contadort = arbol.getContadort();
    cd3XPath.push("$t" + contadort + "=hp-" + (data.length + 1) + ";");
    cd3XPath.push(`stack[(int)$t${contadorID}]= $t${contadort};`);
    cd3XPath.push("//***print****")
    let countprint = arbol.getContadort();
    cd3XPath.push(`$t${countprint}=stack[(int)$t${contadorID}]; `);
    cd3XPath.push(`$t0= $t${countprint}; `);
    cd3XPath.push("imprimirString();");

  }

  /*********************************************************************************************************/
  /***********************************************X  Q  U  E  R  Y*****************************************/
  /*********************************************************************************************************/

  InterpretarXQUERY(texto: string) {
    const analizador = AnalizadorXQUERY;
    let objetos = analizador.parse(texto);
    let ast = new ArbolXQUERY(analizador.parse(texto)); //ejecucion
    console.log("aqui viene la lista de instrucciones")
    console.log(listainstrucciones)
    TreeXQuery = new ArbolXQUERY([objetos]);
    var tabla = new tablaSimbolosXQuery();                    //ejecucion
    console.log(TreeXQuery);
    var cadena = ""
    var consola = ""
    try {
      TreeXQuery.setContadort(TreeAsc.contadort)
      TreeXQuery.setEtiqueta(TreeAsc.getEtiqueta())
      TreeXQuery.setStack(TreeAsc.getSTACK())
    } catch (error) {
    }
    for (var key of this.tablaGlobal.getTabla()) {//SIMBOLOS
      if (key.getidentificador() == 'xml') {
        this.tablaGlobal = key.getvalor()
      }
    }
    Funcionescd3 = new Array<String>();
    for (let index = 0; index < ast.getinstrucciones().length; index++) {
      const instructions = ast.getinstrucciones()[index];
      if (instructions instanceof Funciones) {
        var func = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal)
      } else if (instructions instanceof Let) {
        var respuesta = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal)
        console.log(typeof respuesta)
        if (respuesta instanceof SimboloXQuery) {
          this.generarEtiquetasXQUERY("<" + respuesta.getidentificador() + ">", TreeAsc, TreeXQuery.codigo3d)
          this.printcd3SimpleXquery(respuesta.setcd3Value(), TreeAsc, respuesta.getidentificador(), TreeXQuery.codigo3d)
          this.generarEtiquetasXQUERY("</" + respuesta.getidentificador() + ">\n", TreeAsc, TreeXQuery.codigo3d);
          TreeXQuery.codigo3d.push(`printf("%c",10);`);
          cadena += "<" + respuesta.getidentificador() + ">" + respuesta.getvalor() + "</" + respuesta.getidentificador() + ">\n"
        } else if (respuesta instanceof Array) {
          respuesta.forEach(element => {
            if (element instanceof Simbolo) {
              this.generarEtiquetasXQUERY("<" + element.getidentificador() + ">", TreeAsc, TreeXQuery.codigo3d)
              this.printcd3SimpleXquery(element.setcd3Value(), TreeAsc, element.getidentificador(), TreeXQuery.codigo3d)
              this.generarEtiquetasXQUERY("</" + element.getidentificador() + ">\n", TreeAsc, TreeXQuery.codigo3d);
              TreeXQuery.codigo3d.push(`printf("%c",10);`);
              cadena += "<" + element.getidentificador() + ">" + element.getvalor() + "</" + element.getidentificador() + ">\n"
            } else {
              cadena += element.getvalor() + "\n";
            }
          });
        } else if (respuesta instanceof tablaSimbolos) {
          if (TreeAsc != null) {
            cadena += this.recorrerTablaXquery(respuesta, TreeAsc);
            cadena += "\n"
          }

        } else {
          console.log("de aqui soy")
          cadena += respuesta
        }

      } else if (instructions instanceof ForToSimple) {
        var theforto = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        cadena = theforto.toString();

      } else if (instructions instanceof ForToCompuesto) {
        var thefortoC = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        cadena = thefortoC.toString();

      } else if (instructions instanceof Number) {
        var thenumber = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        cadena = thenumber;

      } else if (instructions instanceof StringF) {
        var thest = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        cadena = thest;

      } else if (instructions instanceof Upper) {
        var theuper = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        cadena = theuper;

      } else if (instructions instanceof Lower) {
        var thelower = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        cadena = thelower;

      } else if (instructions instanceof Substring) {
        var thesubs = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        cadena = thesubs;

      } else if (instructions instanceof IfFuncionAnidado) {
        var theifani = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        console.log("hola estamos en if anidado")

        //cadena = theifani;

      } else if (instructions instanceof ForSimple) {
        var respuesta: any = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
        if (respuesta instanceof SimboloXQuery) {
          cadena += respuesta.getvalor()
        } else if (respuesta instanceof Array) {
          respuesta.forEach(element => {
            if (element instanceof Simbolo) {
              this.generarEtiquetasXQUERY("<" + element.getidentificador() + ">", TreeAsc, TreeXQuery.codigo3d)
              this.printcd3SimpleXquery(element.setcd3Value(), TreeAsc, element.getidentificador(), TreeXQuery.codigo3d)
              this.generarEtiquetasXQUERY("</" + element.getidentificador() + ">\n", TreeAsc, TreeXQuery.codigo3d);
              TreeXQuery.codigo3d.push(`printf("%c",10);`);
              cadena += "<" + element.getidentificador() + ">" + element.getvalor() + "</" + element.getidentificador() + ">\n"
            } else {
              cadena += element.getvalor() + "\n";
            }
          });
        } else if (respuesta instanceof tablaSimbolos) {
          if (TreeAsc != null) {

            cadena += this.recorrerFunciones(respuesta, TreeAsc, TreeXQuery.codigo3d);
            cadena += "\n"
          }

        } else {
          cadena = <string><unknown>instructions.respuesta

        }
      } else if (instructions instanceof Llamada) {
        var call = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal)
        TreeXQuery.codigo3d.push(instructions.identificador + "();")

        Funcionescd3.push(instructions.identificador + "(){")
        if (call instanceof SimboloXQuery) {

          cadena += call.getvalor()
          if (call.getvalor() === "1") {
            var c1 = TreeXQuery.getContadort()
            Funcionescd3.push("//***Print Number****")
            Funcionescd3.push("$t" + c1 + "=hp;"); // guardara el inicio de la cadena
            Funcionescd3.push("$t2=" + 1 + ";");
            Funcionescd3.push("NumberToString();");
            Funcionescd3.push("$t0=hp;");
            Funcionescd3.push("$t1=-1;");
            Funcionescd3.push("guardarString();");
            Funcionescd3.push("$t0= $t" + c1 + ";");
            Funcionescd3.push(`imprimirString();`);
            Funcionescd3.push(`printf("%c",10);`);
          }
        } else if (call instanceof Array) {
          call.forEach(element => {
            if (element instanceof Simbolo) {
              this.generarEtiquetasXQUERY("<" + element.getidentificador() + ">", TreeAsc, Funcionescd3)
              this.printcd3SimpleXquery(element.setcd3Value(), TreeAsc, element.getidentificador(), Funcionescd3)
              this.generarEtiquetasXQUERY("</" + element.getidentificador() + ">\n", TreeAsc, Funcionescd3);
              TreeXQuery.codigo3d.push(`printf("%c",10);`);
              cadena += "<" + element.getidentificador() + ">" + element.getvalor() + "</" + element.getidentificador() + ">\n"
            } else {
              cadena += element.getvalor() + "\n";
            }
          });
        } else if (call instanceof tablaSimbolos) {
          if (TreeAsc != null) {
            cadena += this.recorrerFunciones(call, TreeAsc, Funcionescd3);
            cadena += "\n"
          }


        } else if (instructions instanceof If) {


          console.log("Enre al if")
          var abr: any = instructions.interpretar(TreeXQuery, tabla, this.tablaGlobal);
          console.log("loque trae abr")
          console.log(abr)
          if (abr instanceof SimboloXQuery) {
            cadena += abr.getvalor()
            console.log("entre a simbolosxquery")
          } else if (abr instanceof Array) {
            abr.forEach(element => {
              cadena += element.getvalor();
              console.log("entre a arrat")

            });
          } else if (abr instanceof tablaSimbolos) {
            if (TreeAsc != null) {
              console.log("entre a tabla simbolos")

              cadena += this.recorrerTablaXquery(abr, TreeAsc);
              cadena += "\n"
            }


          }
        } else {

          cadena += call
          if (call as Number) {
            var c1 = TreeXQuery.getContadort()
            Funcionescd3.push("//***Print Number****")
            Funcionescd3.push("$t" + c1 + "=hp;"); // guardara el inicio de la cadena
            Funcionescd3.push("$t2=" + call + ";");
            Funcionescd3.push("NumberToString();");
            Funcionescd3.push("$t0=hp;");
            Funcionescd3.push("$t1=-1;");
            Funcionescd3.push("guardarString();");
            Funcionescd3.push("$t0= $t" + c1 + ";");
            Funcionescd3.push(`imprimirString();`);
            Funcionescd3.push(`printf("%c",10);`);
          } else if (call == false || call === "false") {
            var L5 = TreeXQuery.getEtiqueta();
            var L6 = TreeXQuery.getEtiqueta();
            var L7 = TreeXQuery.getEtiqueta();
            Funcionescd3.push(`if(0==1) goto L${L5};`)
            Funcionescd3.push(`goto L${L6};`)
            Funcionescd3.push(`L${L5}:`)
            Funcionescd3.push(`printf("%c",116);`)
            Funcionescd3.push(`printf("%c",114);`)
            Funcionescd3.push(`printf("%c",117);`)
            Funcionescd3.push(`printf("%c",101);`)
            Funcionescd3.push(`goto L${L7};`)
            Funcionescd3.push(`L${L6}:`)
            Funcionescd3.push(`printf("%c",102);`)
            Funcionescd3.push(`printf("%c",97);`)
            Funcionescd3.push(`printf("%c",108);`)
            Funcionescd3.push(`printf("%c",115);`)
            Funcionescd3.push(`printf("%c",101);`)
            Funcionescd3.push(`L${L7}:`)
            Funcionescd3.push(`printf("%c",10);`)
          } else if (call == true || call === "true") {
            var L5 = TreeXQuery.getEtiqueta();
            var L6 = TreeXQuery.getEtiqueta();
            var L7 = TreeXQuery.getEtiqueta();
            Funcionescd3.push(`if(1==1) goto L${L5};`)
            Funcionescd3.push(`goto L${L6};`)
            Funcionescd3.push(`L${L5}:`)
            Funcionescd3.push(`printf("%c",116);`)
            Funcionescd3.push(`printf("%c",114);`)
            Funcionescd3.push(`printf("%c",117);`)
            Funcionescd3.push(`printf("%c",101);`)
            Funcionescd3.push(`goto L${L7};`)
            Funcionescd3.push(`L${L6}:`)
            Funcionescd3.push(`printf("%c",102);`)
            Funcionescd3.push(`printf("%c",97);`)
            Funcionescd3.push(`printf("%c",108);`)
            Funcionescd3.push(`printf("%c",115);`)
            Funcionescd3.push(`printf("%c",101);`)
            Funcionescd3.push(`L${L7}:`)
            Funcionescd3.push(`printf("%c",10);`)
          }
        }
        Funcionescd3.push("return 1;\n}")
      }

      this.mostrarContenido(cadena, 'resultado');
      cadena = ""
    }
  }

  recorrerFunciones(t: tablaSimbolos, arbol: Arbol, lista: String[]) {
    var salida = ''
    for (var key of t.tablaActual) {

      var listaobjetitos = "";

      let objetos = key.getvalor();
      if (objetos instanceof tablaSimbolos) {
        for (var key3 of objetos.tablaActual) {
          listaobjetitos += `${key3.getidentificador()}, `
        }
        //  let recorrido=
        let atributos = ""

        /**################################################################################################
         * #################################### IMPRIMIR DATOS CD3 XQUERY #################################
         * ################################################################################################
         */

        let etiqueta1 = "<" + key.getidentificador()
        this.generarEtiquetasXQUERY("<" + key.getidentificador(), arbol, lista);
        if (key.getAtributo().size != 0) {
          for (var [key2, value2,] of key.getAtributo()) {
            etiqueta1 += " " + key2 + "=" + value2
            this.generarEtiquetasXQUERY(" " + key2 + "=", arbol, lista);
            let atrib = key.get3DAtributo()
            this.printcd3SimpleXquery(atrib, arbol, key2, lista);
          }
        }
        etiqueta1 += ">"
        this.generarEtiquetasXQUERY(">", arbol, lista);
        lista.push(`printf("%c",10);`);
        let etiqueta2 = "</" + key.getidentificador() + ">"
        salida += etiqueta1 + "\n" + this.recorrerTablaXquery(objetos, arbol) + etiqueta2 + "\n";
        this.generarEtiquetasXQUERY(etiqueta2, arbol, lista);
        lista.push(`printf("%c",10);`);
      } else {
        let atributos = ""
        this.generarEtiquetasXQUERY("<" + key.getidentificador(), arbol, lista);
        if (key.getAtributo().size != 0) {
          for (var [key2, value2,] of key.getAtributo()) {
            atributos += " " + key2 + "=" + value2
            this.generarEtiquetasXQUERY(" " + key2 + "=", arbol, lista);
            let atrib = key.get3DAtributo()
            this.printcd3SimpleXquery(atrib, arbol, key2, lista);
          }
        }
        let contain = key.setcd3Value()
        this.generarEtiquetasXQUERY(">", arbol, lista);
        this.printcd3SimpleXquery(contain, arbol, key.getidentificador(), lista);
        salida += "<" + key.getidentificador() + atributos + ">"
        salida += objetos.replaceAll("%20", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&apos;", "'").replaceAll("&quot;", "\"");
        let etiqueta2 = "</" + key.getidentificador() + ">"
        salida += etiqueta2 + "\n"
        this.generarEtiquetasXQUERY(etiqueta2, arbol, lista);
        lista.push(`printf("%c",10);`);
      }
    }
    return salida;

  }





  recorrerTablaXquery(t: tablaSimbolos, arbol: Arbol) {
    var salida = ''
    for (var key of t.tablaActual) {

      var listaobjetitos = "";

      let objetos = key.getvalor();
      if (objetos instanceof tablaSimbolos) {
        for (var key3 of objetos.tablaActual) {
          listaobjetitos += `${key3.getidentificador()}, `
        }
        //  let recorrido=
        let atributos = ""

        /**################################################################################################
         * #################################### IMPRIMIR DATOS CD3 XQUERY #################################
         * ################################################################################################
         */

        let etiqueta1 = "<" + key.getidentificador()
        if (key.getAtributo().size != 0) {
          for (var [key2, value2,] of key.getAtributo()) {
            etiqueta1 += " " + key2 + "=" + value2
          }
        }
        etiqueta1 += ">"
        let etiqueta2 = "</" + key.getidentificador() + ">"
        salida += etiqueta1 + "\n" + this.recorrerTablaXquery(objetos, arbol) + etiqueta2 + "\n";
      } else {
        let atributos = ""
        if (key.getAtributo().size != 0) {
          for (var [key2, value2,] of key.getAtributo()) {
            atributos += " " + key2 + "=" + value2
            let atrib = key.get3DAtributo()
          }
        }
        salida += "<" + key.getidentificador() + atributos + ">"
        salida += objetos.replaceAll("%20", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&apos;", "'").replaceAll("&quot;", "\"");
        let etiqueta2 = "</" + key.getidentificador() + ">"
        salida += etiqueta2 + "\n"
      }
    }
    return salida;

  }


  /*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
   *$$$$$$$$$$$$$$$$$$$$$$$$ UTILIZACION PARA IMPRIMIR ETIQUETAS XQUERY $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
   *$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
   */
  /**
   * 
   * @param contenido 
   * @param arbol 
   * @param identificador 
   * @param lista 
   */
  printcd3SimpleXquery(contenido: String, arbol: Arbol, identificador: String, lista: String[]) {
    lista.push(`//***print  ${identificador}****`)
    let countprint = arbol.getContadort();
    lista.push(`$t${countprint}=stack[(int)${contenido}]; `);
    lista.push(`$t0= $t${countprint}; `);
    lista.push("imprimirString();");

  }
  /**
   * 
   * @param contenido 
   * @param arbol 
   * @param lista 
   */
  generarEtiquetasXQUERY(contenido: String, arbol: Arbol, lista: String[]) {
    let stackID = arbol.getSTACK();
    let contadorID = arbol.getContadort(); //temporales
    lista.push(`// declaracion para imprimir etiquetas ${contenido}`);
    lista.push(`$t${contadorID}=sp+${stackID};`);
    let data: string = contenido + "";
    let estado = 0;
    for (let x = 0; x < data.length; x++) {
      const iterator = data[x];
      switch (estado) {
        case 0: {
          if (iterator == "\\") { estado = 1; continue; }
          lista.push(`//agregamos el string al heap ${iterator}`);
          lista.push("$t0=hp;");

          lista.push("$t1=" + iterator.charCodeAt(0) + ";");
          lista.push("guardarString();");
          break;
        }
        case 1:
          {
            let assci = 0;
            if (iterator == "n") { assci = 10; }
            else if (iterator == "\"") { assci = 34; }
            else if (iterator == "\\") { assci = 92 }
            else if (iterator == "r") { assci = 10 }
            else if (iterator == "t") { assci = 9; }
            else {
              lista.push("//agregamos el string al heap");
              lista.push("$t0=hp;");

              lista.push("$t1=" + 34 + ";");
              lista.push("guardarString();");
              lista.push("//agregamos el string al heap");
              lista.push("$t0=hp;");

              lista.push("$t1=" + iterator.charAt(0) + ";");
              lista.push("guardarString();");
            }
            lista.push("//agregamos el string al heap");
            lista.push("$t0=hp;");

            lista.push("$t1=" + assci + ";");
            lista.push("guardarString();");
            estado = 0;
            break;
          }
      }

    }
    lista.push("$t0=hp;");
    lista.push("$t1=-1;");
    lista.push("guardarString();");
    const contadort = arbol.getContadort();
    lista.push("$t" + contadort + "=hp-" + (data.length + 1) + ";");
    lista.push(`stack[(int)$t${contadorID}]= $t${contadort};`);
    lista.push("//***print****")
    let countprint = arbol.getContadort();
    lista.push(`$t${countprint}=stack[(int)$t${contadorID}]; `);
    lista.push(`$t0= $t${countprint}; `);
    lista.push("imprimirString();");

  }

  /**************************************************************************************************
   * *********************************OPTIMIZACION***************************************************
   * ***********************************************************************************************/
  Optimizar(texto: string) {
    const Optimo = Optimizacion;
    const objetos = Optimo.parse(texto);
    let cadenaconcat = "";
    var Tree: TreeOptimo = new TreeOptimo([objetos]);;
    var tabla = new tablaSimbolos();                    //ejecucion
    Tree.settablaGlobal(tabla);
    for (var instruction of Tree.getinstrucciones()) {
      instruction.forEach(element => {
        if (element instanceof Declaracion) {
          cadenaconcat += element.interpretar(Tree, tabla);
        } else if (element instanceof Funcion) {
          cadenaconcat += element.interpretar(Tree, tabla);
        } else {
          cadenaconcat += element;
        }
      });

    }
    this.mostrarContenido(cadenaconcat, 'resultado');

    var reco = Tree.getSimbolos();
    let reporte = JSON.stringify(reco);
    localStorage.setItem("optimo", reporte);
  }
}



@Component({
  selector: 'contenido-dialog',
  templateUrl: './contenido-dialog-component.html',
})
export class Pruebas { }