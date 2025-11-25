const encoder = new TextEncoder()

export async function GET() {
  let interval: ReturnType<typeof setInterval>

  const stream = new ReadableStream({
    start(controller) {
      const sendDirective = () => {
        const payload = {
          message: "Please verify the pending transactions dashboard",
          issuedAt: new Date().toISOString(),
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      controller.enqueue(encoder.encode(`event: ready\ndata: ok\n\n`))
      sendDirective()
      interval = setInterval(sendDirective, 15000)
    },
    cancel() {
      clearInterval(interval)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}

