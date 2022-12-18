export function LoggDetails(
  employee,
  work_date,
  free_day,
  logged_hours,
  task,
  comment = ""
) {
  this.employee = employee.value;
  this.work_date = work_date.value;
  this.free_day = free_day.checked;
  this.logged_hours = logged_hours.value;
  this.task = task.value;
  this.comment = comment.value;
}
