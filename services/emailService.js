// backend/services/emailService.js

export const sendBookingEmails = async (booking) => {
  console.log("📧 Email service triggered");
  console.log("Booking details:", booking);

  // Simulate async email sending
  return Promise.resolve(true);
};