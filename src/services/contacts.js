import { Contact } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../validation/constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  console.log('getContacts called with:', {
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({ userId });

  if (Array.isArray(filter.contactType) && filter.contactType.length > 0) {
    contactsQuery.where('contactType').in(filter.contactType);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery
      .where('isFavourite')
      .eq(filter.isFavourite === 'true' || filter.isFavourite === true);
  }

  try {
    const [contactsCount, contacts] = await Promise.all([
      Contact.find({ userId }).merge(contactsQuery).countDocuments(),
      Contact.find({ userId })
        .merge(contactsQuery)
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec(),
    ]);

    const paginationData = calculatePaginationData(
      contactsCount,
      perPage,
      page,
    );

    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    console.error('getContacts crashed in DB request:', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

export const getContactById = async (contactId, userId) =>
  Contact.findOne({ _id: contactId, userId });

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
