import { Entorno } from "../AST/Entorno";
import { Tipo } from "../AST/Tipo";
import errores from "../Global/ListaError";
import { Expresion} from "../Interfaz/expresion";

export class Primitiva implements Expresion {
    linea: number;
    columna: number;
    valor: any;
    tipo: TipoPrim;
    constructor(valor: any, tipo: TipoPrim, linea: number, columna: number){
        this.linea  = linea;
        this.columna = columna;
        this.tipo = tipo;
        this.valor = valor;     
    }

    getTipo(ent: Entorno){
        return this.tipo;
    }

    getValor(ent: Entorno){
        console.log(this.tipo)
        if (this.tipo === TipoPrim.IDENTIFIER){
            /* SE BUSCAN LAS ETIQUETAS CON ESTE NOMBRE */
            if (ent.existeSimbolo(this.valor)){
                return ent.obtenerSimbolo(this.valor);
            }else{
                errores.agregarError('semantico', 'No existe el simbolo ' + this.valor, this.linea, this.columna);
                this.tipo = TipoPrim.ERROR;
                return null;
            }
        }else if (this.tipo === TipoPrim.ATRIBUTO){
            /* SE BUSCAN LOS ATRIBUTOS CON ESTE NOMBRE */
            this.tipo = TipoPrim.FUNCION
            //0. Se devolver un entorno temporal, que contendra todos los que coinciden con la busqueda.
            let entTemporal: Entorno = new Entorno("Temporal", null ,null );
            //1. Obtener el padre.
            let padre = ent.padre;
            //2. Sobre el padre buscar todos los que sean ent.nombre
            padre.tsimbolos.forEach((e: any) => {
                let elem = e.valor;
                if(elem.getTipo() === Tipo.ETIQUETA && elem.getNombre() === ent.nombre){
                    //Ahora en este entorno ver si tiene un atributo como el que se busca.
                    elem.valor.tsimbolos.forEach((c2: any) => {
                        let aux = c2.valor;
                        if(aux.getTipo() === Tipo.ATRIBUTO && (this.valor === "*" || this.valor === aux.getNombre())){
                            //Si se encuentra el atributo o es *, ingresar al entorno temporal
                            entTemporal.agregarSimbolo(elem.getNombre(), elem);
                        }
                });
                }
            })
            return entTemporal;
        }else if( this.tipo === TipoPrim.FUNCION){
            //Si es funcion, ver de cual funcion se trata
            switch(this.valor.toLowerCase()){
                case "last()":
                    //Para last, calcular sobre el entorno padre, cual es el numero del ultimo
                    //que tiene nombre como ent.nombre
                    //1. Obtener padre.
                    let padre = ent.padre;
                    //2. Sobre el padre, contar cual es el ultimo que tiene ent.nobmre
                    let indice = 0; //Se empieza en 0, por si no se encuentra devuelva 0. (y asi retornaria nada en la consulta)
                    padre.tsimbolos.forEach((e: any) => {
                        let elem = e.valor;

                        if(elem.getTipo() === Tipo.ETIQUETA && elem.getNombre() === ent.nombre){
                            //Se encontro, sumar al indice
                            indice++;
                        }
                    })
                    //3. al terminar devolver indice + 1
                    //4. Cambiar su tipo a tipo INTEGER
                    this.tipo = TipoPrim.INTEGER
                    if(indice > 0){
                        return indice + 1;
                    }else{
                        return 0;
                    }
                default:
                    //Para position(), devolver lo mismo.
                    return this.valor;
            }

        }else
            return this.valor;
    }
}

export enum TipoPrim{
    INTEGER,
    DOUBLE,
    CADENA,
    IDENTIFIER,
    ATRIBUTO,
    DOT,
    FUNCION,
    BOOLEAN,
    ERROR,
}