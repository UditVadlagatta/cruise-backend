import mongoose from "mongoose";
import cruiseService from "../services/cruise.service.js";
import customerService from "../services/customer.service.js";
import { registerCruiseJoi } from "../validators/cruise.validator.js";
import fs from "fs";
import path from "path";

class CruiseController{
//     async create(req,res){
//         try{
//             const {error,value}= registerCruiseJoi.validate(req.body);

//             if(error){
//                 return res.status(400).json({message: error.details[0].message})
//             }

//             const cruise = await cruiseService.createCruise(value);

//             res.status(201).json({message:"cruise add successfully!",cruise});
//         }
//         catch(err){
//             if(err.code === 11000){
//                 return res.status(400).json({message:"cruise already exists"});
//             }

//             const statusCode =
//   err.message === "Cruise already exists"
//     ? 400
//     : 500;

//             res.status(statusCode).json({
//                 message: "Something went wrong",
//                 error: err.message
//             })
//         }
//     }

// async create(req, res) {
//   try {

//     const { error, value } = registerCruiseJoi.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         message: error.details[0].message
//       });
//     }

//     // attach uploaded image
//     if (req.file) {
//       value.image = `/uploads/${req.file.filename}`;
//     }

//     const cruise = await cruiseService.createCruise(value);

//     res.status(201).json({
//       message: "cruise add successfully!",
//       cruise
//     });

//   } catch (err) {

//     if (err.code === 11000) {
//       return res.status(400).json({
//         message: "cruise already exists"
//       });
//     }

//     const statusCode =
//       err.message === "Cruise already exists"
//         ? 400
//         : 500;

//     res.status(statusCode).json({
//       message: "Something went wrong",
//       error: err.message
//     });
//   }
// }

// async create(req, res) {
//   try {

//     // convert route string → object
//     if (req.body.route) {
//       req.body.route = JSON.parse(req.body.route);
//     }

//     const { error, value } = registerCruiseJoi.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         message: error.details[0].message
//       });
//     }

//     // attach uploaded image
//     if (req.file) {
//       value.image = `/uploads/${req.file.filename}`;
//     }

//     const cruise = await cruiseService.createCruise(value);

//     res.status(201).json({
//       message: "cruise add successfully!",
//       cruise
//     });

//   } catch (err) {

//     if (err.code === 11000) {
//       return res.status(400).json({
//         message: "cruise already exists"
//       });
//     }

//     const statusCode =
//       err.message === "Cruise already exists"
//         ? 400
//         : 500;

//     res.status(statusCode).json({
//       message: "Something went wrong",
//       error: err.message
//     });
//   }
// }

// async create(req, res) {
//   try {

//     // convert route string → object
//     if (req.body.route) {
//       req.body.route = JSON.parse(req.body.route);
//     }

//     const { error, value } = registerCruiseJoi.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         message: error.details[0].message,
//       });
//     }

//     // attach uploaded image
//     if (req.file) {
//       value.image = `/uploads/${req.file.filename}`;
//     }

//     const cruise = await cruiseService.createCruise(value);

//     res.status(201).json({
//       message: "Cruise added successfully!",
//       cruise,
//     });

//   } catch (err) {

//     if (err.code === 11000) {
//       return res.status(400).json({
//         message: "Cruise already exists",
//       });
//     }

//     res.status(500).json({
//       message: "Something went wrong",
//       error: err.message,
//     });
//   }
// }
// async create(req, res) {
//   try {

//     const { error, value } = registerCruiseJoi.validate(req.body);

//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const route = value.route;

//     const totalTime = route.segments.reduce((sum, seg) => sum + seg.time, 0);
//     const totalDistance = route.segments.reduce((sum, seg) => sum + seg.distance, 0);

//     route.totalTime = totalTime;
//     route.totalDistance = totalDistance;

//     const cruise = await cruiseService.createCruise({
//       ...value,
//       route
//     });

//     res.status(201).json({
//       message: "Cruise created successfully",
//       cruise
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// }

// async create(req, res) {
//   try {

//     const { error, value } = registerCruiseJoi.validate(req.body);

//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const route = value.route;

//     const totalTime = route.segments.reduce((sum, seg) => sum + seg.time, 0);
//     const totalDistance = route.segments.reduce((sum, seg) => sum + seg.distance, 0);

//     route.totalTime = totalTime;
//     route.totalDistance = totalDistance;

//     const cruise = await cruiseService.createCruise({
//       ...value,
//       route
//     });

//     res.status(201).json({
//       message: "Cruise created successfully",
//       cruise
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// }

async create(req, res) {
  try {

    // Convert route string → object
    if (req.body.route) {
      req.body.route = JSON.parse(req.body.route);
    }

    const { error, value } = registerCruiseJoi.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const cruise = await cruiseService.createCruise({
      ...value,
      image: req.file ? req.file.path : null
    });

    res.status(201).json({
      message: "Cruise created successfully",
      cruise
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

    async getAll(req, res) {
    try {
        const cruises = await cruiseService.getAllCruise();
        const count = cruises.length;

        if (count === 0) {
            return res.status(200).json({
                message: "There are no cruises in the list",
                count: 0,
                cruises: []
            });
        }

        res.status(200).json({
            message: "Getting all cruises",
            count: count,
            cruises
        });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}
    async getById(req,res){
        try{
            const {id}= req.params;   // mongoose's id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid cruise id"})
        }
        const cruise= await cruiseService.getCruiseById(id);
        if(!cruise){
            return res.status(404).json({message:"cruise not found"})
        }
        res.status(200).json({message:"cruise found successfully!",cruise});
        }catch(e){
            res.status(500).json({message:e.message})
        }
    }
// .................................. Update Cruise ....................................................
    // async update(req,res){
    //     try{
    //         const {id}= req.params;  // mongoose's id
    //         if(!mongoose.Types.ObjectId.isValid(id)){
    //             return res.status(400).json({message: "invalid cruise id"})
    //         }

    //         const crusie= await cruiseService.updateCruise(id,req.body)

    //         if(!crusie){
    //             return res.status(404).json({message:"cruise not found"})
    //         }
    //         res.status(200).json({message:"cruise add successfully!!!",crusie})
    //     }
    //     catch(e){
    //         res.status(500).json({message:e.message})
    //     }
    // }

//     async update(req, res) {
//   try {

//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         message: "invalid cruise id"
//       });
//     }

//     const data = req.body;

//     // convert route string to object
//     if (data.route) {
//       data.route = JSON.parse(data.route);
//     }

//     // attach uploaded image if exists
//     if (req.file) {
//       data.image = `/uploads/${req.file.filename}`;
//     }

//     const cruise = await cruiseService.updateCruise(id, data);

//     if (!cruise) {
//       return res.status(404).json({
//         message: "cruise not found"
//       });
//     }

//     res.status(200).json({
//       message: "cruise updated successfully!",
//       cruise
//     });

//   } catch (e) {
//     res.status(500).json({
//       message: e.message
//     });
//   }
// }

async update(req, res) {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid cruise id"
      });
    }

    const cruise = await cruiseService.getCruiseById(id);

    if (!cruise) {
      return res.status(404).json({
        message: "cruise not found"
      });
    }

    const data = req.body;

    // convert route string to object
    if (data.route) {
      data.route = JSON.parse(data.route);
    }

    // if new image uploaded
    if (req.file) {

      // delete old image
      if (cruise.image) {
        const oldPath = path.join("uploads", cruise.image.split("/").pop());

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      data.image = `/uploads/${req.file.filename}`;
    }

    const updatedCruise = await cruiseService.updateCruise(id, data);

    res.status(200).json({
      message: "cruise updated successfully!",
      cruise: updatedCruise
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}

// ...................................... delete ................................

//     async delete(req, res) {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 message: "Invalid cruise id"
//             });
//         }

//         const cruise = await cruiseService.deleteCruise(id);

//         if (!cruise) {
//             return res.status(404).json({
//                 message: "Cruise not found"
//             });
//         }

//         res.status(200).json({
//             message: "Cruise deleted successfully!",
//             cruise
//         });

//     } catch (e) {
//         res.status(500).json({ message: e.message });
//     }
// }



  async delete(req, res) {
  try {

    const { id } = req.params;

    const cruise = await cruiseService.getCruiseById(id);

    if (!cruise) {
      return res.status(404).json({
        message: "Cruise not found"
      });
    }

    // delete image
    if (cruise.image) {
      const imagePath = path.join("uploads", cruise.image.split("/").pop());

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await cruiseService.deleteCruise(id);

    res.status(200).json({
      message: "Cruise deleted successfully!"
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async updateCruiseImage(req, res) {
  try {

    const cruiseId = req.params.id;

    const cruise = await cruiseService.getCruiseById(cruiseId);

    if (!cruise) {
      return res.status(404).json({
        message: "Cruise not found"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required"
      });
    }

    // delete old image
    if (cruise.image) {
      const oldPath = path.join("uploads", cruise.image.split("/").pop());

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const updated = await cruiseService.updateCruiseImage(cruiseId, imagePath);

    res.status(200).json({
      message: "Cruise image updated successfully",
      cruise: updated
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}
}


export default new CruiseController()