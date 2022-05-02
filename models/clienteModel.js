import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true,unique:true },
    email: { type: String, required: false, unique: true },
    rif: { type: String, required: true,unique:true },
    telefono: { type: String, required: false },
    direccion: { type: String, required: true },
    descuento: { type: Number, required: false },
    prontopago: { type: Number, required: false },
    contacto: { type: String, required: false },
    observaciones: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
const Cliente = mongoose.model('Cliente', clienteSchema);
export default Cliente;
