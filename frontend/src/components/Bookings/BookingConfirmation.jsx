/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Chip,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import TheatersIcon from "@mui/icons-material/Theaters";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MovieIcon from "@mui/icons-material/Movie";
import PaymentIcon from "@mui/icons-material/Payment";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showTimeId, selectedSeats, showTime, movieInfo, totalPrice } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const paymentIcons = {
    CASH: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
    CREDIT_CARD: "https://cdn-icons-png.flaticon.com/512/179/179457.png",
    PAYPAL: "https://cdn-icons-png.flaticon.com/512/174/174861.png",
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const bookingData = {
        showTimeId: showTime.id,
        seatNumbers: selectedSeats.map((seat) => seat.number),
        promotionCode: null,
        paymentMethod: paymentMethod,
      };

      const response = await fetch("http://localhost:5000/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể đặt vé");
      }

      const data = await response.json();
      if (data.success) {
        navigate(`/booking/success/${data.data.id}`);
      } else {
        throw new Error(data.message || "Đặt vé không thành công");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 20px rgba(229, 9, 20, 0.7)" },
    tap: { scale: 0.95 },
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(45deg, #0a0a0a, #1c2526, #0a0a0a)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(229, 9, 20, 0.3)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <MovieIcon sx={{ fontSize: 40, color: "#e50914", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "transparent",
                  background: "linear-gradient(45deg, #e50914, #ff6f61, #e50914)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Xác nhận đặt vé
              </Typography>
            </Box>

            {/* Thông tin phim */}
            <motion.div variants={childVariants}>
              <Typography variant="h6" sx={{ color: "#e50914", mb: 2 }}>
                Thông tin phim
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box
                      component="img"
                      src={movieInfo?.imageUrl || "/images/movies/default-movie.jpg"}
                      alt={movieInfo?.title}
                      sx={{ width: "100%", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5">{movieInfo?.title}</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                      {movieInfo?.genres?.map((genre) => (
                        <Chip key={genre.id} label={genre.name} size="small" />
                      ))}
                    </Box>
                    <Typography variant="body2">{movieInfo?.description}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Thời lượng: {movieInfo?.duration} phút
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>

            {/* Thông tin suất chiếu */}
            <motion.div variants={childVariants}>
              <Typography variant="h6" sx={{ color: "#e50914", mb: 2 }}>
                Thông tin suất chiếu
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Stack spacing={1}>
                  <Typography>
                    <AccessTimeIcon sx={{ mr: 1 }} />
                    {formatDateTime(showTime?.startTime)}
                  </Typography>
                  <Typography>
                    <TheatersIcon sx={{ mr: 1 }} />
                    Phòng: {showTime?.room}
                  </Typography>
                </Stack>
              </Paper>
            </motion.div>

            {/* Ghế đã chọn */}
            <motion.div variants={childVariants}>
              <Typography variant="h6" sx={{ color: "#e50914", mb: 2 }}>
                Ghế đã chọn
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Grid container spacing={1}>
                  {selectedSeats?.map((seat) => (
                    <Grid item key={seat.id}>
                      <Chip label={`Ghế ${seat.number}`} sx={{ background: "#e50914", color: "#fff" }} />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>

            {/* Thông tin thanh toán */}
            <motion.div variants={childVariants}>
              <Typography variant="h6" sx={{ color: "#e50914", mb: 2 }}>
                Thông tin thanh toán
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Giá vé:</Typography>
                    <Typography>{showTime?.price?.toLocaleString()}đ/vé</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Số lượng:</Typography>
                    <Typography>{selectedSeats?.length} vé</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Thành tiền:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#e50914" }}>
                      {totalPrice?.toLocaleString()}đ
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </motion.div>

            {/* Phương thức thanh toán */}
            <motion.div variants={childVariants}>
              <Typography variant="h6" sx={{ color: "#e50914", mb: 2 }}>
                Phương thức thanh toán
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="CASH"
                      control={<Radio sx={{ color: "#e50914" }} />}
                      label="Tiền mặt"
                    />
                    <FormControlLabel
                      value="CREDIT_CARD"
                      control={<Radio sx={{ color: "#e50914" }} />}
                      label="Thẻ tín dụng"
                    />
                    <FormControlLabel
                      value="PAYPAL"
                      control={<Radio sx={{ color: "#e50914" }} />}
                      label="PayPal"
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={childVariants}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <MotionButton
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(-1)}
                  sx={{ flex: 1, borderColor: "#e50914", color: "#e50914" }}
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  Quay lại
                </MotionButton>
                <MotionButton
                  variant="contained"
                  size="large"
                  onClick={handleBooking}
                  sx={{
                    flex: 2,
                    background: "linear-gradient(45deg, #e50914, #ff6f61)",
                    color: "#fff",
                  }}
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  Xác nhận đặt vé
                </MotionButton>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BookingConfirmation;

