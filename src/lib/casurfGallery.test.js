import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { photosInSet, shareUrl, toggleFavorite } from './casurfGallery.js'

describe('casurf gallery helpers', () => {
  it('toggles favorites on and off', () => {
    const once = toggleFavorite([], 'a')
    assert.deepEqual(once, ['a'])
    assert.deepEqual(toggleFavorite(once, 'a'), [])
    assert.deepEqual(toggleFavorite(once, 'b'), ['a', 'b'])
  })

  it('filters gallery sets', () => {
    const photos = [
      { id: '1', set: 'campus' },
      { id: '2', set: 'bay' },
    ]
    assert.equal(photosInSet(photos, 'all').length, 2)
    assert.deepEqual(
      photosInSet(photos, 'bay').map((p) => p.id),
      ['2'],
    )
  })

  it('builds share URLs', () => {
    const href = shareUrl('https://example.com', '/casurfberkeley/gallery', {
      photo: 'campanile-path',
      set: 'campus',
    })
    assert.equal(
      href,
      'https://example.com/casurfberkeley/gallery?photo=campanile-path&set=campus',
    )
  })
})
