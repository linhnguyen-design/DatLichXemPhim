const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Bắt đầu seed dữ liệu...");

  // Seed Movies
  await prisma.movie.createMany({
    data: [
    {
      title: "Avengers: Endgame",
      description: "Marvel siêu phẩm kết thúc chuỗi Infinity Saga.",
      duration: 180,
      imageUrl: "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg",
    },
    {
      title: "Inception",
      description: "Bom tấn hack não của Christopher Nolan.",
      duration: 148,
      imageUrl: "https://m.media-amazon.com/images/I/91I3h3kfp-L._AC_SY679_.jpg",
    },
    {
      title: "Spider-Man: No Way Home",
      description: "Người Nhện đa vũ trụ cùng ba phiên bản Peter Parker.",
      duration: 155,
      imageUrl: "https://m.media-amazon.com/images/I/81FQS2Y8VqL._AC_SL1500_.jpg",
    },
    {
      title: "Oppenheimer",
      description: "Bộ phim về cha đẻ của bom nguyên tử.",
      duration: 180,
      imageUrl: "https://m.media-amazon.com/images/I/71NfYFJ4E0L._AC_SL1500_.jpg",
    },
    {
      title: "Inside Out 2",
      description: "Cảm xúc tuổi dậy thì của cô bé Riley trở lại.",
      duration: 110,
      imageUrl: "https://m.media-amazon.com/images/I/81KzEayc2hL._AC_SL1500_.jpg",
    }
  ],
  skipDuplicates: true,
});


  // Lấy danh sách phim sau khi tạo
  const movies = await prisma.movie.findMany();

  // Seed ShowTimes
  const showTimes = movies.flatMap((movie, index) => {
    const baseDate = new Date();
    return [
      {
        movieId: movie.id,
        startTime: new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 14:00 hôm sau
        endTime: new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),   // 17:00
        room: `Room ${index + 1}`,
        price: 100 + index * 10,
      },
      {
        movieId: movie.id,
        startTime: new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // 19:00
        endTime: new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000 + 21.5 * 60 * 60 * 1000), // 21:30
        room: `Room ${index + 1}`,
        price: 100 + index * 10,
      }
    ];
  });

  await prisma.showTime.createMany({
    data: showTimes,
    skipDuplicates: true,
  });

  console.log("✅ Seed dữ liệu phim & lịch chiếu thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed dữ liệu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
