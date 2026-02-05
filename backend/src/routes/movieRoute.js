const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { CreateSuccessRes } = require("../utils/responseHandler");

router.get("/", async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      include: { genres: true },
    });

    // ✅ chỉ gọi response 1 lần
    return CreateSuccessRes(res, movies, "Danh sách phim");
  } catch (err) {
    console.error("Lỗi lấy danh sách phim:", err);
    if (!res.headersSent)
      return res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;
