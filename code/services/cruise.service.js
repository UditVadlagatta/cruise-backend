import cruiseModel from "../models/cruise.model.js";

class CruiseService{
    // create cruise or register
//     async createCruise(data){
//         // return await cruiseModel.create(data);
// //      calculate distance
//         const totalDistance =data.route.segments.reduce((sum,seg)=> sum + seg.distance,0);

//         // generate segmentPrice
//         data.route.segments = data.route.segments.map(seg=>{
//             const priceFraction = seg.distance / totalDistance;
//         return {
//             ...seg,
//             segmentPrice: Math.round(priceFraction * data.price) // rounding to nearest integer
//         };
//         })

//         // also store totalDistance and totalTime
//     data.route.totalDistance = totalDistance;
//     data.route.totalTime = data.route.segments.reduce((sum, seg) => sum + seg.time, 0);

//     return await cruiseModel.create(data);
//     }

async createCruise(data) {

  const totalDistance = data.route.segments.reduce(
    (sum, seg) => sum + seg.distance,
    0
  );

  const totalTime = data.route.segments.reduce(
    (sum, seg) => sum + seg.time,
    0
  );

  data.route.totalDistance = totalDistance;
  data.route.totalTime = totalTime;

  // generate segment price
  data.route.segments = data.route.segments.map((seg) => {

    const priceFraction = totalDistance === 0
      ? 0
      : seg.distance / totalDistance;

    return {
      ...seg,
      segmentPrice: Math.round(priceFraction * data.price),
    };
  });

  return await cruiseModel.create(data);
}

async updateCruiseImage  (cruiseId, imagePath)  {

  const cruise = await cruiseModel.findById(cruiseId);

  if (!cruise) {
    throw new Error("Cruise not found");
  }

  cruise.image = imagePath;

  await cruise.save();

  return cruise;
};

    async getAllCruise(){
        return await cruiseModel.find();
    }

    async getCruiseById(id){ 
        const cruise = await cruiseModel.findById(id);
        // if(!cruise){
        //     throw new Error("Cruise not found!")
        // }
        return cruise;
    }

    async updateCruise(id,data){
        return await cruiseModel.findByIdAndUpdate(id,data,{new:true,runValidators:true})
    }

    async deleteCruise(id){
        return await cruiseModel.findByIdAndDelete(id);
    }
}

export default new CruiseService();