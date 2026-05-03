import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ResumeViewer from './ResumeViewer'

vi.mock('react-pdf', async () => {
  const React = await vi.importActual('react')

  return {
    pdfjs: {
      GlobalWorkerOptions: {},
    },
    Document: ({ children, file, onLoadSuccess }) => {
      React.useEffect(() => {
        onLoadSuccess?.({ numPages: 2 })
      }, [onLoadSuccess])

      return <div data-testid="pdf-document" data-file={file}>{children}</div>
    },
    Page: ({ pageNumber, scale }) => (
      <div>{`Page ${pageNumber} @ ${Math.round(scale * 100)}%`}</div>
    ),
  }
})

describe('ResumeViewer', () => {
  it('loads the pdf, reacts to resize, and handles controls', async () => {
    window.innerWidth = 500
    const onClose = vi.fn()

    render(<ResumeViewer pdfUrl="/resume.pdf" onClose={onClose} />)

    expect(await screen.findByText('Page 1 @ 60%')).toBeInTheDocument()
    expect(screen.getByText('Page 2 @ 60%')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /download/i })).toHaveAttribute('href', '/resume.pdf')

    fireEvent.click(screen.getByTitle('Zoom In'))
    expect(screen.getByText('70%')).toBeInTheDocument()

    fireEvent.click(screen.getByTitle('Zoom Out'))
    fireEvent.click(screen.getByTitle('Zoom Out'))
    expect(screen.getByText('50%')).toBeInTheDocument()

    window.innerWidth = 900
    fireEvent(window, new Event('resize'))

    await waitFor(() => {
      expect(screen.getByText('80%')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTitle('Close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
