import Users from '../models/users.js';
import { sendSMS } from '../config/twilio.js';

export const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

export const createUser = async (req, res) => {
  const { name, phone, email, zipCode, organizations, alertPhone, optInPhone, optInEmail } = req.body;

  const phoneWithCountryCode = "+1" + phone;
  let user;

  try {
    user = await Users.findOne({ phone: phoneWithCountryCode, isActive: true });
  } catch (error) {
    console.error(error);
  }

  if (user) {
    return res.status(403).json('User already exists with that phone number');
  }

  // TODO: Get list of organization monitors to add to user_devices

  try {
    user = await Users.create({
      name,
      phone: phoneWithCountryCode,
      email,
      zipCode,
      organizations,
      alertPhone: phoneWithCountryCode,
      optInPhone,
      optInEmail
    });

    // TODO: Previous code wants to send SMS at registration, decide on best action

    if (user) {
      return res.status(201).json(user);
    } else {
      return res.status(500).json('Issue registering User. Please try again later');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error. Please try again');
  }

}

export const getUser = async (req, res) => {
  const { phone } = req.params;

  const phoneWithCountryCode = "+1" + phone;
  let user;

  try {
    user = await Users.findOne({ phone: phoneWithCountryCode, isActive: true });
    if (!user) {
      return res.status(404).json('User not found');
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
  }


}

export const unsubscribeUser = async (req, res) => {
  const { phone } = req.parameters;

  const phoneWithCountryCode = "+1" + phone;

  try {
    const user = await Users.findOneAndUpdate({ phone: phoneWithCountryCode, optInPhone: false });
    if (user) {
      return res.status(200).json('User has unsubscribed');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error. Try again later');
  }

  //TODO: send to queue to handle twilio message (same queue for sending messages)
}

export const subscribeUser = async (req, res) => {
  const { phone } = req.parameters;

  const phoneWithCountryCode = "+1" + phone;

  try {
    const user = await Users.findOneAndUpdate({ phone: phoneWithCountryCode, optInPhone: true });
    if (user) {
      return res.status(200).json('User has unsubscribed');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error. Try again later');
  }

  // TODO: send to queue to handle twilio message (same queue for sending messages)
}

export const sendTextMessage = async (req, res) => {
  const { phone } = req.parameters;
  const { message } = req.body;

  const phoneWithCountryCode = "+1" + phone;

  try {
    const user = await Users.findOne({ phone: phoneWithCountryCode, optInPhone: true });
    if (user) {
      sendSMS(phoneWithCountryCode, message);
      return res.status(200).json('Message sent to user');
    }
    return res.status(404).json('User not found or receiving text messages');
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error. Try again later');
  }
}