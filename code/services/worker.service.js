import workerModel from "../models/worker.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class WorkerService {

// ....................................... REGISTER .......................................................
    // async register(data) {
    // const { username, email, password } = data;

    // const existing = await workerModel.findOne({ email });
    // if (existing) throw new Error("Worker already exists");

    // const hashedPassword = await bcrypt.hash(password, 10);

    // const worker = await workerModel.create({
    //   username,
    //   email,
    //   password: hashedPassword,
    //   role: "worker"
    // });

    // return worker;
    // }
async register(data) {
  const { username, email, password } = data;

  // ✅ Check email domain
  if (!email.endsWith("@cruisebook.com")) {
    throw new Error("Email must be a @cruisebook.com domain");
  }

  const existing = await workerModel.findOne({ email });
  if (existing) throw new Error("Worker already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const worker = await workerModel.create({
    username,
    email,
    password: hashedPassword,
    role: "worker"
  });

  return worker;
}

// ....................................... GET ALL .......................................................
    async getAll() {
    return await workerModel.find().select("-password");
  }

// ....................................... GET By ID .......................................................
    async getById(workerId) {
        const worker = await workerModel.findById(workerId).select("-password");
        if (!worker) throw new Error("Worker not found");
        return worker;
  }


// ....................................... DEACTIVATE ACCOUNT .......................................................
async deactivate(workerId) {
    const worker = await workerModel.findById(workerId);
    if (!worker) throw new Error("Worker not found");

    worker.isActive = false;
    await worker.save();

    return worker;
  }
// ..................................update worker ....................................................
async update(id, data) {
  const worker = await workerModel.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  ).select("-password");

  if (!worker) {
    throw new Error("Worker not found");
  }

  return worker;
}
// ....................................... LOGIN .......................................................
  async login({ email, password }) {
    const domain = "@cruisebook.com";
    if(!email.endsWith(domain)){
      throw new Error(`Only ${domain} emails are allowed`)
    }
  const worker = await workerModel.findOne({ email });
  if (!worker) throw new Error("Employee not found");

  const isMatch = await bcrypt.compare(password, worker.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    { worker_id: worker._id, role: worker.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { worker_id: worker._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  worker.refreshToken = refreshToken;
  await worker.save();

  const workerData = worker.toObject();
  delete workerData.password;

  return { worker: workerData, accessToken, refreshToken };
}


  async refreshWorker(workerData, providedRefreshToken) {

  const worker = await workerModel.findById(workerData.worker_id);

  if (!worker) {
    throw new Error("Worker not found");
  }

  if (worker.refreshToken !== providedRefreshToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = jwt.sign(
    {
      worker_id: worker._id,
      role: worker.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { accessToken: newAccessToken };
}


}

export default new WorkerService();