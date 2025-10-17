import mongoose from 'mongoose';

const historiqueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
    name: { type: String, trim: true },
    address: { type: String, trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

const Historique = mongoose.model('Historique', historiqueSchema);
export default Historique;

