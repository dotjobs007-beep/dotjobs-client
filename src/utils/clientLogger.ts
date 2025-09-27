import service from "@/helper/service.helper";

type LogLevel = "info" | "warn" | "error";

const sendLog = async (level: LogLevel, message: string, meta?: any) => {
  try {
    await service.fetcher("/client/logs", "POST", {
      data: { level, message, meta },
    });
  } catch (e) {
    // best-effort, don't break app
    console.debug("clientLogger failed to send log", e);
  }
};

export default { sendLog };
