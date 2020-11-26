export interface PagoRequest{
    idSuscr: number;
    descripcion: string;
    estado: number;
    fecha_inicio: string;
    tipo: TypePago;
    idUsu: number;
    monto: number;
}

export type TypePago = 'anual' | 'mensual';
