import type { Role } from '../../sim/types.js'
import type { ChoicePool } from './types.js'
import { genericPools } from './genericChoices.js'
import { topPools }     from './topChoices.js'
import { junglerPools } from './junglerChoices.js'
import { adcPools }     from './adcChoices.js'
import { supportPools } from './supportChoices.js'

export type { ChoiceOption, ChoicePool } from './types.js'

const ROLE_POOLS: Record<Role, typeof genericPools> = {
  top:     topPools,
  jungle:  junglerPools,
  mid:     genericPools,   // mid gets its own pools in a later pass
  adc:     adcPools,
  support: supportPools,
}

export function getChoicePool(role: Role, phasePoolId: string): ChoicePool {
  return ROLE_POOLS[role]?.[phasePoolId] ?? genericPools[phasePoolId]
}
