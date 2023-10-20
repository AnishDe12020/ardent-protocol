import { Tier } from "@prisma/client"

export const getTier = (points: number) => {
  if (points > 50) {
    return Tier.DIAMOND
  } else if (points > 25) {
    return Tier.PLATINUM
  } else if (points > 10) {
    return Tier.GOLD
  } else if (points > 5) {
    return Tier.SILVER
  } else {
    return Tier.BRONZE
  }
}
