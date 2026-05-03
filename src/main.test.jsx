import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createRootMock, renderMock } = vi.hoisted(() => ({
  createRootMock: vi.fn(),
  renderMock: vi.fn(),
}))

vi.mock('./App.jsx', () => ({
  default: () => <div>App bootstrap mock</div>,
}))

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}))

describe('main entrypoint', () => {
  beforeEach(() => {
    vi.resetModules()
    createRootMock.mockReset()
    renderMock.mockReset()
    createRootMock.mockReturnValue({ render: renderMock })
    document.body.innerHTML = '<div id="root"></div>'
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('boots the app into the root element', { timeout: 10000 }, async () => {
    await import('./main.jsx')

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'))
    expect(renderMock).toHaveBeenCalledTimes(1)
  })
})
