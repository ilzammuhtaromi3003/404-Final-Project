const { PrismaClient } = require("../../prisma/generated/client");
const prisma = new PrismaClient();

const getProducts = async (req, res) => {
  const {
    page = 1,
    limit = 12,
    sort = null,
    filter = null,
    search = null,
  } = req.query;

  try {
    let options = {
      take: +limit,
      skip: (+page - 1) * +limit,
      where: { is_available: true },
    };

    if (!!filter) {
      options.where = {
        category_id: parseInt(filter),
      };
    }

    if (!!search) {
      options.where = {
        ...options.where,
        name: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    const totalProducts = await prisma.product.count({
      where: { is_available: true },
    });
    // console.log(totalProducts);
    let products = await prisma.product.findMany(options);

    if (!!sort) {
      switch (sort) {
        case "lowToHigh":
          products = products.sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          );
          break;
        case "highToLow":
          products = products.sort(
            (a, b) => parseFloat(b.price) - parseFloat(a.price)
          );
          break;
        case "byNameAsc":
          products = products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "byNameDesc":
          products = products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          products = products.sort((a, b) => a.product_id - b.product_id);
          break;
      }
    }

    res.status(200).json({
      success: true,
      data: products,
      length: !!filter ? products.length : totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { is_available: true },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { product_id: Number(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count({
      where: { is_available: true },
    });
    res.json({ totalProducts });
  } catch (error) {
    console.error("Error fetching total products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getTotalProducts,
  getAllProducts,
};
