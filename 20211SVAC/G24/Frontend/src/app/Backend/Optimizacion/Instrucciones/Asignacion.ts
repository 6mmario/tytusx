

import tablaSimbolos from "../../XML/Analizador/Simbolos/tablaSimbolos";
import { Instruccion } from "../Abstracto/Instruccion";
import Aritmetica from "../Expresion/Aritmetica";
import Bit from "../Expresion/Bit";
import Identificador from "../Expresion/Identificador";
import Logica from "../Expresion/Logica";
import Relacional from "../Expresion/Relacional";
import Termino from "../Expresion/Termino";
import Unario from "../Expresion/Unario";
import { reporteOp } from "../Reportes/reporteOp";
import Arbol from "../Simbolo/Arbol";
import Tipo, { tipoDato } from "../Simbolo/Tipo";
export default class Asignacion extends Instruccion {

    private Temporales: Instruccion;
    private Expresion: Instruccion;
    constructor(termino: Instruccion, expresion: Instruccion, fila: number, columna: number) {
        super(new Tipo(tipoDato.CADENA), fila, columna);
        this.Temporales = termino
        this.Expresion = expresion
    }
    interpretar(arbol: Arbol, tabla: tablaSimbolos) {
        // si es termino y si es expresion las instrucciones
        let tem: Termino
        let cadena = ""
        let idtemp = ""
        if (this.Temporales != null) {
            if (this.Temporales instanceof Termino) {
                let a = this.Temporales.interpretar(arbol, tabla)
                idtemp = a.contenido;
                cadena += a.contenido + "="

            } else if (this.Temporales instanceof Identificador) {
                let a = this.Temporales.interpretar(arbol, tabla)
                idtemp = a.contenido;
                cadena += a.contenido + "="
            } else {
                idtemp = this.Temporales.toString();
                cadena += this.Temporales.toString() + "="
            }
        }
        if (this.Expresion != null) {
            if (this.Expresion instanceof Aritmetica) {
                let a = this.Expresion.interpretar(arbol, tabla)
                if (a.operadorder == idtemp || a.operadorizq == idtemp) {
                    if (a.operadorder === "0" && a.operador === "+" || a.operadorder == 0 && a.operador === "+") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 6", idtemp + "=" + idtemp + "+0" + ";", "", a.linea, a.columna)
                        arbol.setReporte(report)
                        return ""
                    } else if (a.operadorizq === "0" && a.operador === "+" || a.operadorizq == 0 && a.operador === "+") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 6", idtemp + "=" + "0+" + idtemp + ";", "", a.linea, a.columna)
                        arbol.setReporte(report)
                        return ""
                    } else if (a.operadorder === "0" && a.operador === "-" || a.operadorder == 0 && a.operador === "-") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 7", idtemp + "=" + idtemp + "-0" + ";", "", a.linea, a.columna)
                        arbol.setReporte(report)
                        return ""
                    } else if (a.operadorizq === "0" && a.operador === "-" || a.operadorizq == 0 && a.operador === "-") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 7", idtemp + "=" + "0-" + idtemp + ";", "", a.linea, a.columna)
                        arbol.setReporte(report)
                        return ""
                    } else if (a.operadorder === "1" && a.operador === "*" || a.operadorder == 1 && a.operador === "*") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 8", idtemp + "=" + idtemp + "*1" + ";", "", a.linea, a.columna)
                        arbol.setReporte(report)
                        return ""
                    } else if (a.operadorizq === "1" && a.operador === "*" || a.operadorizq == 1 && a.operador === "*") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 8", idtemp + "=" + "1*" + idtemp + ";", "", a.linea, a.columna)
                        arbol.setReporte(report)
                        return ""
                    } else if (a.operadorder === "1" && a.operador === "/" || a.operadorder == 1 && a.operador === "/") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 9", idtemp + "=" + idtemp + "/1;", "", a.linea, a.columna)
                        arbol.setReporte(report)
                        return ""
                    } else if (a.operadorizq === "1" && a.operador === "/" || a.operadorizq == 1 && a.operador === "/") {
                        return idtemp + "=" + a.operadorizq + a.operador + a.operadorder + ";"
                    } else {
                        return idtemp + "=" + a.operadorizq + a.operador + a.operadorder + ";"
                    }
                } else {
                    if (a.operadorder === "0" && a.operador === "+" || a.operadorder == 0 && a.operador === "+") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 10", idtemp + "= " + a.operadorizq + "+0;", idtemp + "=" + a.operadorizq + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorizq + ";"
                    } else if (a.operadorizq === "0" && a.operador === "+" || a.operadorizq == 0 && a.operador === "+") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 10", idtemp + "= 0+" + a.operadorder + ";", idtemp + "=" + a.operadorder + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorder + ";"
                    } else if (a.operadorder === "0" && a.operador === "-" || a.operadorder == 0 && a.operador === "-") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 11", idtemp + "=" + a.operadorizq + "-0;", idtemp + "=" + a.operadorizq + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorizq + ";"
                    } else if (a.operadorizq === "0" && a.operador === "-" || a.operadorizq == 0 && a.operador === "-") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 11", idtemp + "= 0-" + a.operadorder + ";", idtemp + "=" + a.operadorder + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorder + ";"
                    } else if (a.operadorder === "1" && a.operador === "*" || a.operadorder == 1 && a.operador === "*") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 12", idtemp + "=" + a.operadorizq + "*1;", idtemp + "=" + a.operadorizq + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorizq + ";"
                    } else if (a.operadorizq === "1" && a.operador === "*" || a.operadorizq == 1 && a.operador === "*") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 12", idtemp + "= 1*" + a.operadorder + ";", idtemp + "=" + a.operadorder + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorder + ";"
                    } else if (a.operadorder === "2" && a.operador === "*" || a.operadorder == 2 && a.operador === "*") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 14", idtemp + "=" + a.operadorizq + "*2;", idtemp + "=" + a.operadorizq + "+" + a.operadorizq + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorizq + "+" + a.operadorizq + ";"
                    } else if (a.operadorizq === "2" && a.operador === "*" || a.operadorizq == 2 && a.operador === "*") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 14", idtemp + "= 2*" + a.operadorder + ";", idtemp + "=" + a.operadorder + "+" + a.operadorder + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorizq + "+" + a.operadorizq + ";"
                    } else if (a.operadorder === "0" && a.operador === "*" || a.operadorder == 0 && a.operador === "*") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 15", idtemp + "=" + a.operadorizq + "*0;", idtemp + "=" + "0;", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + "0;"
                    } else if (a.operadorizq === "0" && a.operador === "*" || a.operadorizq == 0 && a.operador === "*") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 15", idtemp + "= 0*" + a.operadorder + ";", idtemp + "=" + "0;", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + "0;"
                    } else if (a.operadorder === "1" && a.operador === "/" || a.operadorder == 1 && a.operador === "/") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 13", idtemp + "=" + a.operadorizq + "/1;", idtemp + "=" + a.operadorizq + ";", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + a.operadorizq + ";"
                    } else if (a.operadorizq === "0" && a.operador === "/" || a.operadorizq == 0 && a.operador === "/") {
                        let report = new reporteOp("Simplificación algebraica y por fuerza", "Regla 16", idtemp + "= 0/" + a.operadorder + ";", idtemp + "=" + "0;", a.linea, a.columna)
                        arbol.setReporte(report)
                        return idtemp + "=" + "0;"
                    } else if (a.operadorizq === "1" && a.operador === "/" || a.operadorder == 1 && a.operador === "/") {
                        return idtemp + "=" + a.operadorizq + a.operador + a.operadorder + ";"
                    } else {
                        return idtemp + "=" + a.operadorizq + a.operador + a.operadorder + ";"
                    }
                }
            } else if (this.Expresion instanceof Logica) {
                let a = this.Expresion.interpretar(arbol, tabla)
                return idtemp + "=" + a.operadorizq + a.operador + a.operadorder + ";"
            } else if (this.Expresion instanceof Relacional) {
                let a = this.Expresion.interpretar(arbol, tabla)
                return idtemp + "=" + a.operadorizq + a.operador + a.operadorder + ";"
            } else if (this.Expresion instanceof Bit) {
                let a = this.Expresion.interpretar(arbol, tabla)
                return idtemp + "=" + a.operadorizq + a.operador + a.operadorder + ";"
            } else if (this.Expresion instanceof Unario) {
                let a = this.Expresion.interpretar(arbol, tabla)
                return idtemp + "=" + a.operadorizq + a.operador + a.operadorder + ";"
            } else if (this.Expresion instanceof Identificador) {
                //SE HACE OTRO PROCEDIMIENTO
                let term2 = this.Expresion.interpretar(arbol, tabla)
                return idtemp + "=" + term2.contenido
            } else if (this.Expresion instanceof Termino) {
                //SE HACE OTRO PROCEDIMIENTO
                let term2 = this.Expresion.interpretar(arbol, tabla)
            
                let result = tabla.thisDeclarationExist(idtemp, term2.contenido)
               
                if (result == "") {
                    let report = new reporteOp("Eliminacion de instrucciones redundants de carga y almacenamiento", "Regla 5", idtemp + "=" + term2.contenido, "REMOVIDO", term2.fila, term2.columna)
                    arbol.setReporte(report)
                }

                return result
            }


        }
    }


}

