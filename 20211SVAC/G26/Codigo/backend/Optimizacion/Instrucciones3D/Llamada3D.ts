import { Instruccion3D, TipoInstruccion3D } from "./Instruccion3D";


export class Llamada3D implements Instruccion3D{
    fila: number;
    columna: number;
    tipo: TipoInstruccion3D;
    codigo3D: string;
    metodo: string
    constructor(tipo: TipoInstruccion3D, nombreMetodo: string, codigo3d: string, fila: number, columna: number){
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo
        this.codigo3D = codigo3d;
        this.metodo = nombreMetodo;
    }

    getTipoInstruccion(): TipoInstruccion3D{
        return this.tipo;
    }

    setCodigo3D(codigo: string): void{
        this.codigo3D = codigo;
    }

    getCodigo3D(): string{
        return this.codigo3D;
    }
}