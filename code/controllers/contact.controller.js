import contactService from "../services/contact.service.js";

class ContactController {

    async create(req, res) {
        try {
            const contact = await contactService.create(req.body);
            res.status(201).json({
                message: "Message sent successfully",
                contact
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const contacts = await contactService.getAll();
            res.status(200).json({
                message: "Getting all contacts",
                count: contacts.length,
                contacts
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteById(req, res) {
        try {
            const contact = await contactService.deleteById(req.params.id);
            res.status(200).json({
                message: "Contact deleted successfully",
                contact
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ContactController();