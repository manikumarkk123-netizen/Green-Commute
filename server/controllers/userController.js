export const registerUser = async (req, res) => {
    try {
        const { uid, name, email } = req.body;
        
        // Mock DB Save
        const user = { uid, name, email, ecoScore: 100, walletBalance: 0 };
        
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const userProfile = {
            uid: req.user.uid,
            email: req.user.email,
            ecoScore: 850,
            walletBalance: 1200
        };
        res.json({ success: true, profile: userProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
