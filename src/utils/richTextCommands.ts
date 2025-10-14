type CommandValue = string | number | null;

export const applyCommand = (command: string, value: CommandValue = null): void => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    document.execCommand(command, false, value !== null ? value.toString() : undefined);
  }
};

export const COMMANDS = {
  TEXT_SIZE: (size: number = 3): void => applyCommand("fontSize", size), // size 1–7
  UNDERLINE: (): void => applyCommand("underline"),
  BOLD: (): void => applyCommand("bold"),
  ITALIC: (): void => applyCommand("italic"),
  LINK: (url: string | null = prompt("Enter URL")): void => {
    if (url) applyCommand("createLink", url);
  },
  ATTACHMENT: (): void => {
    alert("Attachment functionality needs custom implementation.");
  },
  CUT: (): void => applyCommand("cut"),
  COPY: (): void => applyCommand("copy"),
  REDO: (): void => applyCommand("redo"),
  UNDO: (): void => applyCommand("undo"),
};
