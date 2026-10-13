import { expect, test } from 'claude-code/testing'

const USAGE = [{ kind: 'five_hour', percentUsed: 38, resetsAt: '2026-10-13T18:00:00Z' }]

test('모바일이 붙으면 상태줄에 텍스트로, 떨어지면 지운다', async ($, on) => {
  let surfaces: ('terminal' | 'desktop' | 'mobile' | 'vscode')[] = ['desktop']
  const statuses: (string | undefined)[] = []

  on('session.surfaces', () => ({ value: surfaces }))
  on('ui.status', (_$, e) => {
    statuses.push(e.text)

    return { value: undefined }
  })
  on('session.attach', (_$, e) => ({ clientId: e.clientId }))
  on('session.detach', (_$, e) => ({ clientId: e.clientId }))
  on('session.usage', () => ({ value: { rateLimits: USAGE } }) as never)
  on('session.start', (_$, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(statuses.at(-1)).toBeUndefined()

  surfaces = ['desktop', 'mobile']
  await $.session.attach({ surface: 'mobile', clientId: 'mobile:default' })
  expect(statuses.at(-1)).toBe('5시간 ▰▰▰▰▰▰▱▱▱▱ 38% · 주간 ▱▱▱▱▱▱▱▱▱▱ 대기 중')

  surfaces = ['desktop']
  await $.session.detach({ surface: 'mobile', clientId: 'mobile:default', reason: 'detach' })
  expect(statuses.at(-1)).toBeUndefined()
})
