import contactModel from "../models/contact.model.js";

class ContactService {

    async create(data) {
        const { name, email, message } = data;

        if (!name || !email || !message) {
            throw new Error("All fields are required");
        }

        const contact = await contactModel.create({ name, email, message });
        return contact;
    }

    async getAll() {
        return await contactModel.find().sort({ createdAt: -1 });
    }

    async deleteById(id) {
        const contact = await contactModel.findByIdAndDelete(id);
        if (!contact) throw new Error("Contact not found");
        return contact;
    }
}

export default new ContactService();