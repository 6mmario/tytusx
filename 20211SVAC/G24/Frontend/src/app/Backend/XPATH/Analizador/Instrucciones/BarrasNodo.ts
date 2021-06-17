
import tablaSimbolos from 'src/app/Backend/XML/Analizador/Simbolos/tablaSimbolos';
import { Instruccion } from '../Abstracto/Instruccion';
import nodoAST from '../Abstracto/nodoAST';
import NodoErrores from '../Excepciones/NodoErrores';
import Identificador from '../Expresiones/Identificador';
import Arbol from '../Simbolos/Arbol';
import Tipo, { tipoDato } from '../Simbolos/Tipo';

export default class BarrasNodo extends Instruccion {
  public Barra: string;
  public Barra2: string;
  public Operacion: Instruccion   //Nodo
  contenido: string = "";
  constructor(barra1: string, expresion: Instruccion, fila: number, columna: number, barra2?: string) {

    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.Barra = barra1
    this.Barra2 = barra2
    this.Operacion = expresion
  }
  public getNodosAST(): nodoAST {
    var nodo = new nodoAST('INSTRUCCION'); //PADRE SELECT
    var nodsBarras = new nodoAST(this.Barra)
    nodo.agregarHijoAST(nodsBarras)
    if (this.Barra2 != null) {
      /*nodo.agregarHijo(this.Barra2)*/
      var nodsBarras2 = new nodoAST(this.Barra2)
      nodo.agregarHijoAST(nodsBarras2)
    }
    if (this.Operacion != null) {

      nodo.agregarHijoAST(this.Operacion.getNodosAST())
    }

    return nodo;
  }


  //BARRA: SELECCIONA DESDE EL NODO RAIZ
  //DOBLE BARRA: SELECCIONA LOS NODOS QUE HAGAN MATCH EN EL DOCUMENTO NO IMPORTANDO DONDE ESTEN DESDE EL NODO ACTUAL 
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    //arbol.gettablaGlobal();
    //BARRA
    console.log('BARRA')
    console.log(tabla)
    let variable = this.Operacion.interpretar(arbol, tabla);
    console.log(this.Operacion)
    //if (variable != null) {
    if (this.Barra2 == null) {
      console.log("Aqui esta el arbol");
      let salidas = new tablaSimbolos();
      let cadena = ''
      let error = ''
      for (var key of tabla.getTabla()) {//SIMBOLOS
        /*let objetos = key.getvalor();
        if (objetos instanceof tablaSimbolos) { // BUSCAR UNA RAMA HIJA
          for(let key2 of objetos.getTabla())
          {
            if(key2.getidentificador() == variable){
              salidas.push(key2)
            }
          }

        } else {
          //this.contenido += objetos.replaceAll("%20", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&apos;", "'").replaceAll("&quot;", "\"").replaceAll("   ","\n");
          //MANDA ERROR
        }*/
        if (key.getidentificador() == variable) {
          console.log(key.getidentificador())
          if (key.getvalor() instanceof tablaSimbolos) {
            for (let sim of key.getvalor().getTabla()) {
              salidas.setVariable(sim)
            }

          }
          else {
            cadena += key.getvalor().replaceAll("%20", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&apos;", "'").replaceAll("&quot;", "\"").replaceAll("   ", "\n");
          }
        } else {
          error = "Nodo no encontrado ";
          console.log(error);
        }

      }
      if (cadena != '') {
        return cadena
      } else if (error != '') {
        return error
      }
      console.log("OBJETOSSALIDA")
      console.log(salidas)
      return salidas
    } else {
      console.log("entro doble barra")
      //DOBLE BARRA
      let salidas = new tablaSimbolos();
      let cadena = ''

      for (var key of tabla.getTabla()) {
        if (key.getidentificador() == variable) {
          console.log(key.getidentificador())
          if (key.getvalor() instanceof tablaSimbolos) {
            for (let sim of key.getvalor().getTabla()) {
              salidas.setVariable(sim)
            }

          }
          else {
            cadena += key.getvalor().replaceAll("%20", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&apos;", "'").replaceAll("&quot;", "\"").replaceAll("   ", "\n");
          }
        }


        if (cadena != '') {
          return cadena
        }
        console.log("OBJETOSSALIDA")
        console.log(salidas)
        return salidas
      }
    }

  }
  //localStorage.setItem("consulta", this.contenido);

  /*} else {
    return new NodoErrores(
      'SEMANTICO',
      'VARIABLE ' + this.Operacion + ' NO EXISTE',
      this.fila,
      this.columna
    );
  }*/


  buscarTablaSimbolos(t: tablaSimbolos, tri: Arbol): string {
    for (var key of t.tablaActual) {
      //alert(key + " = " + value);
      var listaobjetitos = "";
      var nombre = key.getidentificador();

      let objetos = key.getvalor();
      if (objetos instanceof tablaSimbolos) {
        for (var key3 of objetos.tablaActual) {
          listaobjetitos += `${key3.getidentificador()}, `
        }

        this.buscarTablaSimbolos(objetos, tri);

      } else {
        this.contenido += objetos.replaceAll("%20", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&apos;", "'").replaceAll("&quot;", "\"").replaceAll("   ", "\n");
      }


    }
    return this.contenido;
    console.log(this.contenido);
    localStorage.setItem("consulta", this.contenido);

  }



}
