export const timeConvert = (date: Date) => {
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${hours}:${minutes}:00`;
};

export const countWeekdays = (year: number, month: number) => {
    var count = 0;
    var date = new Date(year, month, 1);
  
    // Lặp qua tất cả các ngày trong tháng
    while (date.getMonth() === month) {
      // Kiểm tra ngày không phải là thứ 7 (6) và chủ nhật (0)
      if (date.getDay() !== 6 && date.getDay() !== 0) {
        count++;
      }
  
      // Tăng ngày lên 1
      date.setDate(date.getDate() + 1);
    }
  
    return count;
  }
  