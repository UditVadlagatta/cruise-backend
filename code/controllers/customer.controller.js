import mongoose from "mongoose";
import customerService from "../services/customer.service.js";
import { loginJoi, registerJoi } from "../validators/customer.validator.js";

class CustomerController{

    async loginCustomer(req,res){
        try{
            const {error,value}= loginJoi.validate(req.body);
            if(error){
                return res.status(400).json({message: error.details[0].message})
            }

            const {customer, accessToken, refreshToken} = await customerService.loginCustomer(value);
            res.status(200).json({
                message:" login successfully!...",
                accessToken,
                refreshToken,
                customer
            });
        }
        catch(err){
                    const statusCode =
            err.message === "Invalid email or password"
                ? 401
                : 500;

        res.status(statusCode).json({
            message: err.message
        });

        }
    }


//     async refresh(req,res){
//     try{
//         const { refreshToken } = req.body;
//         // const { token } = req.body;

//         const result = await customerService.refreshCustomer(
//             req.customer,          // decoded data
//             refreshToken           // raw token from body
//         );

//         return res.status(200).json({
//             message:"Access token refreshed successfully",
//             accessToken: result.accessToken
//         });

//     }
//     catch(e){
//         return res.status(403).json({message:e.message})
//     }
// }
async refresh(req, res) {
    try {

        const refreshToken = req.refreshToken;

        const result = await customerService.refreshCustomer(
            req.customer,        // decoded token
            refreshToken         // raw refresh token
        );

        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken: result.accessToken
        });

    } catch (e) {
        return res.status(403).json({ message: e.message });
    }
}

async create(req,res){
        try{
            const {error,value} = registerJoi.validate(req.body);
            if(error){
                return res.status(400).json({ message: error.details[0].message });
            }

            const customer = await customerService.createCustomer(value);

            res.status(201).json({message:"customer added successfully!...",customer});

        }
        catch(err){
            if(err.code === 11000){
                return res.status(400).json({
                    message:"Username or Email is already exists"
                });
            };

            // Handle the "User already exists!" error thrown from service
            const statusCode = err.message === "User already exists!" ? 400 : 500;

            res.status(statusCode).json({
                message: "Something went wrong",
                error: err.message
            })
        }
    }

    async getAll(req, res) {
    try {
        const customers = await customerService.getAllCustomer();

        const count = customers.length;

        if (count === 0) {
            return res.status(200).json({
                message: "There are no customers in the list",
                count: 0,
                customers: []
            });
        }

        res.status(200).json({
            message: "Getting all customers...",
            count: count,
            customers
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

    async getById(req,res){
        try{
            const {id}= req.params;
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({message:"invalid customer id"})
            }

            const customer = await customerService.getCustomerById(id);
            if(!customer){
                return res.status(404).json({message:" customer is not found"})
            }
            res.status(200).json({message:"customer found!",customer});
        }
        catch(err){
            res.status(500).json({message: err.message})
        }
    }

    async update(req,res){
        try{
            const {id}=req.params;
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({message:"Invalid customer id"})
            }
            const customer= await customerService.updateCustomer(req.params.id,req.body);

            if(!customer){
                return res.status(404).json({message:"customer not found"})
            }

            res.status(200).json({message:"customer updated successfully!...",customer})
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
    }

    async delete(req,res){
        try{
            const {id} = req.params;
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({message:"invalid customer id"})
            }
            const customer= await customerService.deleteCustomer(req.params.id);
            if(!customer){
                return res.status(404).json({message:"customer not found!..."})
            }
            res.status(200).json({message:"customer deleted successfully!...",customer})
        }
        catch(e){
            res.status(500).json({message:e.message})
        }
    }

    async updateStatus(req, res) {
    try {

        const { id } = req.params;
        const { status } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid customer id"});
        }

        const customer = await customerService.updateCustomerStatus(id, status);

        if(!customer){
            return res.status(404).json({message:"Customer not found"});
        }

        res.status(200).json({
            message: "Customer status updated successfully",
            customer
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

}

export default new CustomerController();