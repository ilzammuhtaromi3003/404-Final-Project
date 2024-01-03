const { PrismaClient } = require("./generated/client");
const prisma = new PrismaClient();

async function main() {
  //seeding Admin
  const admin = await prisma.admin.create({
    data: {
      username: "admin",
      password: "admin",
    },
  });
  //end of seeding Admin

  //Seeding Warehouse
  const warehouse = await prisma.warehouse.createMany({
    data: [
      {
        province_id: 31,
        warehouse_name: "Kalideres",
        province_name: "DKI Jakarta",
        city_id: 1,
        city_name: "Jakarta Pusat",
        postal_code: 10110,
        admin_id: 1,
      },
      {
        province_id: 31,
        warehouse_name: "Kalikalian",
        province_name: "DKI Jakarta",
        city_id: 2,
        city_name: "Jakarta Selatan",
        postal_code: 12110,
        admin_id: 1,
      },
    ],
  });
  //end of seeding Warehouse

  // //Seeding Category
  // const category = await prisma.category.createMany({
  //   data: [
  //     {
  //       category_name: "Category 1",
  //     },
  //     {
  //       category_name: "Category 2",
  //     },
  //     {
  //       category_name: "Category 3",
  //     },
  //     {
  //       category_name: "Category 4",
  //     },
  //     {
  //       category_name: "Category 5",
  //     },
  //   ],
  // });
  // Delete all existing OrderItems
  await prisma.orderItem.deleteMany();

  // Delete all existing ShoppingCartItems
  await prisma.shoppingCartItem.deleteMany();

  // Delete all existing products
  await prisma.product.deleteMany();

  await prisma.promotion.deleteMany();

  const product = await prisma.product.createMany({
    data: [
      {
        name: "Switsall",
        description: "Description for Product 1",
        price: 18000,
        stock: 100,
        is_available: true,
        category_id: 1,
        warehouse_id: 1,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2022/6/28/1f7d2b33-708e-460a-a680-cf86649e6e23.jpg",
        weight: 500,
      },
      {
        name: "SGM",
        description: "Susu SGM",
        price: 95000,
        stock: 50,
        is_available: true,
        category_id: 1,
        warehouse_id: 1,
        image:
          "https://images.tokopedia.net/img/cache/900/hDjmkQ/2023/12/6/78dfeaeb-4285-453f-80cd-36c374c5863b.jpg",
        weight: 400,
      },
      {
        name: "Cusson baby bottle",
        description: "bottle",
        price: 31500,
        stock: 75,
        is_available: true,
        category_id: 2,
        warehouse_id: 2,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/10/828fca69-244a-450b-8907-d062e32c5869.jpg",
        weight: 700,
      },
      {
        name: "Pampers XL",
        description: "popok",
        price: 309000,
        stock: 120,
        is_available: true,
        category_id: 2,
        warehouse_id: 2,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/5/9/fb7bc428-dd51-4e38-9796-c29660442a46.jpg",
        weight: 0.6,
      },
      {
        name: "Baju bayi dino",
        description: "Baju",
        price: 95000,
        stock: 90,
        is_available: true,
        category_id: 3,
        warehouse_id: 1,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2021/9/8/06eed048-7b60-4d57-aa33-ab039d6c194d.jpg",
        weight: 0.8,
      },
      {
        name: "Sendal Bayi",
        description: "Sendal",
        price: 80000,
        stock: 60,
        is_available: true,
        category_id: 3,
        warehouse_id: 1,
        image:
          "https://images.tokopedia.net/img/cache/900/hDjmkQ/2023/2/28/156d7585-a822-4dde-bf2a-77ba1263462b.png",
        weight: 0.4,
      },
      {
        name: "Celana Bayi",
        description: "Celana",
        price: 79000,
        stock: 30,
        is_available: false,
        category_id: 4,
        warehouse_id: 2,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2020/11/4/8a032b65-bb05-45a1-b1ea-20ffdebb5fbb.jpg",
        weight: 1.2,
      },
      {
        name: "Switsall",
        description: "Description for Product 1",
        price: 18000,
        stock: 100,
        is_available: true,
        category_id: 1,
        warehouse_id: 1,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2022/6/28/1f7d2b33-708e-460a-a680-cf86649e6e23.jpg",
        weight: 500,
      },
      {
        name: "SGM",
        description: "Susu SGM",
        price: 95000,
        stock: 50,
        is_available: true,
        category_id: 1,
        warehouse_id: 1,
        image:
          "https://images.tokopedia.net/img/cache/900/hDjmkQ/2023/12/6/78dfeaeb-4285-453f-80cd-36c374c5863b.jpg",
        weight: 400,
      },
      {
        name: "Cusson baby bottle",
        description: "bottle",
        price: 31500,
        stock: 75,
        is_available: true,
        category_id: 2,
        warehouse_id: 2,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/8/10/828fca69-244a-450b-8907-d062e32c5869.jpg",
        weight: 700,
      },
      {
        name: "Pampers XL",
        description: "popok",
        price: 309000,
        stock: 120,
        is_available: true,
        category_id: 2,
        warehouse_id: 2,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2023/5/9/fb7bc428-dd51-4e38-9796-c29660442a46.jpg",
        weight: 0.6,
      },
      {
        name: "Baju bayi dino",
        description: "Baju",
        price: 95000,
        stock: 90,
        is_available: true,
        category_id: 3,
        warehouse_id: 1,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2021/9/8/06eed048-7b60-4d57-aa33-ab039d6c194d.jpg",
        weight: 0.8,
      },
      {
        name: "Sendal Bayi",
        description: "Sendal",
        price: 80000,
        stock: 60,
        is_available: true,
        category_id: 3,
        warehouse_id: 1,
        image:
          "https://images.tokopedia.net/img/cache/900/hDjmkQ/2023/2/28/156d7585-a822-4dde-bf2a-77ba1263462b.png",
        weight: 0.4,
      },
      {
        name: "Celana Bayi",
        description: "Celana",
        price: 79000,
        stock: 30,
        is_available: false,
        category_id: 4,
        warehouse_id: 2,
        image:
          "https://images.tokopedia.net/img/cache/900/VqbcmM/2020/11/4/8a032b65-bb05-45a1-b1ea-20ffdebb5fbb.jpg",
        weight: 1.2,
      },
    ],
  });

  //seeding User

  // const user = await prisma.user.createMany({
  //   data: [
  //     {
  //       full_name: "John Doe",
  //       password: "securepassword1",
  //       email: "john.doe@example.com",
  //       affiliate_code: "ABC123",
  //       affiliate_usage: true,
  //     },
  //     {
  //       full_name: "Jane Smith",
  //       password: "strongpass2023",
  //       email: "jane.smith@example.com",
  //       affiliate_code: "XYZ789",
  //       affiliate_usage: false,
  //     },
  //     {
  //       full_name: "Mike Johnson",
  //       password: "mypassword123",
  //       email: "mike.johnson@example.com",
  //       affiliate_code: "DEF456",
  //       affiliate_usage: true,
  //     },
  //     {
  //       full_name: "Emily Brown",
  //       password: "secretword321",
  //       email: "emily.brown@example.com",
  //       affiliate_code: "GHI789",
  //       affiliate_usage: false,
  //     },
  //     {
  //       full_name: "Alex Turner",
  //       password: "pass1234word",
  //       email: "alex.turner@example.com",
  //       affiliate_code: "JKL012",
  //       affiliate_usage: true,
  //     },
  //     {
  //       full_name: "Grace Wilson",
  //       password: "gracefulpass",
  //       email: "grace.wilson@example.com",
  //       affiliate_code: "MNO345",
  //       affiliate_usage: false,
  //     },
  //     {
  //       full_name: "Daniel Lee",
  //       password: "danielpass456",
  //       email: "daniel.lee@example.com",
  //       affiliate_code: "PQR678",
  //       affiliate_usage: true,
  //     },
  //     {
  //       full_name: "Olivia Moore",
  //       password: "oliviapass789",
  //       email: "olivia.moore@example.com",
  //       affiliate_code: "STU901",
  //       affiliate_usage: false,
  //     },
  //     {
  //       full_name: "William Davis",
  //       password: "william123pass",
  //       email: "william.davis@example.com",
  //       affiliate_code: "VWX234",
  //       affiliate_usage: true,
  //     },
  //     {
  //       full_name: "Sophia Rodriguez",
  //       password: "sophiapass567",
  //       email: "sophia.rodriguez@example.com",
  //       affiliate_code: "YZA567",
  //       affiliate_usage: false,
  //     },
  //   ],
  // });

  await prisma.promotion.create({
    data: {
      type: "percentage",
      maximum_usage: 100,
      amount: 10,
      remaining_usage: 100,
      admin_id: 1,
      promo_code: "percentage_10_off",
    },
  });

  await prisma.promotion.create({
    data: {
      type: "fixed",
      maximum_usage: 50,
      amount: 50,
      remaining_usage: 50,
      admin_id: 1,
      promo_code: "fixed_50",
    },
  });

  await prisma.promotion.create({
    data: {
      type: "category 1",
      maximum_usage: 50,
      amount: 15, // 15% discount for specific category
      remaining_usage: 50,
      admin_id: 1,
      promo_code: "category 1",
    },
  });

  console.log("Promo seed data created successfully");
}

main()
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
