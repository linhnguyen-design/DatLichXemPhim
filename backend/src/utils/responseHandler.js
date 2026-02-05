exports.CreateSuccessRes = (res, data = {}, message = "Thành công") => {
  try {
    const safeData = JSON.parse(JSON.stringify(data));
    if (!res.headersSent) {
      return res.status(200).json({
        success: true,
        message,
        data: safeData,
      });
    }
  } catch (error) {
    console.error("Lỗi khi gửi response:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi xử lý dữ liệu phản hồi",
      });
    }
  }
};
