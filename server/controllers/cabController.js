export const getAvailability = async (req, res) => {
    try {
        // Mock logic for fetching available cabs near a location
        const cabs = [
            { id: 'c1', type: 'Tata Tigor EV', pricePerKm: 1.5, status: 'available' },
            { id: 'c3', type: 'Tesla Model 3', pricePerKm: 3.0, status: 'available' },
        ];
        res.json({ success: true, cabs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const bookCab = async (req, res) => {
    try {
        const { pickup, dropoff, cabId } = req.body;
        const userId = req.user.uid;

        // Mock Firestore logic
        const booking = {
            id: 'mock_booking_' + Date.now(),
            userId,
            cabId,
            pickup,
            dropoff,
            status: 'confirmed',
            estimatedCost: 15.00,
            ecoCoinsEarned: 50,
            createdAt: new Date().toISOString()
        };

        res.status(201).json({ success: true, booking });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
};
