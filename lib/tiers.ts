export const getTier = (points: number) => {
  if (points >= 50) {
    return "DIAMOND"
  } else if (points >= 25) {
    return "PLATINUM"
  } else if (points >= 10) {
    return "GOLD"
  } else if (points >= 5) {
    return "SILVER"
  } else {
    return "BRONZE"
  }
}
