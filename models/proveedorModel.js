import mongoose from 'mongoose';

const proveedorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    rif: { type: String, required: false },
    telefono: { type: String, required: false },
    direccion: { type: String, required: false },
    contacto: { type: String, required: false },
    observaciones: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
const Proveedor = mongoose.model('Proveedor', proveedorSchema);
export default Proveedor;
