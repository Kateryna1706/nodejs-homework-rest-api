const { nanoid } = require("nanoid");
const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const deletedContacts = await Contact.findByIdAndRemove(contactId);
  if (!deletedContacts) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Contact deleted" });
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { name, email, phone } = req.body;
  const id = nanoid();
  const newContact = await Contact.create({ id, name, email, phone, owner });
  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const body = req.body;
  if (!body) {
    throw HttpError(400, "missing fields");
  }
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const body = req.body;
  if (!body) {
    throw HttpError(400, "missing field favorite");
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
