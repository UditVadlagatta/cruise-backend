import adminModel from "../models/admin.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AdminService{
    // ....................................... REGISTER .......................................................
    async register(data){
        const { username, email, password } = data;
        // ✅ Check email domain
  if (!email.endsWith("@admincruisebook.com")) {
    throw new Error("Email must be a @admincruisebook.com domain");
  }

  const existing = await adminModel.findOne({ email });
    if (existing) throw new Error("Admin already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    
      const admin = await adminModel.create({
        username,
        email,
        password: hashedPassword,
        role: "admin"
      });
    
      return admin;
    }


    // ....................................... LOGIN .......................................................

    async login({ email, password }) {
        const domain = "@admincruisebook.com";
    if(!email.endsWith(domain)){
      throw new Error(`Only ${domain} emails are allowed`)
    }

    const admin = await adminModel.findOne({ email });
      if (!admin) throw new Error("Employee not found");
    
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const accessToken = jwt.sign(
          { admin_id: admin._id, role: admin.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
      
        const refreshToken = jwt.sign(
          { admin_id: admin._id },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "7d" }
        );

        admin.refreshToken = refreshToken;
  await admin.save();

  const adminData = admin.toObject();
  delete adminData.password;

  return { admin: adminData, accessToken, refreshToken };
    }



    async refreshAdmin(adminData, providedRefreshToken) {
    
      const admin = await adminModel.findById(adminData.admin_id);
    
      if (!admin) {
        throw new Error("Admin not found");
      }
    
      if (admin.refreshToken !== providedRefreshToken) {
        throw new Error("Invalid refresh token");
      }
    
      const newAccessToken = jwt.sign(
        {
          admin_id: admin._id,
          role: admin.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
    
      return { accessToken: newAccessToken };
    }


    // .......................... getByID ......................
    async getById(adminId) {
            const admin = await adminModel.findById(adminId).select("-password");
            if (!admin) throw new Error("admin not found");
            return admin;
      }
    
    // ................. update ....................
    async update(id, data) {
      const admin = await adminModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      ).select("-password");
    
      if (!admin) {
        throw new Error("Admin not found");
      }
    
      return admin;
    }

}

export default new AdminService();