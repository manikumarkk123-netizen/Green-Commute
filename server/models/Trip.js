import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickup: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Electric Scooter', 'Bike', 'EV Cab', 'Electric Bus', 'Carpool', 'Walk/Cycle'],
  },
  distance: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  carbonSaved: {
    type: Number,
    default: 0,
  },
  ecoCoinsEarned: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'completed',
  },
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
