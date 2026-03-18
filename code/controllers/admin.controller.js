import adminService from "../services/admin.service.js";

class AdminController{
    // ....................................... REGISTER .......................................................
async register(req,res){
        try {
      const admin = await adminService.register(req.body);

      res.status(201).json({
        message: "Admin created successfully",
        admin
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
    }


    // ....................................... LOGIN .......................................................
      async login(req, res) {
        try {
          const result = await adminService.login(req.body);
    
          res.json({
            message: "Login successful",
            ...result
          });
    
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
    
    
      async refresh(req, res) {
      try {
        const { refreshToken } = req.body;
    
        const result = await adminService.refreshAdmin(
        //   workerData.worker_id,       // decoded from middleware
        req.user, //in middle , i give customer name. later do changes  
        refreshToken,
        );
    
        return res.status(200).json({
          message: "Access token refreshed successfully",
          accessToken: result.accessToken
        });
    
      } catch (e) {
        return res.status(403).json({ message: e.message });
      }
    }



    //  ................ getById ......................
async getById(req, res) {
    try {
      const admin = await adminService.getById(req.params.id);
      res.json(admin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // ............................... UPDATE WORKER ........................
    async update(req, res) {
    try {
      const updatedAdmin = await adminService.update(req.params.id, req.body);
      res.json(updatedAdmin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } 




}

export default  new AdminController();