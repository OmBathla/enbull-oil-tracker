export const OIL_INTERVALS = {
  "Enbull Standard": { km: 3000, months: 3 },
  "Enbull Synthetic": { km: 5000, months: 6 },
  "Enbull Premium": { km: 7000, months: 8 }
};

export function calculateNextDue(record) {
  const interval = OIL_INTERVALS[record.oilProduct];
  const nextDueMileage = Number(record.lastChangeMileage) + interval.km;

  const nextDate = new Date(record.lastChangeDate);
  nextDate.setMonth(nextDate.getMonth() + interval.months);
  const nextDueDate = nextDate.toISOString().split("T")[0];

  return { nextDueMileage, nextDueDate };
}

export function getStatus(record) {
  const kmRemaining = record.nextDueMileage - Number(record.currentMileage);
  const daysRemaining =
    (new Date(record.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24);

  if (kmRemaining <= 0 || daysRemaining <= 0) return "Overdue";
  if (kmRemaining <= 300 || daysRemaining <= 7) return "Due Soon";
  return "Safe";
}