import type {
  Toast,
  ToastActionElement,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000

type ToasterToast = ReturnType<typeof createToast>

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let memoryState: {
  toasts: ToasterToast[]
} = {
  toasts: [],
}

function dispatch(
  action:
    | {
        type: typeof actionTypes.ADD_TOAST
        toast: ToasterToast
      }
    | {
        type: typeof actionTypes.UPDATE_TOAST
        toast: Partial<ToasterToast>
      }
    | {
        type: typeof actionTypes.DISMISS_TOAST
        toastId?: ToasterToast["id"]
      }
    | {
        type: typeof actionTypes.REMOVE_TOAST
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

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

let listeners: ((state: State) => void)[] = []

function createToast(props: Omit<ToasterToast, "id" | "open" | "title">) {
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

function toast({
  ...props
}: Omit<ToasterToast, "id" | "open" | "title">) {
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
