// Type declarations for Lenis
declare module "@studio-freight/lenis" {
  export default class Lenis {
    constructor(options?: {
      duration?: number
      easing?: (t: number) => number
      syncTouch?: boolean
      autoRaf?: boolean
      smoothWheel?: boolean
      smoothTouch?: boolean
    })

    scrollTo(
      target: string | HTMLElement | number,
      options?: {
        duration?: number
        easing?: (t: number) => number
        offset?: number
      },
    ): void

    on(event: string, callback: Function): void
    off(event: string, callback: Function): void
    destroy(): void
    start(): void
    stop(): void
  }
}

declare global {
  interface Window {
    lenis?: import("@studio-freight/lenis").default
  }
}
