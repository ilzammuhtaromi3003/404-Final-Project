const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

const warehouseController = {
  getAll: async (req, res) => {
    const warehouses = await prisma.warehouse.findMany({
      where: { deleted: false },
    });
    res.status(200).json({ warehouses });
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const warehouse = await prisma.warehouse.findUnique({
        where: { warehouse_id: Number(id) },
      });
      res.status(200).json(warehouse);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  },

  addWarehouse: async (req, res) => {
    try {
      const adminId = req.admin.admin_id;
      const {
        warehouse_name,
        province_id,
        province_name,
        city_id,
        city_name,
        postal_code,
      } = req.body;

      const warehouse = await prisma.warehouse.create({
        data: {
          warehouse_name,
          province_id: parseInt(province_id),
          province_name,
          city_id: parseInt(city_id),
          city_name,
          postal_code: parseInt(postal_code),
          admin_id: adminId,
        },
      });
      res
        .status(201)
        .json({ message: "Warehouse data successfuly created", warehouse });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  },

  editWarehouse: async (req, res) => {
    try {
      const adminId = req.admin.admin_id;
      const { id } = req.params;
      const {
        warehouse_name,
        province_id,
        province_name,
        city_id,
        city_name,
        postal_code,
      } = req.body;
      const warehouse = await prisma.warehouse.update({
        where: { warehouse_id: Number(id) },
        data: {
          warehouse_name,
          province_id: parseInt(province_id),
          province_name,
          city_id: parseInt(city_id),
          city_name,
          postal_code: parseInt(postal_code),
          admin_id: adminId, // harus di sesuaikan
          updated_at: new Date(),
        },
      });
      res
        .status(201)
        .json({ message: "Warehouse data successfuly updated", warehouse });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  },

  deleteWarehouse: async (req, res) => {
    try {
      const { id } = req.params;
      // const product = await prisma.product.deleteMany({
      //   where: {
      //     warehouse_id: Number(id),
      //   },
      // });
      const warehouse = await prisma.warehouse.update({
        where: {
          warehouse_id: Number(id),
        },
        data: { deleted: true },
      });
      res.status(200).json({
        message: "Warehouse data successfuly deleted",
        warehouse,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  },
};

module.exports = warehouseController;
