-- Rename enum value in place so existing rows keep their status.
ALTER TYPE "BookingStatus" RENAME VALUE 'APPROVED' TO 'ACCEPTED';
