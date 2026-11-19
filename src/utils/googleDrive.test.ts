import { describe, expect, it } from 'vitest'
import { toDriveDirectImageUrl } from '@/utils/googleDrive'

const direct = 'https://drive.google.com/thumbnail?id=abc_123-XY&sz=w1000'

describe('toDriveDirectImageUrl', () => {
  it('converts a /file/d/ share link', () => {
    expect(toDriveDirectImageUrl('https://drive.google.com/file/d/abc_123-XY/view?usp=sharing')).toBe(direct)
  })

  it('converts an open?id= link', () => {
    expect(toDriveDirectImageUrl('https://drive.google.com/open?id=abc_123-XY')).toBe(direct)
  })

  it('converts a uc?id=&export= link', () => {
    expect(toDriveDirectImageUrl('https://drive.google.com/uc?id=abc_123-XY&export=download')).toBe(direct)
  })

  it('trims and leaves other hosts unchanged', () => {
    expect(toDriveDirectImageUrl('  https://example.com/car.jpg ')).toBe('https://example.com/car.jpg')
  })

  it('leaves an empty value empty', () => {
    expect(toDriveDirectImageUrl('')).toBe('')
  })
})
