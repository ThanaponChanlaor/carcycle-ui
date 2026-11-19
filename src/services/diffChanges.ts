import type { Car, CarChangeRecord, CarUpdateInput } from '@/types'

/** History records for the fields in `changes` that differ from `current`. Shared by every data source. */
export function diffChanges(current: Omit<Car, 'id'>, changes: CarUpdateInput): CarChangeRecord[] {
  return (Object.keys(changes) as (keyof CarUpdateInput)[])
    .filter((field) => changes[field] !== undefined && String(changes[field]) !== String(current[field] ?? ''))
    .map((field) => ({
      field,
      oldValue: String(current[field] ?? ''),
      newValue: String(changes[field]),
    }))
}
