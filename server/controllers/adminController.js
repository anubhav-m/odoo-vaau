// controllers/adminController.js
import User from "../models/user.models.js";
import Facility from "../models/facility.models.js";

export const getAdminStats = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // USERS
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // FACILITIES
    const totalFacilities = await Facility.countDocuments();
    const lastMonthFacilities = await Facility.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // BOOKINGS

    res.status(200).json({
      success: true,
      message: "Admin stats fetched successfully",
      data: {
        totalUsers,
        lastMonthUsers,
        totalFacilities,
        lastMonthFacilities,
      },
    });
  } catch (err) {
    next(err);
  }
};
