// controllers/showTimeController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.GetAll = async () => {
  return prisma.showTime.findMany({
    include: { movie: true, room: true },
  });
};

exports.GetByMovie = async (movieId) => {
  return prisma.showTime.findMany({
    where: { movieId: Number(movieId) },
    include: { movie: true, room: true },
  });
};

exports.GetById = async (id) => {
  return prisma.showTime.findUnique({
    where: { id: Number(id) },
    include: { movie: true, room: true },
  });
};

exports.Create = async (body) => {
  return prisma.showTime.create({
    data: body,
  });
};

exports.Update = async (id, body) => {
  return prisma.showTime.update({
    where: { id: Number(id) },
    data: body,
  });
};

exports.Delete = async (id) => {
  return prisma.showTime.delete({
    where: { id: Number(id) },
  });
};

exports.GetSeats = async (showTimeId) => {
  return prisma.seat.findMany({
    where: { showTimeId: Number(showTimeId) },
  });
};
