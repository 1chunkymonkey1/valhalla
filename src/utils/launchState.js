import { schedule } from '../data/schedule'

export function parseLaunchTime(isoString) {
  return new Date(isoString)
}

export function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00'

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

export function formatDropHour(isoString) {
  return parseLaunchTime(isoString).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function getLaunchStates(now = new Date()) {
  const timestamps = schedule.map((item) => ({
    ...item,
    launchDate: parseLaunchTime(item.launchTime),
  }))

  const launched = timestamps.filter((item) => now >= item.launchDate)
  const upcoming = timestamps.filter((item) => now < item.launchDate)

  const liveItem = launched.length > 0 ? launched[launched.length - 1] : null
  const nextItem = upcoming.length > 0 ? upcoming[0] : null

  const msToNext = nextItem ? nextItem.launchDate - now : 0

  const cardStates = timestamps.map((item) => {
    if (now >= item.launchDate) {
      return { ...item, state: 'live' }
    }
    if (nextItem && item.id === nextItem.id) {
      return { ...item, state: 'next' }
    }
    return { ...item, state: 'locked' }
  })

  return {
    cardStates,
    liveItem,
    nextItem,
    msToNext,
    allLaunched: upcoming.length === 0,
    eventStarted: launched.length > 0,
  }
}
