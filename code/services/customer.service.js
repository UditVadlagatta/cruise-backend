import customerModel from '../models/customer.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
// import { registerJoi } from '../validators/customer.validator.js';

class CustomerService{
    //  login
    async loginCustomer(data){
        const customer = await customerModel.findOne({email: data.email}).select("+password");
        if(!customer){
            throw new Error("Invailid email or password")
        } 

        const isMatch= await bcrypt.compare(data.password,customer.password);

        if(!isMatch){
            throw new Error("Invalid password")
        }

        // generate access tokens
        const accessToken = jwt.sign({
            customer_id:customer._id, 
            role:customer.role
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES} 
    );

    // generate refresh token
    const refreshToken= jwt.sign(
        {customer_id:customer._id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:'1d'}
    )

    customer.refreshToken=refreshToken;
    await customer.save();
    // res.json({accessToken,refreshToken})

    return  {customer, accessToken,refreshToken}
    }



async refreshCustomer(customerData, providedRefreshToken) {
    const customer = await customerModel.findById(customerData.customer_id);

    if (!customer) {
        throw new Error("Customer not found");
    }

    if (customer.refreshToken !== providedRefreshToken) {
        throw new Error("Invalid refresh token");
    }

    const newAccessToken = jwt.sign(
        {
            customer_id: customer._id,
            role: customer.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    );

    return { accessToken: newAccessToken };
}

    // add customer or register customer
    async createCustomer(data){

        const existCustomer = await customerModel.findOne({
            $or:[
                {username: data.username},
                {email: data.email}
            ]
        })
        if(existCustomer){
            throw new Error ("customer already exists with this email or password or both!")
        }


        const hashedPassword = await bcrypt.hash(data.password,10);
        // data.password= hashedPassword;

        // const newCustomer = new customerModel({username,email,password: hashedPassword,role})
        // const savedCustomer = await newCustomer.save();
        // res.json({message:'user register successfully!',savedUser})

        return await customerModel.create({...data, password: hashedPassword}); 
    }

    //  get all customers
    async getAllCustomer(){
        return await customerModel.find();
    }

    // get customer by id
    async getCustomerById(id){
        return await customerModel.findById(id);
    }

    async updateCustomer(id,data){
        return await customerModel.findByIdAndUpdate(id,data,{new:true,runValidators:true})
    }

    async deleteCustomer(id){
        return await customerModel.findByIdAndDelete(id)
    }

    async updateCustomerStatus(id, status) {
    return await customerModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
}
}

export default new CustomerService();