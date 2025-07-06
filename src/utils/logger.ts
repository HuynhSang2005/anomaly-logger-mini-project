import pino from 'pino';

// Config của logger:
const logger = pino({
  level: 'info', // Chỉ log các cấp độ 'info' trở lên
  transport: process.env.NODE_ENV !== 'production'
    ? {
        // Sử dụng pino-pretty để định dạng log đẹp hơn :>
        target: 'pino-pretty',
        options: {
          colorize: true, 
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss', // Define thời gian
          ignore: 'pid,hostname', // Bỏ qua các field không cần thiết
        },
      }
    : undefined,
});

export default logger;