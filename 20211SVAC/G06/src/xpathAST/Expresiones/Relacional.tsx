import { Entorno } from '../../xmlAST/Entorno';
import { Expression, Retorno } from "../../Interfaces/Expresion";
import { tipoPrimitivo } from './Primitivo';
import { Simbolo } from '../../xmlAST/Simbolo';


export enum operacionRelacional {
    IGUAL,
    DIFERENCIACION,
    MENOR,
    MENORIGUAL,
    MAYOR,
    MAYORIGUAL
}
////fechaPublicacion[@año>/biblioteca[1]/libro[3]/fechaPublicacion[1]/@año]     

export class Relacional implements Expression{

    constructor (
    public line : Number,
    public column: Number,
    public hijoIzq: Expression,
    public hijoDer: Expression,
    public tipoOperacion: operacionRelacional,
    public sym: string){}

    public execute(ent : Entorno, simboloPadre?:Simbolo): Retorno {

        let valorIzq = this.hijoIzq.execute(ent, simboloPadre);
        let valorDer = this.hijoDer.execute(ent, simboloPadre);

        if (valorIzq.type === tipoPrimitivo.RESP && valorDer.type === tipoPrimitivo.RESP) {

            for (const valIzq of valorIzq.value ) {
                for (const valDer of valorDer.value) {
                    
                    if (valIzq.type !== tipoPrimitivo.NODO && valDer.type !== tipoPrimitivo.NODO){

                        if (this.validar(valIzq, valDer)){
                            return {value: true, type: tipoPrimitivo.BOOL}
                        }
                    }
                    else if (valIzq.type === tipoPrimitivo.NODO && valDer.type === tipoPrimitivo.NODO){

                        if (this.validar(valIzq, valDer)){
                            return {value: true, type: tipoPrimitivo.BOOL}
                        }
                    }else {

                        if (this.validar(valIzq, valDer)){
                            return {value: true, type: tipoPrimitivo.BOOL}
                        }
                    }
                }
            }
            return {value: false , type : tipoPrimitivo.BOOL}; 
            
        }else if (valorIzq.type === tipoPrimitivo.RESP){

            for (const valIzq of valorIzq.value) {
                if (valIzq.type !== tipoPrimitivo.NODO){
                    if (this.validar(valIzq, valorDer)){
                        return {value: true, type: tipoPrimitivo.BOOL}
                    }
                }
            }
            return {value: false , type : tipoPrimitivo.BOOL};

        }else if (valorDer.type === tipoPrimitivo.RESP){

            for (const valDer of valorDer.value) {
                if (valDer.type !== tipoPrimitivo.NODO){
                    if (this.validar(valorIzq, valDer)){
                        return {value: true, type: tipoPrimitivo.BOOL}
                    }
                }
            }
            return {value: false , type : tipoPrimitivo.BOOL};
            
        }else {
            return { value: this.validar(valorIzq, valorDer), type: tipoPrimitivo.BOOL }
        }

    }

    private validar(valorIzq : Retorno, valorDer: Retorno): boolean{
        
        if (this.tipoOperacion === operacionRelacional.IGUAL) {
            const result = valorIzq.value == valorDer.value;
            return result
        } else if (this.tipoOperacion === operacionRelacional.DIFERENCIACION) {
            const result = valorIzq.value != valorDer.value;
            return result
        }else if (this.tipoOperacion === operacionRelacional.MENOR) { 
            const result = valorIzq.value < valorDer.value;
            return result;
        } else if (this.tipoOperacion === operacionRelacional.MENORIGUAL) {
            const result = valorIzq.value <= valorDer.value;
            return result;
        } else if (this.tipoOperacion === operacionRelacional.MAYOR) {
            const result = valorIzq.value > valorDer.value;
            return result
        } else if (this.tipoOperacion === operacionRelacional.MAYORIGUAL) {
            const result = valorIzq.value >= valorDer.value;
            return result;
        }
        else {
            throw new Error("Error Semantico: no se reconoce el operador  " + this.sym + ", Linea: "+this.line+"Column: "+this.column);
        }
    }

    public GraficarAST(texto:string):string {
        texto += "nodo" + this.line.toString() + "_" + this.column.toString() + "[label=\"" + this.sym.toString() + "\"];\n";
        texto = this.hijoIzq.GraficarAST(texto);
        texto = this.hijoDer.GraficarAST(texto);
        texto += "nodo" + this.line.toString() + "_" + this.column.toString() + "->nodo" + this.hijoIzq.line + "_" + this.hijoIzq.column.toString() + ";\n";
        texto += "nodo" + this.line.toString() + "_" + this.column.toString() + "->nodo" + this.hijoDer.line + "_" + this.hijoDer.column.toString() + ";\n";
        return texto;
    }
}