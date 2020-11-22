export class User{
    constructor(
        public id: number,
        public correo: string,
        public nombres: string,
        public apellidos: string,
        public telefono: string,
        // tslint:disable-next-line: variable-name
        public id_rol: number,
        public genero: string
    ){}
}
