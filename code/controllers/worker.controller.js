 import workerService from "../services/worker.service.js";

 class WorkerController {

    // ....................................... REGISTER .......................................................
    async register(req,res){
        try {
      const worker = await workerService.register(req.body);

      res.status(201).json({
        message: "Worker created successfully",
        worker
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
    }


    // ............................................. LOGIN ..............................

  //   async login({ email, password }) {

  //   const worker = await workerModel.findOne({ email });
  //   if (!worker) throw new Error("Worker not found");

  //   const isMatch = await bcrypt.compare(password, worker.password);
  //   if (!isMatch) throw new Error("Invalid credentials");

  //   const token = jwt.sign(
  //     { id: worker._id, role: worker.role },
  //     process.env.JWT_SECRET,
  //     { expiresIn: "1d" }
  //   );

  //   return { worker, token };
  // }

//   .............................. GET ALL .............................


async getAll(req, res) {
    try {
      const workers = await workerService.getAll();
      res.json(workers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


// .............................. GET BY ID .............................
async getById(req, res) {
    try {
      const worker = await workerService.getById(req.params.id);
      res.json(worker);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  // ............................... UPDATE WORKER ........................
  async update(req, res) {
  try {
    const updatedWorker = await workerService.update(req.params.id, req.body);
    res.json(updatedWorker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
} 



// ....................................... DEACTIVATE ACCOUNT .......................................................
  async deactivate(req, res) {
    try {
      const worker = await workerService.deactivate(req.params.id);

      res.json({
        message: "Worker deactivated",
        worker
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

// ....................................... LOGIN .......................................................
  async login(req, res) {
    try {
      const result = await workerService.login(req.body);

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

    const result = await workerService.refreshWorker(
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

async getAllWithPassword(req, res) {
    try {
        const workers = await workerService.getAllWithPassword();
        res.json(workers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
  

 }




 export default  new WorkerController();