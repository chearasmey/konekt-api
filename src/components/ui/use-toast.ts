
import * as React from "react"

const TOAST_LIMIT = 1

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactElement
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ToasterToast = Toast

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const memoryState: {
  toasts: ToasterToast[]
} = {
  toasts: [],
}

function dispatch(
  action:
    | {
        type: "ADD_TOAST"
        toast: ToasterToast
      }
    | {
        type: "UPDATE_TOAST"
        toast: Partial<ToasterToast>
      }
    | {
        type: "DISMISS_TOAST"
        toastId?: ToasterToast["id"]
      }
    | {
        type: "REMOVE_TOAST"
        toastId?: ToasterToast["id"]
      }
) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState.toasts = [action.toast, ...memoryState.toasts].slice(
        0,
        TOAST_LIMIT
      )
      break

    case "UPDATE_TOAST":
      memoryState.toasts = memoryState.toasts.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      )
      break

    case "DISMISS_TOAST": {
      const { toastId } = action

      memoryState.toasts = memoryState.toasts.map((t) =>
        t.id === toastId || toastId === undefined
          ? {
              ...t,
              open: false,
            }
          : t
      )
      break
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        memoryState.toasts = []
      } else {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId)
      }
      break
  }

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

interface State {
  toasts: Toast[]
}

const listeners: ((state: State) => void)[] = []

function createToast(props: Omit<Toast, "id" | "open" | "onOpenChange">) {
  const id = genId()

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  return {
    ...props,
    id,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open) dismiss()
    },
  }
}

function toast(props: Omit<Toast, "id" | "open" | "onOpenChange">) {
  const t = createToast(props)
  dispatch({
    type: "ADD_TOAST",
    toast: t,
  })
  return t
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
