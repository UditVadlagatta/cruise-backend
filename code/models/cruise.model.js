
// // import { required } from "joi";
// import mongoose from "mongoose";

// const cruiseSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     // destination: {
//     //     type: String,
//     //     required: true,
//     //     trim: true
//     // },
//     // departurePort: {
//     //     type: String,
//     //     required: true
//     // },
//     // duration: {
//     //     type: Number,
//     //     required: true,
//     //     min: 1
//     // },

// //     route: {
// //     from: {
// //         type: String,
// //         required: true
// //     },
// //     to: {
// //         type: String,
// //         required: true
// //     },

// //     stops: [
// //         {
// //             place: String,
// //             timeFromStart: Number,   // in minutes
// //             distanceFromStart: Number, // in meters

// //             nextSegment: {
// //                 timeToNext: Number,   // minutes
// //                 distanceToNext: Number, // meters
// //                 directionNote: String
// //             }
// //         }
// //     ],

// //     totalTime: Number,       // total minutes
// //     totalDistance: Number    // total meters
// // },


// route: {
//     from: String,
//     to: String,

//     segments: [
//         {
//             from: String,
//             to: String,
//             time: Number,
//             distance: Number,
//             segmentPrice: Number,
//             note: String
//         }
//     ],

//     totalTime: Number,
//     totalDistance: Number
// },

//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     capacity: {
//         type: Number,
//         required: true,
//         min: 1
//     },
//     status: {
//         type: String,
//         enum: ["ACTIVE", "INACTIVE"],
//         default: "ACTIVE"
//     },
//     image: {
//         type: String
//     }
// }, {
//     timestamps: true
// });

// export default mongoose.model('Cruise', cruiseSchema);



import mongoose from "mongoose";

const cruiseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  route: {
    from: {
      type: String,
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    segments: [
      {
        from: String,
        to: String,
        time: Number,
        distance: Number,
        segmentPrice: Number,
        note: String,
      },
    ],

    totalTime: Number,
    totalDistance: Number,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  capacity: {
    type: Number,
    required: true,
    min: 1,
  },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },

  image: {
    type: String,
  },

}, {
  timestamps: true,
});

export default mongoose.model("Cruise", cruiseSchema);