const Customer = require("../models/Customer");

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server Error fetching customers" });
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    // Check if customer exists
    let existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer with this phone already exists" });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      totalVisits: 1,
      lastVisit: new Date()
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server Error creating customer" });
  }
};

// @desc    Update customer points/visits
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res) => {
  try {
    const { loyaltyPoints, addVisit } = req.body;
    
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (loyaltyPoints !== undefined) {
      customer.loyaltyPoints = loyaltyPoints;
    }
    
    if (addVisit) {
      customer.totalVisits += 1;
      customer.lastVisit = new Date();
    }

    const updatedCustomer = await customer.save();
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Server Error updating customer" });
  }
};
