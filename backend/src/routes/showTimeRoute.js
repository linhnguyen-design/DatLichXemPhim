const express = require("express");
const router = express.Router();
const showTimeController = require("../controllers/showTimeController");
const { CheckAuth, CheckRole } = require("../utils/check_auth");
const { CreateSuccessRes } = require("../utils/responseHandler");

router.get("/", async (req, res, next) => {
  try {
    const showTimes = await showTimeController.GetAll();
    return CreateSuccessRes(res, showTimes, "Lấy tất cả suất chiếu thành công");
  } catch (error) {
    next(error);
  }
});

router.get("/movie/:movieId", async (req, res, next) => {
  try {
    const showTimes = await showTimeController.GetByMovie(req.params.movieId);
    return CreateSuccessRes(res, showTimes, "Lấy suất chiếu theo phim thành công");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const showTime = await showTimeController.GetById(req.params.id);
    return CreateSuccessRes(res, showTime, "Lấy suất chiếu thành công");
  } catch (error) {
    next(error);
  }
});

router.post("/", [CheckAuth, CheckRole], async (req, res, next) => {
  try {
    const newShowTime = await showTimeController.Create(req.body);
    return CreateSuccessRes(res, newShowTime, "Tạo suất chiếu thành công");
  } catch (error) {
    next(error);
  }
});

router.put("/:id", [CheckAuth, CheckRole], async (req, res, next) => {
  try {
    const updatedShowTime = await showTimeController.Update(req.params.id, req.body);
    return CreateSuccessRes(res, updatedShowTime, "Cập nhật suất chiếu thành công");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", [CheckAuth, CheckRole], async (req, res, next) => {
  try {
    const deletedShowTime = await showTimeController.Delete(req.params.id);
    return CreateSuccessRes(res, deletedShowTime, "Xóa suất chiếu thành công");
  } catch (error) {
    next(error);
  }
});

router.get("/:id/seats", async (req, res, next) => {
  try {
    const seats = await showTimeController.GetSeats(req.params.id);
    return CreateSuccessRes(res, seats, "Lấy danh sách ghế thành công");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
