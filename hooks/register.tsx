import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit } from '../types'

const limits = atom({ plugin: 'usage-battery', key: 'limits' } as const, [])

const WINDOWS = [
  { kind: 'five_hour', label: '5시간' },
  { kind: 'seven_day', label: '주간' },
]

const CELLS = 10

// 칸마다 짙은 색에서 밝은 색으로 흐르는 그라데이션
const PALETTES = {
  emerald: ['#0F5E4A', '#13684F', '#177255', '#1B7C5B', '#208661', '#279068', '#309A70', '#3AA479', '#46AE83', '#54B88E'],
  gold: ['#7A5A12', '#836216', '#8C6A1A', '#95721F', '#9E7A24', '#A7822A', '#B08B31', '#B99438', '#C29D41', '#CBA74B'],
  garnet: ['#5E1A22', '#661D26', '#6F212A', '#78252F', '#812934', '#8A2E39', '#93333F', '#9C3945', '#A5404C', '#AE4853'],
}
const EMPTY = '#3A3F3D'

function palette(percentUsed: number) {
  if (percentUsed >= 90) return PALETTES.garnet
  if (percentUsed >= 70) return PALETTES.gold

  return PALETTES.emerald
}

// 휴대폰 배터리처럼 남은 양을 채워서 그린다
function filledCells(percentUsed: number) {
  const left = Math.max(0, Math.min(100, 100 - percentUsed))

  return Math.round((left / 100) * CELLS)
}

function untilReset(resetsAt: string | undefined, now: number) {
  if (!resetsAt) return ''

  const minutes = Math.max(0, Math.round((Date.parse(resetsAt) - now) / 60000))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60

  if (days > 0) return ` · ${days}일 ${hours}시간 후 초기화`
  if (hours > 0) return ` · ${hours}시간 ${mins}분 후 초기화`

  return ` · ${mins}분 후 초기화`
}

function pick(rateLimits: Limit[]): Limit[] {
  return rateLimits.map(({ kind, percentUsed, resetsAt }) => ({ kind, percentUsed, resetsAt }))
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const usage = await $.session.usage()
    await update($, limits, () => pick(usage.rateLimits))

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      await update($, limits, () => pick(e.rateLimits))
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, limits)
    const shown = WINDOWS.map(w => ({ ...w, limit: current.find(l => l.kind === w.kind) }))

    if (e.props.hasSurvey) {
      return next(e)
    }

    const now = await $.clock.now()
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box gap={3}>
        {shown.map(({ kind, label, limit }) =>
          !limit ? (
            <Box key={kind}>
              <Text color="#8A918E">{label} </Text>
              <Text color={EMPTY}>{'▱'.repeat(CELLS)}</Text>
              <Text color="#5C6360"> 대기 중</Text>
            </Box>
          ) : (
            <Box key={kind}>
              <Text color="#8A918E">{label} </Text>
              {Array.from({ length: CELLS }, (_, i) =>
                i < filledCells(limit.percentUsed) ? (
                  <Text color={palette(limit.percentUsed)[i]}>▰</Text>
                ) : (
                  <Text color={EMPTY}>▱</Text>
                ),
              )}
              <Box display="none" hover={{ display: 'flex' }}>
                <Text bold> {limit.percentUsed}% 사용</Text>
                <Text dimColor>{untilReset(limit.resetsAt, now)}</Text>
              </Box>
            </Box>
          ),
        )}
      </Box>
    )
  })
}
